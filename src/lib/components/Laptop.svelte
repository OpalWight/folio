<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * Laptop mockup drawn entirely in CSS 3D: a lid (bezel + screen) hinged to a keyboard
	 * deck that lies flat in depth, so the whole object can be posed like a product shot.
	 *
	 * pose 'float' — seen from above and the left, lid open, keyboard visible, drifting
	 * pose 'low'   — seen from low front-left, lid leaning back, screen dominant
	 * pose 'flat'  — nearly straight on (project page)
	 */
	let {
		screen,
		hovered = false,
		pose = 'float'
	}: { screen?: Snippet; hovered?: boolean; pose?: 'float' | 'low' | 'flat' } = $props();
</script>

<div class="panel {pose}" class:on={hovered}>
	<div class="light" aria-hidden="true"></div>
	<div class="scene">
		<div class="laptop">
			<div class="lid">
				<div class="bezel">
					<span class="cam"></span>
					<div class="screen">
						{@render screen?.()}
					</div>
				</div>
				<div class="lidback"></div>
			</div>
			<div class="base">
				<div class="deck">
					<div class="keys"></div>
					<div class="pad"></div>
				</div>
				<div class="lip"></div>
			</div>
		</div>
	</div>
</div>

<style>
	.panel {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 11;
		overflow: hidden;
		background:
			radial-gradient(120% 90% at 10% 0%, #16247f 0%, transparent 55%),
			linear-gradient(135deg, var(--deep) 0%, #0b1240 50%, #070b2e 100%);
	}
	/* glossy sweep of light across the panel, like a studio backdrop */
	.light {
		position: absolute;
		inset: -20%;
		background: linear-gradient(
			118deg,
			transparent 42%,
			rgba(217, 223, 245, 0.12) 52%,
			rgba(217, 223, 245, 0.28) 58%,
			rgba(217, 223, 245, 0.1) 66%,
			transparent 74%
		);
		filter: blur(6px);
		transform: translateX(6%);
		transition: transform 1.2s var(--ease-out);
		pointer-events: none;
	}
	.panel.on .light {
		transform: translateX(-4%);
	}

	.scene {
		position: absolute;
		inset: 0;
		perspective: 1500px;
		perspective-origin: 50% 40%;
	}
	.laptop {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 70%;
		aspect-ratio: 16 / 10;
		transform-style: preserve-3d;
		transition: transform 1s var(--ease-out);
		will-change: transform;
	}

	/* ----- lid ----- */
	.lid {
		position: absolute;
		inset: 0;
		transform-style: preserve-3d;
		transform-origin: 50% 100%;
		transition: transform 1s var(--ease-out);
	}
	.bezel {
		position: absolute;
		inset: 0;
		background: #070c2c;
		border: 1px solid rgba(217, 223, 245, 0.28);
		border-radius: 10px 10px 4px 4px;
		padding: 2.6% 2.6% 3.2%;
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.04),
			0 30px 60px -20px rgba(0, 0, 0, 0.6);
		backface-visibility: hidden;
	}
	.cam {
		position: absolute;
		left: 50%;
		top: 1.1%;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #1c2a6b;
		transform: translateX(-50%);
	}
	.screen {
		position: relative;
		width: 100%;
		height: 100%;
		background: var(--white);
		border-radius: 3px;
		overflow: hidden;
	}
	/* back of the lid, visible when it leans away */
	.lidback {
		position: absolute;
		inset: 0;
		background: linear-gradient(160deg, #c9d1ee, #9aa6d6);
		border-radius: 10px 10px 4px 4px;
		transform: translateZ(-2px);
		backface-visibility: hidden;
	}

	/* ----- base: rotated down from the hinge so it lies flat in depth ----- */
	.base {
		position: absolute;
		left: -3%;
		right: -3%;
		top: 100%;
		height: 68%;
		transform-origin: 50% 0%;
		transform: rotateX(-90deg);
		transform-style: preserve-3d;
	}
	.deck {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, #d5dbf2 0%, #c3cbea 100%);
		border-radius: 0 0 14px 14px;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
	}
	.keys {
		position: absolute;
		left: 9%;
		right: 9%;
		top: 9%;
		height: 44%;
		background-image:
			repeating-linear-gradient(90deg, #9ea9d8 0 5.4%, transparent 5.4% 6.6%),
			repeating-linear-gradient(0deg, #9ea9d8 0 16%, transparent 16% 20%);
		background-color: transparent;
		border-radius: 3px;
		opacity: 0.9;
		-webkit-mask: linear-gradient(#000, #000);
		mask: linear-gradient(#000, #000);
	}
	.pad {
		position: absolute;
		left: 35%;
		right: 35%;
		top: 62%;
		height: 28%;
		border: 1px solid rgba(107, 122, 196, 0.5);
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.25);
	}
	/* front lip / thickness of the deck */
	.lip {
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		height: 10px;
		background: linear-gradient(#aab4e3, #7f8cc7);
		transform-origin: 50% 0%;
		transform: rotateX(90deg);
		border-radius: 0 0 14px 14px;
	}

	/* ----- poses ----- */
	.float .laptop {
		transform: translate(-50%, -62%) rotateX(38deg) rotateY(-26deg) rotateZ(9deg);
		animation: drift 7s ease-in-out infinite alternate;
	}
	.float .lid {
		transform: rotateX(-14deg);
	}
	.float.on .laptop {
		transform: translate(-50%, -60%) rotateX(30deg) rotateY(-18deg) rotateZ(6deg) scale(1.03);
		animation: none;
	}
	@keyframes drift {
		to {
			transform: translate(-50%, -66%) rotateX(36deg) rotateY(-30deg) rotateZ(10deg);
		}
	}

	.low .laptop {
		width: 78%;
		transform: translate(-50%, -42%) rotateX(-10deg) rotateY(-16deg) rotateZ(-2deg);
	}
	.low .lid {
		transform: rotateX(-22deg);
	}
	.low.on .laptop {
		transform: translate(-50%, -44%) rotateX(-6deg) rotateY(-9deg) rotateZ(-1deg) scale(1.03);
	}
	.low.on .lid {
		transform: rotateX(-16deg);
	}
	.low .scene {
		perspective-origin: 50% 70%;
	}

	.flat .laptop {
		width: 74%;
		transform: translate(-50%, -54%) rotateX(6deg) rotateY(-8deg);
	}
	.flat .lid {
		transform: rotateX(-6deg);
	}

	@media (max-width: 860px) {
		.panel {
			aspect-ratio: 16 / 12;
		}
		.float .laptop {
			width: 76%;
			transform: translate(-50%, -60%) rotateX(30deg) rotateY(-18deg) rotateZ(6deg);
			animation: none;
		}
		.low .laptop {
			width: 84%;
			transform: translate(-50%, -38%) rotateX(-6deg) rotateY(-10deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.float .laptop {
			animation: none;
		}
	}
</style>
