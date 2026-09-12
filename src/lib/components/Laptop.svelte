<script lang="ts" module>
	/**
	 * Angled laptop product shot.
	 *
	 * The hardware is a real 3D render, not CSS. `tools/laptop-render/` builds the
	 * machine procedurally in three.js — rounded-box lid and deck with chamfered
	 * edges, instanced keycaps, PBR aluminium lit by a studio environment — renders
	 * each pose once at 2x with a soft accumulated contact shadow, and writes it to
	 * `static/laptop/<pose>.webp`. Nothing 3D ships to the browser: the runtime cost
	 * is one ~125 KB image.
	 *
	 * The screen stays live. The render script also records where the screen plane
	 * lands in the frame, and the four corners below are that quad. Because the screen
	 * is planar, a projective homography maps a flat 1280x800 box onto it exactly, so
	 * the `screen` snippet — iframe, video or still — is a normal DOM layer wearing a
	 * `matrix3d` and sits in the render as if it were rendered with it.
	 *
	 * pose 'float' — above and to the left, lid open, deck catching the light
	 * pose 'low'   — lower and turned further, screen dominant
	 * pose 'hero'  — barely turned, for pages where the screen has to stay readable
	 */
	type Pose = 'float' | 'low' | 'hero';

	// design-space canvas the quads below are expressed in; the rig scales to fit
	const SW = 980;
	const SH = 660;
	// the screen layer is laid out at true desktop size, so a framed site renders at
	// 1280px wide and the homography does all the shrinking
	const PW = 1280;
	const PH = 800;

	/** Screen corners in design space — TL, TR, BR, BL. Emitted by tools/laptop-render. */
	const QUADS: Record<Pose, [number, number][]> = {
		float: [
			[189.75, 154.29],
			[550.54, 65.49],
			[591.49, 296.42],
			[246.43, 402.72]
		],
		low: [
			[132.5, 62.59],
			[577.76, 68.61],
			[595.46, 362.04],
			[155.75, 400.97]
		],
		hero: [
			[171, 51.94],
			[685.89, 34.64],
			[704.35, 351.9],
			[192.41, 385.88]
		]
	};

	/**
	 * Projective map from the unit square to an arbitrary quad, then folded together
	 * with the scale that takes the 1280x800 layer down to the unit square. Closed
	 * form — no solver — and exact, because four point pairs determine a homography.
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
			// degenerate case: the quad is a parallelogram, so the map is affine
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

	const WARP: Record<Pose, string> = {
		float: matrix3d(QUADS.float),
		low: matrix3d(QUADS.low),
		hero: matrix3d(QUADS.hero)
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		screen,
		hovered = false,
		pose = 'float'
	}: { screen?: Snippet; hovered?: boolean; pose?: Pose } = $props();

	let fit = $state(0);
	const s = $derived(fit ? fit / SW : 0);
</script>

<div class="panel" class:on={hovered}>
	<div class="fit" bind:clientWidth={fit} style="height: {SH * s}px">
		<div class="stage" style="transform: scale({s})">
			<div class="rig">
				<img
					class="body"
					src="/laptop/{pose}.webp"
					width={SW}
					height={SH}
					alt=""
					loading="lazy"
					decoding="async"
				/>

				<!-- the live screen, warped onto the rendered display -->
				<div class="screen" style="transform: {WARP[pose]}">
					<div class="content">
						{@render screen?.()}
					</div>
					<span class="sheen"></span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.panel {
		width: 100%;
		background:
			radial-gradient(90% 70% at 72% 8%, #1a2570 0%, transparent 60%),
			linear-gradient(150deg, #131c57 0%, #0a1038 55%, #05081f 100%);
		overflow: hidden;
	}
	.fit {
		width: 100%;
		position: relative;
	}
	.stage {
		width: 980px;
		height: 660px;
		transform-origin: top left;
	}
	/* hover lifts the whole shot the way a product page does, rather than re-posing
	   hardware that is now a fixed render */
	.rig {
		position: absolute;
		inset: 0;
		transform-origin: 50% 60%;
		transition: transform 0.9s var(--ease-out);
	}
	.panel.on .rig {
		transform: translateY(-14px) scale(1.035);
	}

	.body {
		position: absolute;
		inset: 0;
		width: 980px;
		height: 660px;
		display: block;
		/* the hover lift brightens the hardware only — putting a filter on .rig would
		   force the live iframe underneath it to re-rasterise on every hover */
		transition: filter 0.9s var(--ease-out);
	}
	.panel.on .body {
		filter: saturate(1.05) brightness(1.04);
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
	}
	.content {
		position: absolute;
		inset: 0;
	}
	/* raking light across the glass, warped with the panel because it lives inside it */
	.sheen {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			linear-gradient(
				104deg,
				rgba(255, 255, 255, 0.26) 0%,
				rgba(255, 255, 255, 0.05) 24%,
				transparent 44%
			),
			radial-gradient(120% 90% at 92% 96%, rgba(10, 16, 56, 0.22), transparent 55%);
		mix-blend-mode: screen;
		opacity: 0.9;
		transition: opacity 0.6s var(--ease-out);
	}
	.panel.on .sheen {
		opacity: 0.45;
	}

	@media (prefers-reduced-motion: reduce) {
		.rig,
		.body,
		.sheen {
			transition: none;
		}
		.panel.on .rig {
			transform: none;
		}
		.panel.on .body {
			filter: none;
		}
	}
</style>
