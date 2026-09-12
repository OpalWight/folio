<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * Angled laptop mockup.
	 *
	 * Product shots like the one this imitates are 3D renders (Rotato / Blender), which
	 * can only ever hold a still image. We want the live site in the screen, so the
	 * hardware is a real CSS 3D rig instead: a lid and a keyboard deck hinged along one
	 * line, posed inside a perspective camera. Proportions follow a 13" MacBook Pro —
	 * 614x428 lid, 576x360 screen, deck roughly as deep as the lid is tall.
	 *
	 * pose 'float' — above and to the left, lid open, deck catching the light
	 * pose 'low'   — lower and turned further, screen dominant
	 * pose 'hero'  — barely turned, for pages where the screen has to stay readable
	 */
	let {
		screen,
		hovered = false,
		pose = 'float'
	}: { screen?: Snippet; hovered?: boolean; pose?: 'float' | 'low' | 'hero' } = $props();

	// design-space canvas; the whole rig is scaled to whatever width we are given
	const SW = 980;
	const SH = 660;
	let fit = $state(0);
	const s = $derived(fit ? fit / SW : 0);
</script>

<div class="panel" class:on={hovered}>
	<div class="fit" bind:clientWidth={fit} style="height: {SH * s}px">
		<div class="stage" style="transform: scale({s})">
			<div class="rig {pose}">
				<div class="shadow"></div>

				<div class="hinge">
					<!-- lid: bezel + live screen, leaning back from the hinge -->
					<div class="lid">
						<div class="shell"></div>
						<div class="bezel">
							<span class="cam"></span>
							<div class="screen">
								{@render screen?.()}
							</div>
							<span class="glare"></span>
						</div>
					</div>

					<!-- deck: keyboard plate lying flat, hinged at the same line -->
					<div class="base">
						<div class="deck">
							<div class="keys"></div>
							<div class="pad"></div>
							<span class="notch"></span>
						</div>
						<div class="lip"></div>
					</div>
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
		perspective: 1750px;
		perspective-origin: 50% 40%;
	}

	.rig {
		position: absolute;
		inset: 0;
		transform-style: preserve-3d;
		transition: transform 0.9s var(--ease-out);
	}
	/* two poses, matching the pair in a classic floating product shot */
	.rig.float {
		transform: translateY(16px) scale(1.08) rotateX(27deg) rotateY(-25deg) rotateZ(6deg);
	}
	.rig.low {
		transform: translateY(30px) scale(1.1) rotateX(13deg) rotateY(-31deg) rotateZ(-4deg);
	}
	.rig.hero {
		transform: translateY(10px) scale(1.1) rotateX(13deg) rotateY(-10deg) rotateZ(1deg);
	}
	.panel.on .rig.float {
		transform: translateY(8px) scale(1.11) rotateX(22deg) rotateY(-19deg) rotateZ(4deg);
	}
	.panel.on .rig.low {
		transform: translateY(22px) scale(1.13) rotateX(11deg) rotateY(-24deg) rotateZ(-3deg);
	}
	.panel.on .rig.hero {
		transform: translateY(4px) scale(1.13) rotateX(11deg) rotateY(-7deg) rotateZ(1deg);
	}

	/* the hinge is a zero-height line; lid sits above it, deck runs away from it */
	.hinge {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 0;
		height: 0;
		transform-style: preserve-3d;
	}

	/* ---------- lid ---------- */
	.lid {
		position: absolute;
		left: -307px;
		bottom: 0;
		width: 614px;
		height: 428px;
		transform-origin: 50% 100%;
		transform: rotateX(-13deg);
		transform-style: preserve-3d;
	}
	/* aluminium back of the lid, sitting a few px behind the bezel */
	.shell {
		position: absolute;
		inset: 0;
		border-radius: 16px 16px 3px 3px;
		background: linear-gradient(200deg, #eef1fb 0%, #c9d1ec 45%, #9aa5d2 100%);
		transform: translateZ(-7px);
		box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.75);
	}
	.bezel {
		position: absolute;
		inset: 0;
		border-radius: 16px 16px 3px 3px;
		background: linear-gradient(200deg, #171d42 0%, #0a0e28 40%, #070a1e 100%);
		padding: 29px 19px 39px;
		box-shadow:
			inset 0 1px 0 rgba(226, 231, 248, 0.35),
			inset 0 0 0 1px rgba(226, 231, 248, 0.14);
	}
	.cam {
		position: absolute;
		left: 50%;
		top: 13px;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #2b3470;
		transform: translateX(-50%);
	}
	.screen {
		position: relative;
		width: 576px;
		height: 360px;
		background: var(--white);
		overflow: hidden;
	}
	/* raking light across the glass */
	.glare {
		position: absolute;
		left: 19px;
		top: 29px;
		width: 576px;
		height: 360px;
		pointer-events: none;
		background: linear-gradient(104deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.05) 26%, transparent 46%);
		mix-blend-mode: screen;
		transition: opacity 0.6s;
	}
	.panel.on .glare {
		opacity: 0.45;
	}

	/* ---------- deck ---------- */
	.base {
		position: absolute;
		left: -307px;
		top: 0;
		width: 614px;
		height: 424px;
		transform-origin: 50% 0%;
		transform: rotateX(-90deg);
		transform-style: preserve-3d;
	}
	.deck {
		position: absolute;
		inset: 0;
		border-radius: 3px 3px 16px 16px;
		background: linear-gradient(178deg, #8c97c6 0%, #cfd6ef 10%, #b6c0e2 55%, #dfe4f6 100%);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
	}
	/* keyboard well */
	.keys {
		position: absolute;
		left: 58px;
		right: 58px;
		top: 30px;
		height: 150px;
		border-radius: 4px;
		background:
			repeating-linear-gradient(90deg, #1b2251 0 3.55%, transparent 3.55% 4.55%),
			repeating-linear-gradient(180deg, #1b2251 0 16.5%, transparent 16.5% 21.5%),
			#69749f;
		box-shadow: inset 0 0 14px rgba(12, 18, 52, 0.75);
	}
	.pad {
		position: absolute;
		left: 50%;
		top: 205px;
		width: 250px;
		height: 158px;
		margin-left: -125px;
		border-radius: 4px;
		background: linear-gradient(180deg, #b9c2e4 0%, #d4daf1 100%);
		box-shadow:
			inset 0 0 0 1px rgba(60, 72, 130, 0.5),
			inset 0 2px 5px rgba(30, 38, 88, 0.12);
	}
	/* the scoop cut into the front edge */
	.notch {
		position: absolute;
		left: 50%;
		bottom: -1px;
		width: 130px;
		height: 13px;
		margin-left: -65px;
		border-radius: 0 0 60px 60px / 0 0 13px 13px;
		background: linear-gradient(#b6bfe4, #9aa4d0);
	}
	/* front thickness of the deck */
	.lip {
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		height: 13px;
		border-radius: 0 0 4px 4px;
		background: linear-gradient(#939ecb, #5d6aa6);
		transform-origin: 50% 0%;
		transform: rotateX(-90deg);
	}

	/* ---------- contact shadow on the ground ---------- */
	.shadow {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 900px;
		height: 520px;
		margin: -60px 0 0 -450px;
		border-radius: 50%;
		background: radial-gradient(closest-side, rgba(0, 0, 0, 0.62), transparent 72%);
		filter: blur(26px);
		transform: rotateX(-90deg) translateZ(-190px);
	}

	@media (prefers-reduced-motion: reduce) {
		.rig {
			transition: none;
		}
	}
</style>
