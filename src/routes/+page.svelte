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
	<div class="sec mid" use:reveal>
		<h2>Work<span class="cut">/</span><span class="kick">Featured</span></h2>
	</div>
	<div class="rule"></div>

	<div class="cards">
		{#each highlights as p, i (p.slug)}
			<div use:reveal={{ delay: 60 }}>
				<WorkCard project={p} mock={i === 0 ? 'studio' : 'air'} />
			</div>
		{/each}
	</div>

	<div class="sec mid more" use:reveal>
		<h2>Work<span class="cut">/</span><span class="kick">More</span></h2>
	</div>
	<div class="rule"></div>

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
	/* the second heading opens the carousel, so it carries the space the strip used to */
	.sec.more {
		margin-top: 5.5rem;
	}
	/* the carousel breaks out of the reading column and runs to both edges of the
	   window, so the strip is cut by the page rather than by the container */
	.carousel-wrap {
		margin-top: 2.6rem;
		width: 100vw;
		margin-left: calc(50% - 50vw);
		margin-right: calc(50% - 50vw);
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
		color: var(--dot);
		padding-bottom: 0.3rem;
		border-bottom: 1px solid var(--haze);
		transition: border-color 0.25s;
	}
	.cta a:hover {
		text-decoration: none;
		border-bottom-color: var(--dot);
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
		.sec.more {
			margin-top: 3.6rem;
		}
		.carousel-wrap {
			margin-top: 1.8rem;
		}
	}
</style>
