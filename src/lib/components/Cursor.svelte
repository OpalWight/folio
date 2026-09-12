<script lang="ts">
	/**
	 * The dot cursor.
	 *
	 * Over a dot field (the hero) there is no cursor at all — the pointer only exists
	 * as the hole it pushes in the dots. The moment it crosses out of the field, one
	 * dot is torn off the surface: it stretches into a neck, grows from a field dot to
	 * a proper cursor, and snaps. How hard it snaps depends on how fast the pointer
	 * left — a slow drift barely necks, a flick sprays droplets, some flung out with
	 * the cursor and some falling back into the field, which closes over the tear.
	 * Coming back the other way the cursor dissolves into the surface and the field
	 * rings out from where it landed.
	 *
	 * Everything is one metaball silhouette: blobs are welded with the exact tangent
	 * hull of two circles rather than a blur-and-threshold pass, so it stays crisp at
	 * any DPR and costs nothing.
	 */
	import { onMount } from 'svelte';
	import { dotZoneAt, type DotFieldHandle } from '$lib/dots';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		// a finger has no cursor to replace, and reduced motion keeps the system one
		if (!matchMedia('(pointer: fine)').matches) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const R = 8.5; // resting radius out in the page
		const BREAK = 76; // neck length at which the tear completes
		const COLOR = '#2F45D6';
		const HIT = 'a, button, summary, input, select, textarea, [role="button"], [data-cursor="hover"]';

		let W = 0,
			H = 0;
		const size = () => {
			const dpr = Math.min(devicePixelRatio || 1, 2);
			W = innerWidth;
			H = innerHeight;
			canvas.width = Math.round(W * dpr);
			canvas.height = Math.round(H * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		size();

		type Mode = 'wait' | 'field' | 'tear' | 'free' | 'melt';
		type Drop = {
			x: number;
			y: number;
			vx: number;
			vy: number;
			r: number;
			decay: number;
			/** 'fly' chases the cursor and is reabsorbed; 'fall' sinks back into the field. */
			kind: 'fly' | 'fall';
		};

		let mode: Mode = 'wait';
		let mx = -1e4,
			my = -1e4; // pointer
		let hx = mx,
			hy = my; // head
		let vhx = 0,
			vhy = 0; // head velocity, for the fluid stretch
		let r = 0; // head radius
		let target = R;
		let speed = 0; // pointer speed, px/ms
		// tracked only so a link lying over the dot field still gets a pointer — the
		// cursor stays the same dot everywhere, it does not change shape over targets
		let hover = false;
		let sunk = false; // over a live preview: the framed site owns the pointer now
		let inside = false; // pointer is inside the window
		let zone: DotFieldHandle | null = null;
		let ax = 0,
			ay = 0, // tear anchor on the field edge
			ar = 0; // anchor blob radius
		let tearSpeed = 0;
		let tearT0 = 0,
			tearDur = 0;
		let fx = 0,
			fy = 0; // last pointer position that was genuinely on the field
		let melt = 0; // 0..1 dissolve progress
		let mex = 0,
			mey = 0; // where on the surface it goes under
		const drops: Drop[] = [];

		const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
		/** Nearest point on a zone's edge — where the pointer crossed. */
		function edge(z: DotFieldHandle, x: number, y: number) {
			const b = z.hitRect();
			return { x: clamp(x, b.left + 1, b.right - 1), y: clamp(y, b.top + 1, b.bottom - 1) };
		}

		function spray(n: number, x: number, y: number, dx: number, dy: number, power: number, kind: Drop['kind']) {
			for (let i = 0; i < n; i++) {
				const j = (Math.random() - 0.5) * 1.3;
				const c = Math.cos(j),
					s = Math.sin(j);
				const sp = (0.6 + Math.random() * 0.9) * power;
				drops.push({
					x: x + (Math.random() - 0.5) * 8,
					y: y + (Math.random() - 0.5) * 8,
					vx: (dx * c - dy * s) * sp,
					vy: (dx * s + dy * c) * sp,
					r: 1.1 + Math.random() * 2.6 * Math.min(1.6, power),
					decay: 0.955 - Math.random() * 0.03,
					kind
				});
				if (drops.length > 48) drops.shift();
			}
		}

		function tearOff() {
			// the neck gives: half the mass goes with the cursor, half falls back in
			const d = Math.hypot(hx - ax, hy - ay) || 1;
			const ux = (hx - ax) / d,
				uy = (hy - ay) / d;
			const p = clamp(tearSpeed * 0.4, 0.2, 1.6); // px/ms → droplet energy
			const n = Math.round(clamp(tearSpeed * 1.1, 0, 4));
			const bx = ax + ux * d * 0.62,
				by = ay + uy * d * 0.62;
			spray(n, bx, by, ux, uy, p * 2, 'fly');
			spray(Math.round(n * 0.5), ax + ux * 18, ay + uy * 18, -ux, -uy, p * 1.2, 'fall');
			// the field closes over the tear, then rings out from it
			zone?.ripple(ax, ay, { power: -1.1 - p * 0.5, speed: 0, width: 74, decay: 0.3 });
			zone?.ripple(ax, ay, { power: 0.7 + p * 0.45, speed: 430, width: 58, decay: 0.36 });
			mode = 'free';
		}

		function dissolve(x: number, y: number) {
			const p = clamp(speed * 0.5, 0.3, 2.2);
			// a wave train: the impact ring, then a slower swell behind it
			zone?.ripple(x, y, { power: 1.5 + p * 1.5, speed: 470, width: 60, decay: 0.42 });
			setTimeout(() => zone?.ripple(x, y, { power: 0.9 + p * 0.8, speed: 300, width: 84, decay: 0.52 }), 120);
			setTimeout(() => zone?.ripple(x, y, { power: -0.5, speed: 0, width: 90, decay: 0.5 }), 60);
			const d = Math.hypot(mx - x, my - y) || 1;
			spray(Math.round(clamp(speed * 1.4, 1, 6)), x, y, (mx - x) / d, (my - y) / d, p * 1.8, 'fall');
			mode = 'melt';
			melt = 0;
			mex = x;
			mey = y;
		}

		let lastT = performance.now();
		function onMove(e: PointerEvent) {
			if (e.pointerType === 'touch' || e.pointerType === 'pen') return;
			const now = performance.now();
			const dt = clamp(now - lastT, 4, 120);
			lastT = now;
			const first = mx < -1e3;
			const dx = e.clientX - mx,
				dy = e.clientY - my;
			speed = first ? 0 : speed * 0.6 + (Math.hypot(dx, dy) / dt) * 0.4;
			const px = mx,
				py = my;
			mx = e.clientX;
			my = e.clientY;
			inside = true;

			const t = e.target as Element | null;
			// a framed site draws its own cursor and swallows pointer moves, so ours
			// fades out at the edge of the frame rather than freezing on top of it
			sunk = t?.tagName === 'IFRAME' || !!t?.closest?.('iframe, [data-cursor="hide"]');
			hover = !sunk && !!t?.closest?.(HIT);
			// a link lying over the field still needs a pointer, so hovering one counts
			// as being out of the field and pulls a dot along with it
			const z = hover ? null : dotZoneAt(mx, my);

			if (first) {
				hx = mx;
				hy = my;
				if (z) {
					zone = z;
					fx = mx;
					fy = my;
					mode = 'field';
				} else {
					mode = 'free';
					r = 0;
					target = R;
				}
				return;
			}

			// turning back out mid-dissolve: the half-melted dot is torn up again
			if (mode === 'melt' && !z) {
				fx = hx;
				fy = hy;
			}
			if ((mode === 'field' || mode === 'melt') && !z) {
				// the tear starts where the pointer last touched the surface, set a little
				// below it so the root reads as part of the field rather than sitting on top
				const d = Math.hypot(mx - fx, my - fy) || 1;
				const p = edge(zone!, fx - ((mx - fx) / d) * 7, fy - ((my - fy) / d) * 7);
				ax = p.x;
				ay = p.y;
				hx = ax;
				hy = ay;
				ar = Math.max(1.6, zone!.dotRadius());
				r = ar;
				tearSpeed = speed;
				// a flick snaps almost at once, a slow drift draws the neck out
				tearDur = clamp(240 - speed * 40, 110, 240);
				tearT0 = performance.now();
				mode = 'tear';
			} else if ((mode === 'free' || mode === 'tear') && z) {
				zone = z;
				const p = edge(z, px, py);
				dissolve(p.x, p.y);
			} else if (z) {
				zone = z;
				fx = mx;
				fy = my;
			}
		}

		function frame(now: number) {
			raf = requestAnimationFrame(frame);
			const dt = clamp((now - lastFrame) / 16.667, 0.2, 3);
			lastFrame = now;

			// the field can go away under the cursor (route change); don't strand it
			if (mode === 'field' && !dotZoneAt(mx, my)) {
				mode = 'free';
				hx = mx;
				hy = my;
				r = 0;
			}

			if (mode === 'tear') {
				// the head is drawn out on its own clock, so the neck is always visible
				// however fast the pointer left, and never stretches past breaking length
				const p = clamp((now - tearT0) / tearDur, 0, 1);
				const e = p * p * (3 - 2 * p);
				let tx = ax + (mx - ax) * e,
					ty = ay + (my - ay) * e;
				const d = Math.hypot(tx - ax, ty - ay);
				if (d > BREAK) {
					tx = ax + (tx - ax) * (BREAK / d);
					ty = ay + (ty - ay) * (BREAK / d);
				}
				hx += (tx - hx) * Math.min(1, 0.55 * dt);
				hy += (ty - hy) * Math.min(1, 0.55 * dt);
				r = ar + (R - ar) * e; // the torn dot swells into a cursor
				if (p >= 1) tearOff();
			} else if (mode === 'free') {
				const k = 0.42 * dt;
				const nx = hx + (mx - hx) * k,
					ny = hy + (my - hy) * k;
				vhx = nx - hx;
				vhy = ny - hy;
				hx = nx;
				hy = ny;
				target = inside && !sunk ? R : 0;
				r += (target - r) * 0.2 * dt;
				// fast travel sheds a little mass, which then chases the head down
				if (speed > 3.2 && Math.random() < 0.1 * dt) {
					const d = Math.hypot(vhx, vhy) || 1;
					spray(1, hx - vhx * 2, hy - vhy * 2, -vhx / d, -vhy / d, 0.5, 'fly');
				}
			} else if (mode === 'melt') {
				melt = Math.min(1, melt + 0.09 * dt);
				// it sinks where it met the surface rather than wherever the pointer went
				hx += (mex - hx) * 0.24 * dt;
				hy += (mey - hy) * 0.24 * dt;
				r *= 1 - 0.14 * dt;
				if (melt >= 1) {
					mode = 'field';
					r = 0;
				}
			}
			speed *= 1 - 0.08 * dt;

			// ---- droplets
			for (let i = drops.length - 1; i >= 0; i--) {
				const p = drops[i];
				if (p.kind === 'fly' && (mode === 'free' || mode === 'tear')) {
					// pulled along by the head, and swallowed when it catches up
					p.vx += (hx - p.x) * 0.012 * dt;
					p.vy += (hy - p.y) * 0.012 * dt;
					if (Math.hypot(hx - p.x, hy - p.y) < r + p.r * 0.4) {
						drops.splice(i, 1);
						continue;
					}
				} else if (p.kind === 'fall') {
					p.r *= 1 - 0.06 * dt;
				}
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				p.vx *= Math.pow(p.decay, dt);
				p.vy *= Math.pow(p.decay, dt);
				p.r *= Math.pow(0.982, dt);
				if (p.r < 0.35) drops.splice(i, 1);
			}

			draw();
		}

		/** Exact tangent hull of two circles, with the waist pinched in like a neck. */
		function weld(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, pinch: number) {
			const dx = x2 - x1,
				dy = y2 - y1;
			const d = Math.hypot(dx, dy);
			if (d < 0.01 || d <= Math.abs(r1 - r2)) return;
			const a = Math.atan2(dy, dx);
			const t = Math.acos(clamp((r1 - r2) / d, -1, 1));
			const p1x = x1 + Math.cos(a + t) * r1,
				p1y = y1 + Math.sin(a + t) * r1;
			const p2x = x2 + Math.cos(a + t) * r2,
				p2y = y2 + Math.sin(a + t) * r2;
			const p3x = x2 + Math.cos(a - t) * r2,
				p3y = y2 + Math.sin(a - t) * r2;
			const p4x = x1 + Math.cos(a - t) * r1,
				p4y = y1 + Math.sin(a - t) * r1;
			const cx = (x1 + x2) / 2,
				cy = (y1 + y2) / 2;
			ctx!.beginPath();
			ctx!.moveTo(p4x, p4y);
			ctx!.arc(x1, y1, r1, a - t, a + t, true);
			ctx!.quadraticCurveTo(
				(p1x + p2x) / 2 + (cx - (p1x + p2x) / 2) * pinch,
				(p1y + p2y) / 2 + (cy - (p1y + p2y) / 2) * pinch,
				p2x,
				p2y
			);
			ctx!.arc(x2, y2, r2, a + t, a - t, true);
			ctx!.quadraticCurveTo(
				(p3x + p4x) / 2 + (cx - (p3x + p4x) / 2) * pinch,
				(p3y + p4y) / 2 + (cy - (p3y + p4y) / 2) * pinch,
				p4x,
				p4y
			);
			ctx!.closePath();
			ctx!.fill();
		}

		function blob(x: number, y: number, rr: number, sx = 0, sy = 0) {
			const sp = Math.hypot(sx, sy);
			const e = Math.min(0.3, sp * 0.022); // fluid drag along the direction of travel
			ctx!.save();
			ctx!.translate(x, y);
			if (e > 0.01) ctx!.rotate(Math.atan2(sy, sx));
			ctx!.beginPath();
			ctx!.ellipse(0, 0, rr * (1 + e), rr / (1 + e * 0.7), 0, 0, 6.2832);
			ctx!.fill();
			ctx!.restore();
		}

		function draw() {
			ctx!.clearRect(0, 0, W, H);
			ctx!.fillStyle = COLOR;

			for (const p of drops) {
				ctx!.beginPath();
				ctx!.arc(p.x, p.y, p.r, 0, 6.2832);
				ctx!.fill();
				// a droplet close to the head is still part of it
				if ((mode === 'free' || mode === 'tear') && r > 0.5) {
					const d = Math.hypot(hx - p.x, hy - p.y);
					if (d < r * 3.4 + p.r) weld(p.x, p.y, p.r, hx, hy, r, 0.45);
				}
			}

			if (mode === 'tear') {
				const d = Math.hypot(hx - ax, hy - ay);
				const g = clamp(d / BREAK, 0, 1);
				// the root left behind thins out as the neck draws down
				const root = ar * (1.5 - g * 1.2);
				ctx!.beginPath();
				ctx!.arc(ax, ay, root, 0, 6.2832);
				ctx!.fill();
				weld(ax, ay, root, hx, hy, r, 0.3 + g * 0.45);
				blob(hx, hy, r, hx - ax, hy - ay);
			} else if (mode === 'melt') {
				blob(hx, hy, r, vhx, vhy);
			} else if (mode === 'free' && r > 0.2) {
				blob(hx, hy, r, vhx, vhy);
			}
		}

		let raf = 0;
		let lastFrame = performance.now();

		const onDown = () => {
			if (mode === 'free') r *= 0.62;
		};
		const onEnter = () => (inside = true);
		const onOut = (e: PointerEvent) => {
			if (!e.relatedTarget && !(e as PointerEvent & { toElement?: unknown }).toElement) inside = false;
		};

		document.documentElement.classList.add('dot-cursor');
		addEventListener('pointermove', onMove, { passive: true });
		addEventListener('pointerdown', onDown, { passive: true });
		addEventListener('pointerover', onEnter, { passive: true });
		addEventListener('pointerout', onOut, { passive: true });
		addEventListener('resize', size);
		raf = requestAnimationFrame(frame);

		return () => {
			document.documentElement.classList.remove('dot-cursor');
			cancelAnimationFrame(raf);
			removeEventListener('pointermove', onMove);
			removeEventListener('pointerdown', onDown);
			removeEventListener('pointerover', onEnter);
			removeEventListener('pointerout', onOut);
			removeEventListener('resize', size);
		};
	});
</script>

<canvas bind:this={canvas} class="cursor" aria-hidden="true"></canvas>

<style>
	.cursor {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: 300; /* above the page transition */
		pointer-events: none;
	}
</style>
