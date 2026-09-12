<script lang="ts">
	/**
	 * Dot-dissolve page transition. On link navigation a grid of blue dots grows over the page
	 * in a diagonal wave, the route swaps underneath, then the dots shrink away.
	 */
	import { onNavigate, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let active = $state(false);
	let reduce = false;

	const CELL = 14;
	const DUR_IN = 520;
	const DUR_OUT = 560;

	function size() {
		const dpr = Math.min(devicePixelRatio || 1, 2);
		canvas.width = innerWidth * dpr;
		canvas.height = innerHeight * dpr;
		ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	// progress 0..1, mode 'in' (dots grow) or 'out' (dots shrink)
	function draw(p: number, mode: 'in' | 'out') {
		const W = innerWidth,
			H = innerHeight;
		ctx!.clearRect(0, 0, W, H);
		ctx!.fillStyle = '#2F45D6';
		const cols = Math.ceil(W / CELL) + 1,
			rows = Math.ceil(H / CELL) + 1;
		const diag = cols + rows;
		const maxR = CELL * 0.75; // > half cell so grown dots fully cover
		ctx!.beginPath();
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				// wave travels from top-left to bottom-right
				const k = (c + r) / diag;
				let local = mode === 'in' ? (p * 1.35 - k) / 0.35 : ((1 - p) * 1.35 - k) / 0.35;
				local = Math.max(0, Math.min(1, local));
				const e = 1 - Math.pow(1 - local, 3);
				const R = maxR * e;
				if (R < 0.4) continue;
				const x = c * CELL,
					y = r * CELL;
				ctx!.moveTo(x + R, y);
				ctx!.arc(x, y, R, 0, 6.2832);
			}
		}
		ctx!.fill();
	}

	function run(mode: 'in' | 'out', dur: number) {
		return new Promise<void>((resolve) => {
			const t0 = performance.now();
			const step = (now: number) => {
				const p = Math.min(1, (now - t0) / dur);
				draw(p, mode);
				if (p < 1) requestAnimationFrame(step);
				else resolve();
			};
			requestAnimationFrame(step);
		});
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		addEventListener('resize', size);
		return () => removeEventListener('resize', size);
	});

	let pendingOut = false;

	onNavigate(async (nav) => {
		// only animate real route changes triggered by links, not hash jumps or popstate
		if (reduce || !ctx) return;
		if (nav.type !== 'link' && nav.type !== 'goto') return;
		if (nav.from?.url.pathname === nav.to?.url.pathname) return;
		active = true;
		size();
		await run('in', DUR_IN);
		pendingOut = true;
		// keep the cover on; afterNavigate uncovers once the new page is in the DOM
	});

	afterNavigate(async () => {
		if (!pendingOut) return;
		pendingOut = false;
		scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
		await run('out', DUR_OUT);
		ctx!.clearRect(0, 0, innerWidth, innerHeight);
		active = false;
	});
</script>

<canvas bind:this={canvas} class="tx" class:active aria-hidden="true"></canvas>

<style>
	.tx {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: 100;
		pointer-events: none;
		display: none;
	}
	.tx.active {
		display: block;
		pointer-events: auto;
	}
</style>
