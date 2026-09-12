<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import WorkCard from '$lib/components/WorkCard.svelte';
	import { featured, playground } from '$lib/projects';
	import { reveal } from '$lib/reveal';

	// two big highlighted cards, then a carousel of the rest
	const highlights = featured.slice(0, 2);
	const more = [...featured.slice(2), ...playground.slice(0, 4)];
</script>

<svelte:head>
	<title>Albert Vo</title>
	<meta name="description" content="Albert Vo — researcher, software engineer, data scientist, neurotech engineer. UC Davis, San Jose." />
	<meta property="og:title" content="Albert Vo" />
	<meta property="og:description" content="Researcher · Software Engineer · Data Scientist · Neurotech Engineer" />
</svelte:head>

<Hero />

<section id="work" class="wrap work">
	<div class="sec" use:reveal>
		<h2>Work</h2>
	</div>
	<div class="rule"></div>

	<div class="cards">
		{#each highlights as p, i (p.slug)}
			<div use:reveal={{ delay: 60 }}>
				<WorkCard project={p} pose={i === 0 ? 'float' : 'low'} />
			</div>
		{/each}
	</div>

	<div class="carousel-wrap" use:reveal>
		<Carousel projects={more} />
	</div>

	<div class="cta" use:reveal>
		<a href="/work">View all work →</a>
	</div>
</section>

<style>
	.work {
		padding-top: 6.5rem;
		padding-bottom: 1rem;
	}
	.cards {
		display: grid;
		gap: 4rem;
		margin-top: 2.6rem;
	}
	.carousel-wrap {
		margin-top: 5rem;
	}
	.cta {
		display: flex;
		justify-content: center;
		margin-top: 3rem;
	}
	.cta a {
		font-family: var(--mono);
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--deep);
		border: 1px solid var(--haze);
		padding: 0.85rem 1.6rem;
		transition:
			background 0.25s,
			color 0.25s,
			border-color 0.25s;
	}
	.cta a:hover {
		text-decoration: none;
		background: var(--deep);
		color: var(--white);
		border-color: var(--deep);
	}
	@media (max-width: 860px) {
		.cards {
			gap: 3rem;
		}
	}
	@media (max-width: 700px) {
		.work {
			padding-top: 3.6rem;
		}
		.carousel-wrap {
			margin-top: 3.4rem;
		}
	}
</style>
