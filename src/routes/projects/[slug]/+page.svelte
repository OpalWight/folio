<script lang="ts">
	import Laptop from '$lib/components/Laptop.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import { reveal } from '$lib/reveal';
	let { data } = $props();
	const p = $derived(data.project);
	const next = $derived(data.next);
	const hasResults = $derived((p.results ?? []).some((r) => !/to be written|with a number|line three/i.test(r)));
</script>

<svelte:head>
	<title>{p.title} — Albert Vo</title>
	<meta name="description" content={p.description} />
	<meta property="og:title" content="{p.title} — Albert Vo" />
	<meta property="og:description" content={p.description} />
</svelte:head>

{#key p.slug}
	<article class="wrap proj">
		<a href="/work" class="mono back">← All work</a>

		<header class="head" use:reveal={{ delay: 80 }} data-stagger-group>
			<p class="chip" data-stagger>{p.tags.join(' · ')}</p>
			<h1 data-stagger>{p.title}</h1>
			<p class="lede" data-stagger>{p.description}</p>
		</header>

		<dl class="meta" use:reveal={{ delay: 160 }}>
			<div><dt class="label">Role</dt><dd>{p.role ?? '—'}</dd></div>
			<div><dt class="label">Dates</dt><dd>{p.dates ?? p.year}</dd></div>
			<div><dt class="label">Stack</dt><dd>{p.tags.join(' · ')}</dd></div>
			<div>
				<dt class="label">Links</dt>
				<dd class="links">
					{#if p.live}<a href={p.live} target="_blank" rel="noopener">Live site ↗</a>{/if}
					{#if p.github}<a href={p.github} target="_blank" rel="noopener">GitHub ↗</a>{/if}
					{#if !p.github && !p.live}—{/if}
				</dd>
			</div>
		</dl>

		<div class="cover" use:reveal={{ delay: 240, y: 24 }}>
			<Laptop pose="hero">
				{#snippet screen()}
					<Preview project={p} mode="always" />
				{/snippet}
			</Laptop>
			{#if p.live}
				<p class="mono cap">Live · {p.live.replace(/^https?:\/\//, '')}</p>
			{/if}
		</div>

		<section class="study" use:reveal data-stagger-group>
			<aside class="outcomes" data-stagger>
				<p class="label">{hasResults ? 'Outcomes' : 'At a glance'}</p>
				{#if hasResults}
					<ul class="arrows">
						{#each p.results ?? [] as r}<li>{r}</li>{/each}
					</ul>
				{:else}
					<ul class="arrows">
						<li>{p.tags.join(', ')}</li>
						<li>{p.role ?? 'Personal project'}, {p.dates ?? p.year}</li>
						{#if p.live}<li>Live at {p.live.replace(/^https?:\/\//, '')}</li>{:else if p.github}<li>Source on GitHub</li>{/if}
					</ul>
				{/if}
			</aside>
			<div class="overview">
				<p class="label" data-stagger>Overview</p>
				{#each p.body ?? ['Write-up coming soon.'] as para, i}
					<p class:first={i === 0} data-stagger>{para}</p>
				{/each}
			</div>
		</section>

		{#if p.gallery?.length}
			<div class="gallery" use:reveal data-stagger-group>
				{#each p.gallery as g}<img src={g} alt="" loading="lazy" data-stagger />{/each}
			</div>
		{/if}

		<a class="next" href={next.link} use:reveal>
			<span class="mono">Next project</span>
			<span class="nt">{next.title}</span>
			<span class="arrow" aria-hidden="true">→</span>
		</a>
	</article>
{/key}

<style>
	.proj {
		padding-top: calc(var(--header-h) + 48px);
	}
	.back {
		display: inline-block;
		color: var(--deep);
		margin-bottom: 2.2rem;
	}
	.head {
		max-width: 30ch;
	}
	h1 {
		font-family: var(--serif);
		font-size: clamp(2.8rem, 7vw, 5.4rem);
		line-height: 0.96;
		letter-spacing: -0.01em;
		margin: 1.1rem 0 1rem;
	}
	.lede {
		font-family: var(--serif);
		font-style: italic;
		font-size: clamp(1.15rem, 2vw, 1.5rem);
		line-height: 1.35;
		color: var(--text);
		max-width: 44ch;
	}

	/* open meta row: hairline above and below, no cells */
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1.2rem 3.5rem;
		border-top: 1px solid var(--haze);
		border-bottom: 1px solid var(--haze);
		padding: 1.2rem 0;
		margin: 2.4rem 0 2.6rem;
	}
	.meta > div {
		min-width: 0;
	}
	dt {
		margin-bottom: 0.25rem;
	}
	dd {
		margin: 0;
		font-weight: 600;
		font-size: 0.92rem;
		color: var(--deep);
	}
	.links {
		display: flex;
		gap: 1.2rem;
	}
	.links a {
		color: var(--dot);
	}

	.cover {
		position: relative;
	}
	.cap {
		margin-top: 0.7rem;
		text-align: right;
	}

	.study {
		display: grid;
		grid-template-columns: 0.8fr 1.2fr;
		gap: 2rem 4rem;
		margin-top: 3.5rem;
		align-items: start;
	}
	.outcomes .label,
	.overview .label {
		margin-bottom: 0.9rem;
	}
	.outcomes :global(ul.arrows li:last-child) {
		border-bottom: 1px solid var(--haze);
	}
	.overview {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		color: var(--text);
		font-size: 1.02rem;
		max-width: 62ch;
	}
	.overview p.first {
		font-size: 1.14rem;
		color: var(--deep);
	}

	.gallery {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.2rem;
		margin-top: 3rem;
	}

	.next {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-areas: 'l a' 't a';
		align-items: center;
		gap: 0.2rem 2rem;
		border-top: 1px solid var(--haze);
		padding: 1.8rem 0 0.4rem;
		margin-top: 4rem;
		color: var(--deep);
	}
	.next:hover {
		text-decoration: none;
	}
	.next .mono {
		grid-area: l;
	}
	.nt {
		grid-area: t;
		font-family: var(--serif);
		font-size: clamp(1.8rem, 4vw, 3rem);
		line-height: 1.05;
	}
	.arrow {
		grid-area: a;
		font-family: var(--serif);
		font-size: 2.6rem;
		color: var(--dot);
		transition: transform 0.45s var(--ease-out);
	}
	.next:hover .arrow {
		transform: translateX(10px);
	}

	@media (max-width: 860px) {
		.study {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 700px) {
		.proj {
			padding-top: calc(var(--header-h) + 32px);
		}
		.meta {
			gap: 1rem 2rem;
		}
		.gallery {
			grid-template-columns: 1fr;
		}
	}
</style>
