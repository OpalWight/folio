<script lang="ts">
	import Laptop, { type Mock } from '$lib/components/Laptop.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import type { Project } from '$lib/projects';

	let { project, mock = 'studio' }: { project: Project; mock?: Mock } = $props();

	let active = $state(false);
	let open = $state(false);
	let dwell = 0;

	const DWELL = 90; // just enough to ignore a pointer sweeping across the card

	function enter() {
		active = true;
		clearTimeout(dwell);
		dwell = window.setTimeout(() => (open = true), DWELL);
	}
	function leave() {
		clearTimeout(dwell);
		open = false;
		active = false;
	}
</script>

<svelte:window onscroll={() => clearTimeout(dwell)} />

<article class="card">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="frame"
		onpointerenter={enter}
		onpointerleave={leave}
		onfocusin={enter}
		onfocusout={leave}
	>
		<Laptop hovered={active && !open} expanded={open} {mock}>
			{#snippet screen()}
				<Preview {project} {active} interactive={open} />
			{/snippet}
		</Laptop>
	</div>

	<div class="txt">
		<h3><a href={project.link}>{project.title}</a></h3>
		<ul class="arrows">
			{#each project.results ?? [] as r}<li>{r}</li>{/each}
		</ul>
		<div class="foot mono">
			<a class="go" href={project.link}>Open →</a>
		</div>
	</div>
</article>

<style>
	.card {
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		gap: 2.4rem;
		align-items: start;
		color: var(--deep);
	}
	/* 16:10 so the screen lands on the panel exactly when it takes over */
	.frame {
		position: relative;
		aspect-ratio: 16 / 10;
		min-width: 0;
	}

	.txt {
		display: flex;
		flex-direction: column;
		min-width: 0;
		padding: 0.2rem 0 0;
		height: 100%;
	}
	h3 {
		font-family: var(--serif);
		font-size: clamp(1.7rem, 2.8vw, 2.3rem);
		line-height: 1.05;
		margin: 0 0 1rem;
	}
	h3 a {
		color: var(--deep);
	}
	h3 a:hover {
		text-decoration: none;
		color: var(--dot);
	}
	.card :global(ul.arrows li) {
		transition: transform 0.45s var(--ease-out);
	}
	.card:hover :global(ul.arrows li) {
		transform: translateX(6px);
	}
	.card:hover :global(ul.arrows li:nth-child(2)) {
		transition-delay: 40ms;
	}
	.card:hover :global(ul.arrows li:nth-child(3)) {
		transition-delay: 80ms;
	}
	.foot {
		margin-top: auto;
		padding-top: 1.2rem;
		display: flex;
		align-items: baseline;
	}
	.go {
		color: var(--dot);
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.3s,
			transform 0.4s var(--ease-out);
	}
	.card:hover .go,
	.go:focus-visible {
		opacity: 1;
		transform: none;
	}
	@media (max-width: 860px) {
		.card {
			grid-template-columns: 1fr;
			gap: 1.4rem;
		}
		.go {
			opacity: 1;
			transform: none;
		}
	}
</style>
