import { json } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from '$env/static/private';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

// Access tokens last an hour; cache one per warm function instance.
let cached: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt - 30_000) return cached.token;
  const basic = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN }),
  });
  const body = await res.json();
  if (!res.ok || !body.access_token) {
    // e.g. { error: "invalid_grant", error_description: "Refresh token revoked" }
    // -> run `node scripts/spotify-auth.mjs` to mint a new one.
    throw new Error(`token refresh failed: ${res.status} ${body.error ?? ''} ${body.error_description ?? ''}`.trim());
  }
  cached = { token: body.access_token, expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000 };
  return body.access_token;
}

const shape = (track: any, isPlaying: boolean, progress_ms = 0) => ({
  isPlaying,
  title: track.name,
  artist: track.artists.map((a: any) => a.name).join(', '),
  album: track.album.name,
  albumArt: track.album.images?.[1]?.url ?? track.album.images?.[0]?.url ?? null,
  url: track.external_urls?.spotify ?? null,
  progress_ms,
  duration_ms: track.duration_ms,
});

export async function GET() {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    const token = await getAccessToken();
    const auth = { headers: { Authorization: `Bearer ${token}` } };

    const now = await fetch(NOW_PLAYING_ENDPOINT, auth);
    // 200 = playing (or paused with an item); 204 = nothing active.
    if (now.status === 200) {
      const song = await now.json();
      if (song?.item && song.currently_playing_type === 'track') {
        return json(shape(song.item, song.is_playing ?? true, song.progress_ms ?? 0), { headers });
      }
    }

    const recent = await fetch(RECENTLY_PLAYED_ENDPOINT, auth);
    if (!recent.ok) throw new Error(`recently-played failed: ${recent.status}`);
    const data = await recent.json();
    const last = data.items?.[0]?.track;
    if (!last) return json({ isPlaying: false, title: null }, { headers });
    return json(shape(last, false), { headers });
  } catch (error) {
    console.error('Spotify API Error:', error);
    return json({ error: 'Failed to fetch Spotify data' }, { status: 500, headers });
  }
}
