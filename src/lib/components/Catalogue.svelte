<script lang="ts">
	import Wip from '$lib/components/Wip.svelte';
	import { reveal } from '$lib/reveal';
	import type { Project } from '$lib/projects';

	/**
	 * Lopsided catalogue of every project.
	 *
	 * Mobile-first: one column, no offsets. From 861px up a 12-column grid takes
	 * over and each entry gets an explicit `grid-column` on a six-entry cycle —
	 * three differently-weighted rows (7+4, 4+7, 5+6 units) before it repeats,
	 * so the page never settles into an obvious ABAB. The empty column between
	 * each pair is the gutter. Every right-hand entry is pushed down by its own
	 * margin, which staggers the rhythm without ever overlapping: explicit
	 * columns + auto rows means grid packs sparsely and each row grows to fit
	 * its tallest item.
	 */
	let { projects }: { projects: Project[] } = $props();
</script>

<div class="grid">
	{#each projects as p, i (p.slug)}
		<a class="entry" href={p.link} use:reveal={{ delay: i % 2 === 0 ? 0 : 90 }}>
			<div class="shot">
				<div class="fill">
					{#if p.image}
						<img src={p.image} alt={p.title} loading="lazy" decoding="async" />
					{:else}
						<Wip seed={p.slug} />
					{/if}
				</div>
			</div>

			<div class="meta">
				<h3>
					<span class="name">{p.title}</span><span class="go" aria-hidden="true">→</span>
				</h3>
				<p class="tags">
					{#each p.tags.slice(0, 3) as t}<span>{t}</span>{/each}
				</p>
			</div>
		</a>
	{/each}
</div>

<style>
	/* ---------- base: single column, mobile-first ---------- */
	.grid {
		display: grid;
		grid-template-columns: 1fr;
		row-gap: 3.2rem;
	}

	.entry {
		display: block;
		min-width: 0;
		color: var(--deep);
		text-decoration: none;
	}
	.entry:hover {
		text-decoration: none;
	}

	.shot {
		position: relative;
		overflow: hidden;
		background: var(--mist);
		aspect-ratio: 4 / 3;
	}

	.fill {
		position: absolute;
		inset: 0;
		transition: transform 0.7s var(--ease-out);
	}

	.fill img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.entry:hover .fill,
	.entry:focus-visible .fill {
		transform: scale(1.035);
	}

	.meta {
		padding-top: 0.95rem;
	}

	h3 {
		font-family: var(--serif);
		font-size: clamp(1.35rem, 2.3vw, 1.85rem);
		line-height: 1.1;
		letter-spacing: -0.005em;
		margin: 0;
		display: flex;
		align-items: baseline;
		gap: 0.55rem;
		min-width: 0;
	}

	.name {
		display: inline-block;
		min-width: 0;
		overflow-wrap: anywhere;
		transition: transform 0.45s var(--ease-out);
	}
	.entry:hover .name,
	.entry:focus-visible .name {
		transform: translateX(5px);
	}

	.go {
		flex: none;
		font-family: var(--mono);
		font-size: 0.8rem;
		color: var(--dot);
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.3s,
			transform 0.45s var(--ease-out);
	}
	.entry:hover .go,
	.entry:focus-visible .go {
		opacity: 1;
		transform: none;
	}

	/* plain small text — no borders, no fills, separated by whitespace only */
	.tags {
		margin: 0.5rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 1.1rem;
		font-family: var(--mono);
		font-size: 0.68rem;
		line-height: 1.5;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--mid);
	}

	/* mild aspect variety even in one column */
	.entry:nth-child(2n) .shot {
		aspect-ratio: 5 / 4;
	}

	/* ---------- 861px and up: the lopsided two-column grid ---------- */
	@media (min-width: 861px) {
		.grid {
			grid-template-columns: repeat(12, 1fr);
			column-gap: 0;
			row-gap: clamp(3.5rem, 6.5vw, 6.5rem);
		}

		/* row A — wide left (7u) */
		.entry:nth-child(6n + 1) {
			grid-column: 1 / 8;
		}
		.entry:nth-child(6n + 1) .shot {
			aspect-ratio: 16 / 10;
		}

		/* row A — narrow right (4u), pushed well down */
		.entry:nth-child(6n + 2) {
			grid-column: 9 / 13;
			margin-top: clamp(3rem, 6vw, 6.5rem);
		}
		.entry:nth-child(6n + 2) .shot {
			aspect-ratio: 4 / 5;
		}

		/* row B — narrow left (4u) */
		.entry:nth-child(6n + 3) {
			grid-column: 1 / 5;
		}
		.entry:nth-child(6n + 3) .shot {
			aspect-ratio: 1 / 1;
		}

		/* row B — wide right (7u), pushed down a little */
		.entry:nth-child(6n + 4) {
			grid-column: 6 / 13;
			margin-top: clamp(1.5rem, 3.5vw, 3.5rem);
		}
		.entry:nth-child(6n + 4) .shot {
			aspect-ratio: 16 / 9;
		}

		/* row C — mid-narrow left (5u), tall */
		.entry:nth-child(6n + 5) {
			grid-column: 1 / 6;
		}
		.entry:nth-child(6n + 5) .shot {
			aspect-ratio: 4 / 5;
		}

		/* row C — mid-wide right (6u), pushed down */
		.entry:nth-child(6n + 6) {
			grid-column: 7 / 13;
			margin-top: clamp(2.5rem, 5vw, 5rem);
		}
		.entry:nth-child(6n + 6) .shot {
			aspect-ratio: 16 / 10;
		}

		.meta {
			padding-top: 1.1rem;
		}
	}
</style>
