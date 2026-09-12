/**
 * Offline render harness for the laptop product shot.
 *
 * Serves scene.html plus three.js out of node_modules, then accepts the rendered
 * frames back over POST /save and writes them into static/laptop/.
 * Nothing here runs on Vercel — it is a one-off authoring tool. Run it, open
 * http://localhost:5177/, and the page renders every pose and posts it back.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const out = path.join(root, 'static/laptop');
fs.mkdirSync(out, { recursive: true });

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.json': 'application/json',
	'.webp': 'image/webp',
	'.png': 'image/png'
};

const send = (res, code, body, type = 'text/plain') => {
	res.writeHead(code, { 'content-type': type, 'access-control-allow-origin': '*' });
	res.end(body);
};

http
	.createServer((req, res) => {
		const url = new URL(req.url, 'http://x');

		if (req.method === 'POST' && url.pathname === '/save') {
			let buf = '';
			req.on('data', (c) => (buf += c));
			req.on('end', () => {
				try {
					const { name, data, meta } = JSON.parse(buf);
					if (!/^[a-z0-9-]+$/.test(name)) throw new Error('bad name');
					const ext = data.slice(11, data.indexOf(';'));
					const bytes = Buffer.from(data.slice(data.indexOf(',') + 1), 'base64');
					// qa-* frames are inspection crops; they go to a scratch dir, never to static/
					const dir = name.startsWith('qa-') ? (process.env.QA_DIR || out) : out;
					fs.mkdirSync(dir, { recursive: true });
					fs.writeFileSync(path.join(dir, `${name}.${ext}`), bytes);
					if (meta) fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify(meta, null, 2));
					console.log(`wrote ${name}.${ext} (${(bytes.length / 1024).toFixed(0)} KB)`);
					send(res, 200, 'ok');
				} catch (e) {
					console.error(e);
					send(res, 400, String(e));
				}
			});
			return;
		}

		let file;
		if (url.pathname.startsWith('/three/')) {
			file = path.join(root, 'node_modules/three', url.pathname.slice(7));
		} else if (url.pathname.startsWith('/static/')) {
			file = path.join(root, url.pathname.slice(1));
		} else if (url.pathname === '/' || url.pathname === '') {
			file = path.join(here, 'scene.html');
		} else {
			file = path.join(here, url.pathname.slice(1));
		}
		file = path.normalize(file);
		if (!file.startsWith(root)) return send(res, 403, 'no');
		if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res, 404, 'not found');
		send(res, 200, fs.readFileSync(file), TYPES[path.extname(file)] ?? 'application/octet-stream');
	})
	.listen(5177, () => console.log('laptop render harness on http://localhost:5177/'));
