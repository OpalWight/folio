<script lang="ts">
	import DotField from '$lib/components/DotField.svelte';
	import type { DotFieldOptions } from '$lib/dots';

	/** Standard work-in-progress placeholder: dot flower + a small mono chip. */
	let { label = 'WIP', options = {} }: { label?: string; options?: DotFieldOptions } = $props();
</script>

<div class="wip">
	<DotField
		src="/lily.jpg"
		options={{ cell: 4, loadIn: false, wander: false, interactive: false, push: 70, focus: [0.72, 0.45], ...options }}
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
