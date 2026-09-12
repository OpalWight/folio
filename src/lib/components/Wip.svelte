<script lang="ts" module>
	/**
	 * The bloom used for a placeholder is picked from the slug it is standing in for,
	 * so a project keeps the same flower on every page it appears on while the grid as
	 * a whole gets some variety. Each entry carries its own cover-fit focus point,
	 * since the blooms sit in different parts of their frames.
	 */
	const FLOWERS: { src: string; focus: [number, number] }[] = [
		{ src: '/lily.jpg', focus: [0.72, 0.45] },
		{ src: '/flowers/rose.jpg', focus: [0.56, 0.5] },
		{ src: '/flowers/tulip.jpg', focus: [0.38, 0.44] },
		{ src: '/flowers/forget-me-not.jpg', focus: [0.52, 0.52] }
	];

	function pick(seed: string) {
		let h = 0;
		for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
		return FLOWERS[h % FLOWERS.length];
	}
</script>

<script lang="ts">
	import DotField from '$lib/components/DotField.svelte';
	import type { DotFieldOptions } from '$lib/dots';

	/** Standard work-in-progress placeholder: dot flower + a small mono chip. */
	let {
		label = 'WIP',
		seed = '',
		options = {}
	}: { label?: string; seed?: string; options?: DotFieldOptions } = $props();

	const flower = $derived(pick(seed));
</script>

<div class="wip">
	<DotField
		src={flower.src}
		options={{
			cell: 4,
			loadIn: false,
			wander: false,
			interactive: false,
			breathe: false,
			sway: false,
			still: true,
			push: 70,
			focus: flower.focus,
			...options
		}}
	/>
	<span class="mono tag">{label}</span>
</div>

<style>
	.wip {
		position: relative;
		width: 100%;
		height: 100%;
		background: var(--mist);
	}
	.tag {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background: var(--white);
		border: 1px solid var(--haze);
		color: var(--deep);
		padding: 0.25rem 0.6rem;
		letter-spacing: 0.14em;
	}
</style>
