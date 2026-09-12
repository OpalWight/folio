<script lang="ts">
	import Laptop from '$lib/components/Laptop.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import type { Project } from '$lib/projects';

	let { project, pose = 'float' }: { project: Project; pose?: 'float' | 'low' | 'hero' } = $props();

	let active = $state(false);
</script>

<a
	class="card"
	href={project.link}
	onpointerenter={() => (active = true)}
	onpointerleave={() => (active = false)}
	onfocusin={() => (active = true)}
	onfocusout={() => (active = false)}
>
	<div class="img">
		<Laptop hovered={active} {pose}>
			{#snippet screen()}
				<Preview {project} {active} />
			{/snippet}
		</Laptop>
	</div>

	<div class="txt">
		<h3>{project.title}</h3>
		<ul class="arrows">
			{#each project.results ?? [] as r}<li>{r}</li>{/each}
		</ul>
		<div class="foot mono">
			<span>{project.dates ?? project.year}</span>
			<span class="rt">
				<span>{project.role ?? ''}</span>
				<span class="go">Open →</span>
			</span>
		</div>
	</div>
</a>

<style>
	.card {
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		gap: 2.4rem;
		align-items: start;
		color: var(--deep);
		text-decoration: none;
	}
	.card:hover {
		text-decoration: none;
	}
	.img {
		position: relative;
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
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}
	.rt {
		display: flex;
		align-items: baseline;
		gap: 0.9rem;
	}
	.go {
		color: var(--dot);
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.3s,
			transform 0.4s var(--ease-out);
	}
	.card:hover .go {
		opacity: 1;
		transform: none;
	}
	@media (max-width: 860px) {
		.card {
			grid-template-columns: 1fr;
			gap: 1.4rem;
		}
		.go {
			display: none;
		}
	}
</style>
