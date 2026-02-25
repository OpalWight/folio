import { json } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from '$env/static/private';

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;

const getAccessToken = async () => {
  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  return response.json();
};

export async function GET() {
  try {
    const { access_token } = await getAccessToken();

    // Try fetching currently playing
    const nowPlayingRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (nowPlayingRes.status === 200) {
      const song = await nowPlayingRes.json();
      if (song.item) {
        return json({
          isPlaying: true,
          title: song.item.name,
          artist: song.item.artists.map((_artist: any) => _artist.name).join(', '),
          album: song.item.album.name,
          progress_ms: song.progress_ms,
          duration_ms: song.item.duration_ms
        });
      }
    }

    // If not playing, fetch last played
    const recentlyPlayedRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const recent = await recentlyPlayedRes.json();
    const lastSong = recent.items[0].track;

    return json({
      isPlaying: false,
      title: lastSong.name,
      artist: lastSong.artists.map((_artist: any) => _artist.name).join(', '),
      album: lastSong.album.name,
      progress_ms: 0,
      duration_ms: lastSong.duration_ms
    });
  } catch (error) {
    console.error('Spotify API Error:', error);
    return json({ error: 'Failed to fetch Spotify data' }, { status: 500 });
  }
}
