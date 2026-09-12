// One-shot Spotify re-authorization. Run: node scripts/spotify-auth.mjs
// Opens the Spotify consent page, catches the callback on 127.0.0.1:8888,
// exchanges the code for a fresh refresh token and writes it to .env.
// The redirect URI below MUST be added to the app at developer.spotify.com/dashboard
// (Spotify no longer accepts "localhost"; it must be the 127.0.0.1 loopback form).
import http from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { execFile } from 'node:child_process';

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ['user-read-currently-playing', 'user-read-recently-played', 'user-read-playback-state'];

function loadEnv() {
  const out = { ...process.env };
  if (existsSync('.env')) {
    for (const line of readFileSync('.env', 'utf8').split('\n')) {
      const i = line.indexOf('=');
      if (i > 0 && !line.trim().startsWith('#')) out[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, '');
    }
  }
  return out;
}

const env = loadEnv();
const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET missing. Run `vercel env pull .env` first.');
  process.exit(1);
}

const state = randomBytes(12).toString('hex');
const authUrl = new URL('https://accounts.spotify.com/authorize');
authUrl.search = new URLSearchParams({
  response_type: 'code',
  client_id: CLIENT_ID,
  scope: SCOPES.join(' '),
  redirect_uri: REDIRECT_URI,
  state,
  show_dialog: 'true',
}).toString();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== '/callback') { res.writeHead(404).end(); return; }
  if (url.searchParams.get('state') !== state) { res.writeHead(400).end('state mismatch'); return; }
  const err = url.searchParams.get('error');
  if (err) { res.end(`Spotify said: ${err}`); console.error('Authorization failed:', err); server.close(); return; }

  const code = url.searchParams.get('code');
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI }),
  });
  const tok = await tokenRes.json();
  if (!tok.refresh_token) {
    res.end('Token exchange failed, see terminal.');
    console.error('Token exchange failed:', tokenRes.status, tok);
    server.close();
    return;
  }

  // Write/replace SPOTIFY_REFRESH_TOKEN in .env without printing it.
  let text = existsSync('.env') ? readFileSync('.env', 'utf8') : '';
  const line = `SPOTIFY_REFRESH_TOKEN="${tok.refresh_token}"`;
  text = /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(text) ? text.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, line) : text.trimEnd() + '\n' + line + '\n';
  writeFileSync('.env', text);

  res.setHeader('Content-Type', 'text/html');
  res.end('<body style="font-family:monospace;padding:2rem">Done. New refresh token saved to .env. You can close this tab.</body>');
  console.log('\nNew refresh token saved to .env (not printed).');
  console.log('Push it to Vercel with:\n  npm run spotify:push\n');
  server.close();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Listening on ${REDIRECT_URI}`);
  console.log('Make sure that exact URI is in your Spotify app settings, then log in here:\n');
  console.log(authUrl.toString(), '\n');
  execFile('open', [authUrl.toString()], () => {});
});
