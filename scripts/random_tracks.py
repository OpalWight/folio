import base64
import csv
import os
import random
import string
import time

import requests
from dotenv import load_dotenv

# Load variables from .env if it exists
load_dotenv()

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

if not CLIENT_ID or not CLIENT_SECRET:
    print(
        "Error: SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables not set."
    )
    exit(1)

TOTAL_TRACKS = 100
MIN_YEAR = 2024  # "after 2023"

# Dev mode caps search limit at 10 and rate limits are per rolling 30s window.
# ~1 req/sec keeps us well under the undisclosed dev-mode ceiling.
# NOTE: /audio-features endpoint is blocked (403) in dev mode as of Feb 2026.
SEARCH_LIMIT = 10
MAX_OFFSET = 150
REQUEST_DELAY = 1.0


def get_access_token():
    creds = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    resp = requests.post(
        "https://accounts.spotify.com/api/token",
        headers={"Authorization": f"Basic {creds}"},
        data={"grant_type": "client_credentials"},
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def random_query():
    return random.choice(string.ascii_lowercase)


def search_random_tracks(token, needed):
    headers = {"Authorization": f"Bearer {token}"}
    collected = {}

    while len(collected) < needed:
        query = random_query()
        offset = random.randint(0, MAX_OFFSET)
        params = {
            "q": f"{query} year:{MIN_YEAR}-2026",
            "type": "track",
            "limit": SEARCH_LIMIT,
            "offset": offset,
        }
        resp = requests.get(
            "https://api.spotify.com/v1/search",
            headers=headers,
            params=params,
        )
        if resp.status_code == 429:
            retry = int(resp.headers.get("Retry-After", 5))
            print(f"  Rate limited, waiting {retry}s...")
            time.sleep(retry)
            continue
        if resp.status_code != 200:
            print(f"  Search returned {resp.status_code}, retrying...")
            time.sleep(REQUEST_DELAY)
            continue

        items = resp.json().get("tracks", {}).get("items", [])
        for track in items:
            if track["id"] in collected:
                continue
            release = track["album"].get("release_date", "")
            year = int(release[:4]) if len(release) >= 4 else 0
            if year < MIN_YEAR:
                continue
            collected[track["id"]] = {
                "id": track["id"],
                "name": track["name"],
                "artist": ", ".join(a["name"] for a in track["artists"]),
                "album": track["album"]["name"],
                "album_type": track["album"].get("album_type", ""),
                "release_date": release,
                "duration_ms": track.get("duration_ms", ""),
                "explicit": track.get("explicit", ""),
                "track_number": track.get("track_number", ""),
                "disc_number": track.get("disc_number", ""),
                "total_tracks": track["album"].get("total_tracks", ""),
            }
            if len(collected) >= needed:
                break

        print(f"  Collected {len(collected)}/{needed} tracks...")
        time.sleep(REQUEST_DELAY)

    return list(collected.values())


FIELDNAMES = [
    "id",
    "name",
    "artist",
    "album",
    "album_type",
    "release_date",
    "duration_ms",
    "explicit",
    "track_number",
    "disc_number",
    "total_tracks",
]


def main():
    print("Authenticating...")
    token = get_access_token()

    print(f"Searching for {TOTAL_TRACKS} random tracks (year >= {MIN_YEAR})...")
    tracks = search_random_tracks(token, TOTAL_TRACKS)

    out_file = "scripts/random_tracks.csv"
    with open(out_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        for track in tracks:
            writer.writerow(track)

    print(f"Done! Wrote {len(tracks)} tracks to {out_file}")


if __name__ == "__main__":
    main()
