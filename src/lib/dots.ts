/**
 * Dot field: renders an image as a blue dot screen on white.
 * Dot radius follows darkness (bright pixels → no dot), each dot sits on a spring,
 * slow travelling waves sway the field, an invisible "wind" point wanders through it,
 * and the pointer pushes dots away. One engine for hero, cards and transitions.
 */
export interface DotFieldOptions {
	/** Grid cell size in CSS px at desktop widths. */
	cell?: number;
	/** Cover-fit focus point [x, y] in 0..1 for wide viewports. */
	focus?: [number, number];
	/** Cover-fit focus point and extra zoom for portrait viewports. */
	focusPortrait?: [number, number];
	zoomPortrait?: number;
	/** Max dot radius as a fraction of the cell. */
	maxR?: number;
	/** Contrast curve applied to darkness. */
	gamma?: number;
	/** Soft thinning of the field: [cx, cy, sx, sy] in 0..1, plus strength. Keeps type legible. */
	mask?: [number, number, number, number] | null;
	maskStrength?: number;
	/** Pointer push radius (px) and force. */
	push?: number;
	force?: number;
	/** Spring stiffness and friction. */
	k?: number;
	friction?: number;
	/** Converge from noise on first frame. */
	loadIn?: boolean;
	/** Ambient motion. */
	sway?: boolean;
	wander?: boolean;
	breathe?: boolean;
	interactive?: boolean;
	/** Draw one frame and stop. For placeholders, where a running rAF loop is pure waste. */
	still?: boolean;
	color?: string;
	background?: string;
}

const DEFAULTS: Required<DotFieldOptions> = {
	cell: 4.5,
	focus: [0.7, 0.45],
	focusPortrait: [0.86, 0.35],
	zoomPortrait: 1.25,
	maxR: 0.5,
	gamma: 1.2,
	mask: null,
	maskStrength: 0.72,
	push: 110,
	force: 0.55,
	k: 0.12,
	friction: 0.78,
	loadIn: true,
	sway: true,
	wander: true,
	breathe: true,
	interactive: true,
	still: false,
	color: '#2F45D6',
	background: '#FFFFFF'
};

export function createDotField(canvas: HTMLCanvasElement, src: string, opts: DotFieldOptions = {}) {
	const o = { ...DEFAULTS, ...opts };
	const ctx = canvas.getContext('2d');
	if (!ctx) return () => {};
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

	const img = new Image();
	img.src = src;

	const off = document.createElement('canvas');
	const octx = off.getContext('2d', { willReadFrequently: true })!;

	let W = 0,
		H = 0,
		dpr = 1,
		cols = 0,
		rows = 0,
		N = 0,
		cell = o.cell;
	let lum: Float32Array, bx: Float32Array, by: Float32Array;
	let ox: Float32Array, oy: Float32Array, vx: Float32Array, vy: Float32Array, seed: Float32Array;
	let start = performance.now();
	let run = true,
		ready = false,
		raf = 0;
	let px = -1e4,
		py = -1e4;

	function build() {
		dpr = Math.min(devicePixelRatio || 1, 2);
		const r = canvas.getBoundingClientRect();
		if (r.width < 2 || r.height < 2) {
			N = 0;
			return;
		}
		W = r.width;
		H = r.height;
		canvas.width = Math.round(W * dpr);
		canvas.height = Math.round(H * dpr);
		ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

		const portrait = W < 700;
		cell = portrait ? o.cell * 1.15 : W < 1100 ? o.cell * 1.08 : o.cell;
		cols = Math.ceil(W / cell);
		rows = Math.ceil(H / cell);
		N = cols * rows;
		off.width = cols;
		off.height = rows;

		// object-fit: cover with a focus point
		const foc = portrait ? o.focusPortrait : o.focus;
		const s = Math.max(cols / img.width, rows / img.height) * (portrait ? o.zoomPortrait : 1);
		const iw = img.width * s,
			ih = img.height * s;
		const dx = Math.min(0, Math.max(cols - iw, cols * foc[0] - iw * foc[0]));
		const dy = Math.min(0, Math.max(rows - ih, rows * foc[1] - ih * foc[1]));
		octx.fillStyle = '#000';
		octx.fillRect(0, 0, cols, rows);
		octx.drawImage(img, dx, dy, iw, ih);
		const d = octx.getImageData(0, 0, cols, rows).data;

		lum = new Float32Array(N);
		bx = new Float32Array(N);
		by = new Float32Array(N);
		ox = new Float32Array(N);
		oy = new Float32Array(N);
		vx = new Float32Array(N);
		vy = new Float32Array(N);
		seed = new Float32Array(N);
		for (let i = 0; i < N; i++) {
			const l = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) / 255;
			const x = (i % cols) * cell + cell / 2;
			const y = Math.floor(i / cols) * cell + cell / 2;
			let m = 1;
			if (o.mask) {
				const gx = (x - W * o.mask[0]) / (W * o.mask[2]);
				const gy = (y - H * o.mask[1]) / (H * o.mask[3]);
				m = 1 - o.maskStrength * Math.exp(-(gx * gx + gy * gy) / 2);
			}
			lum[i] = Math.pow(1 - l, o.gamma) * m;
			bx[i] = x;
			by[i] = y;
			seed[i] = Math.random();
		}
	}

	const buckets: number[][] = Array.from({ length: 10 }, () => []);

	function frame(now: number) {
		if (!run || !N) {
			// not built yet (or off screen): come back next frame whatever the mode
			raf = requestAnimationFrame(frame);
			return;
		}
		if (!o.still) raf = requestAnimationFrame(frame);
		const t = (now - start) / 1000;
		const maxR = cell * o.maxR;
		const p = o.loadIn && !reduce ? Math.min(1, t / 1.2) : 1;
		const ease = 1 - Math.pow(1 - p, 3);

		// invisible wind point wandering through the focus region
		const wx = W * (o.focus[0] + Math.sin(t * 0.23) * 0.22 + Math.sin(t * 0.071) * 0.08);
		const wy = H * (o.focus[1] + Math.cos(t * 0.19) * 0.26);

		ctx!.fillStyle = o.background;
		ctx!.fillRect(0, 0, W, H);
		ctx!.fillStyle = o.color;
		for (const b of buckets) b.length = 0;

		const pushR2 = o.push * o.push;
		const windR = o.push * 1.3,
			windR2 = windR * windR;

		for (let i = 0; i < N; i++) {
			let tx = 0,
				ty = 0;
			if (o.sway && !reduce) {
				const ph = t * 0.55 + by[i] * 0.006;
				tx += Math.sin(ph + bx[i] * 0.004) * cell * 0.55;
				ty += Math.cos(t * 0.4 + bx[i] * 0.005 + by[i] * 0.003) * cell * 0.35;
			}
			const x0 = bx[i] + ox[i],
				y0 = by[i] + oy[i];
			if (o.interactive) {
				const ddx = x0 - px,
					ddy = y0 - py;
				const dd = ddx * ddx + ddy * ddy;
				if (dd < pushR2) {
					const dist = Math.sqrt(dd) || 1;
					const f = ((o.push - dist) / o.push) * o.force * cell * 3;
					tx += (ddx / dist) * f;
					ty += (ddy / dist) * f;
				}
			}
			if (o.wander && !reduce) {
				const ddx = x0 - wx,
					ddy = y0 - wy;
				const dd = ddx * ddx + ddy * ddy;
				if (dd < windR2) {
					const dist = Math.sqrt(dd) || 1;
					const f = ((windR - dist) / windR) * o.force * cell * 2.2;
					tx += (ddx / dist) * f;
					ty += (ddy / dist) * f;
				}
			}
			vx[i] += (tx - ox[i]) * o.k;
			vy[i] += (ty - oy[i]) * o.k;
			vx[i] *= o.friction;
			vy[i] *= o.friction;
			ox[i] += vx[i];
			oy[i] += vy[i];

			let L = lum[i];
			if (o.breathe && !reduce) L *= 1 + Math.sin(t * 0.7 + bx[i] * 0.01 + by[i] * 0.007) * 0.07;
			L = L * ease + seed[i] * 0.55 * (1 - ease);
			const R = maxR * L;
			if (R < 0.3) continue;
			buckets[Math.min(9, Math.floor((R / maxR) * 9.99))].push(i);
		}

		for (let b = 0; b < 10; b++) {
			const arr = buckets[b];
			if (!arr.length) continue;
			const R = maxR * ((b + 0.5) / 10);
			ctx!.beginPath();
			for (const i of arr) {
				const x = bx[i] + ox[i],
					y = by[i] + oy[i];
				ctx!.moveTo(x + R, y);
				ctx!.arc(x, y, R, 0, 6.2832);
			}
			ctx!.fill();
		}
	}

	function onPointer(e: PointerEvent) {
		const r = canvas.getBoundingClientRect();
		px = e.clientX - r.left;
		py = e.clientY - r.top;
	}
	function onLeave() {
		px = py = -1e4;
	}
	if (o.interactive) {
		canvas.addEventListener('pointermove', onPointer, { passive: true });
		canvas.addEventListener('pointerdown', onPointer, { passive: true });
		canvas.addEventListener('pointerleave', onLeave);
		canvas.addEventListener('pointercancel', onLeave);
	}

	const io = new IntersectionObserver((e) => {
		run = e[0].isIntersecting;
	});
	io.observe(canvas);
	const onVis = () => {
		run = !document.hidden;
	};
	document.addEventListener('visibilitychange', onVis);

	let rt = 0;
	const ro = new ResizeObserver(() => {
		if (!ready) return;
		clearTimeout(rt);
		rt = window.setTimeout(() => {
			build();
			if (o.still) {
				cancelAnimationFrame(raf);
				raf = requestAnimationFrame(frame);
			}
		}, 80);
	});

	img
		.decode()
		.then(() => {
			ready = true;
			start = performance.now();
			build();
			ro.observe(canvas);
			raf = requestAnimationFrame(frame);
		})
		.catch(() => {});

	return () => {
		cancelAnimationFrame(raf);
		ro.disconnect();
		io.disconnect();
		document.removeEventListener('visibilitychange', onVis);
		canvas.removeEventListener('pointermove', onPointer);
		canvas.removeEventListener('pointerdown', onPointer);
		canvas.removeEventListener('pointerleave', onLeave);
		canvas.removeEventListener('pointercancel', onLeave);
	};
}
