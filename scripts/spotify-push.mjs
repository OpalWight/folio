// Pushes SPOTIFY_REFRESH_TOKEN from .env to all Vercel environments without echoing it.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const m = readFileSync('.env', 'utf8').match(/^SPOTIFY_REFRESH_TOKEN="?([^"\n]+)"?$/m);
if (!m) { console.error('No SPOTIFY_REFRESH_TOKEN in .env'); process.exit(1); }
for (const target of ['production', 'preview', 'development']) {
  spawnSync('vercel', ['env', 'rm', 'SPOTIFY_REFRESH_TOKEN', target, '--yes'], { stdio: 'ignore' });
  const r = spawnSync('vercel', ['env', 'add', 'SPOTIFY_REFRESH_TOKEN', target, '--value', m[1], '--yes'], { stdio: ['ignore', 'ignore', 'inherit'] });
  if (r.status !== 0) { console.error(`failed for ${target}`); process.exit(r.status ?? 1); }
  console.log(`updated ${target}`);
}
console.log('Refresh token updated on Vercel. Redeploy with: vercel --prod');
