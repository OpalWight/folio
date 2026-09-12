<script lang="ts">
	import { onMount } from 'svelte';
	import { createDotField, type DotFieldOptions } from '$lib/dots';

	let {
		src,
		options = {},
		label = ''
	}: { src: string; options?: DotFieldOptions; label?: string } = $props();

	let canvas: HTMLCanvasElement;

	onMount(() => createDotField(canvas, src, options).destroy);
</script>

<canvas bind:this={canvas} aria-label={label} role={label ? 'img' : 'presentation'}></canvas>

<style>
	canvas {
		display: block;
		width: 100%;
		height: 100%;
		touch-action: pan-y;
	}
</style>
