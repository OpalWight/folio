<script lang="ts" module>
	/**
	 * Laptop product shot, built on two Figma mockups (see static/CREDITS.md).
	 *
	 * 'studio' — a photoreal space-grey MacBook Pro on a plinth, three-quarter view,
	 *            exported with its background dropped. Its display is opaque, so the
	 *            preview lays over the render, inset just inside the bezel.
	 * 'air'    — a MacBook Air M2 straight on. The device layer is transparent where
	 *            the display goes, so here the artwork lays OVER the preview and the
	 *            bezel (notch included) overlaps it.
	 *
	 * Either way the display is a quad and a projective map takes a flat 1280x800
	 * layer onto it exactly — four point pairs determine a homography, so the
	 * `screen` snippet is a normal DOM layer wearing a `matrix3d`.
	 *
	 * `expanded` dissolves the hardware: the artwork fades out and the screen
	 * straightens from its quad to fill the panel, so the card turns into the site.
	 */
	// the screen layer, laid out at desktop size. 1280x832 is a MacBook's own 1.54,
	// so a framed site is not stretched to fit a 16:10 assumption
	const PW = 1280;
	const PH = 832;

	export type Mock = 'studio' | 'air';

	type Spec = {
		src: string;
		/** The mockup's own canvas. */
		w: number;
		h: number;
		/** Display corners in that canvas — TL, TR, BR, BL. */
		quad: [number, number][];
		/** True when the preview has to sit on top of the artwork. */
		over: boolean;
		/** The clay vector needs a cast shadow; the render brings its own. */
		shadow: boolean;
	};

	const MOCKS: Record<Mock, Spec> = {
		// fitted to the render itself: least-squares lines through the four edges of
		// the white display, intersected, then pulled in 1% to leave the bezel showing
		studio: {
			src: '/mockup/studio.webp',
			w: 1600,
			h: 1000,
			quad: [
				[713.26, 257.77],
				[1284.29, 176.49],
				[1280.03, 714.75],
				[706.72, 702.08]
			],
			over: true,
			shadow: false
		},
		// the mockup's own Screen path, a shallow trapezoid, pushed out 1% so the layer
		// always reaches under the bezel rather than leaving a hairline showing through
		air: {
			src: '/mockup/air.webp',
			w: 1600,
			h: 1000,
			quad: [
				[250.36, 113.26],
				[1349.64, 113.26],
				[1355.5, 827.54],
				[244.5, 827.54]
			],
			over: false,
			shadow: false
		}
	};

	/**
	 * Projective map from the unit square to an arbitrary quad, folded together with
	 * the scale that takes the 1280x800 layer down to that square. Closed form — no
	 * solver — and exact, because four point pairs determine a homography.
	 */
	function matrix3d(quad: [number, number][]): string {
		const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad;
		const dx1 = x1 - x2,
			dx2 = x3 - x2,
			dx3 = x0 - x1 + x2 - x3;
		const dy1 = y1 - y2,
			dy2 = y3 - y2,
			dy3 = y0 - y1 + y2 - y3;

		let a: number, b: number, d: number, e: number, g: number, h: number;
		const det = dx1 * dy2 - dy1 * dx2;
		if (dx3 === 0 && dy3 === 0) {
			// the quad is a parallelogram, so the map is affine
			g = h = 0;
			a = x1 - x0;
			b = x2 - x1;
			d = y1 - y0;
			e = y2 - y1;
		} else {
			g = (dx3 * dy2 - dy3 * dx2) / det;
			h = (dx1 * dy3 - dy1 * dx3) / det;
			a = x1 - x0 + g * x1;
			b = x3 - x0 + h * x3;
			d = y1 - y0 + g * y1;
			e = y3 - y0 + h * y3;
		}

		// post-multiply by diag(1/PW, 1/PH, 1) so the layer can be laid out at full size
		const m = [a / PW, b / PH, x0, d / PW, e / PH, y0, g / PW, h / PH, 1];
		// CSS matrix3d is column-major; a 2D homography only touches rows/cols 1, 2 and 4
		const [m11, m12, m13, m21, m22, m23, m31, m32] = m;
		return `matrix3d(${m11},${m21},0,${m31},${m12},${m22},0,${m32},0,0,1,0,${m13},${m23},0,1)`;
	}

	const WARP: Record<Mock, string> = {
		studio: matrix3d(MOCKS.studio.quad),
		air: matrix3d(MOCKS.air.quad)
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		screen,
		hovered = false,
		expanded = false,
		mock = 'studio'
	}: {
		screen?: Snippet;
		hovered?: boolean;
		expanded?: boolean;
		mock?: Mock;
	} = $props();

	const m = $derived(MOCKS[mock]);

	let pw = $state(0);
	let ph = $state(0);

	// contain-fit the mockup in whatever box it is given, in both states — the shot
	// grows by growing its box, so nothing about the hardware's scale jumps
	const s = $derived(pw && ph ? Math.min(pw / m.w, ph / m.h) : 0);
	const ox = $derived((pw - m.w * s) / 2);
	const oy = $derived((ph - m.h * s) / 2);

	/**
	 * Expanded, the screen leaves its quad and fills the panel edge to edge. The layer
	 * lives inside the contain-scaled stage, so the fit is worked out in design units
	 * and divided back through that scale. On a 16:10 panel cover and contain are the
	 * same number, since the layer is 16:10 too.
	 */
	const fill = $derived.by(() => {
		if (!expanded || !s) return WARP[mock];
		const bw = pw / s,
			bh = ph / s;
		const k = Math.max(bw / PW, bh / PH);
		const tx = -ox / s + (bw - PW * k) / 2;
		const ty = -oy / s + (bh - PH * k) / 2;
		return `translate(${tx}px, ${ty}px) scale(${k})`;
	});
</script>

<div class="panel" class:on={hovered} class:full={expanded} bind:clientWidth={pw} bind:clientHeight={ph}>
	<div
		class="stage"
		style="width: {m.w}px; height: {m.h}px; transform: translate({ox}px, {oy}px) scale({s})"
	>
		<div class="rig">
			<img
				class="body"
				class:cast={m.shadow}
				style="width: {m.w}px; height: {m.h}px; z-index: {m.over ? 1 : 2}"
				src={m.src}
				width={m.w}
				height={m.h}
				alt=""
			/>
			<div class="screen" style="z-index: {m.over ? 2 : 1}; transform: {fill}">
				{@render screen?.()}
			</div>
		</div>
	</div>
</div>

<style>
	.panel {
		position: absolute;
		inset: 0;
		overflow: hidden;
		background:
			radial-gradient(90% 70% at 72% 8%, #2c3bab 0%, transparent 62%),
			linear-gradient(150deg, #1d2b8a 0%, #16216b 55%, #0c1445 100%);
	}
	.stage {
		position: absolute;
		left: 0;
		top: 0;
		transform-origin: 0 0;
	}
	.rig {
		position: absolute;
		inset: 0;
	}

	.screen {
		position: absolute;
		left: 0;
		top: 0;
		width: 1280px;
		height: 800px;
		transform-origin: 0 0;
		overflow: hidden;
		background: var(--white);
		backface-visibility: hidden;
		transition: transform 0.16s var(--ease-out);
	}

	.body {
		position: absolute;
		left: 0;
		top: 0;
		display: block;
		pointer-events: none;
		transition:
			opacity 0.14s linear,
			transform 0.55s var(--ease-out);
	}
	.body.cast {
		filter: drop-shadow(0 30px 46px rgba(4, 8, 32, 0.42));
	}
	/* hover lifts the shot the way a product page does */
	.panel.on .body {
		transform: translateY(-10px) scale(1.012);
	}
	.panel.full .body {
		opacity: 0;
		transform: scale(1.015);
	}

	@media (prefers-reduced-motion: reduce) {
		.rig,
		.screen,
		.body {
			transition: none;
		}
		.panel.on .body {
			transform: none;
		}
	}
</style>
