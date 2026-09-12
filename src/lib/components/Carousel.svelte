<script lang="ts">
	import Preview from '$lib/components/Preview.svelte';
	import type { Project } from '$lib/projects';
	import { onMount } from 'svelte';

	let { projects, showCaption = true }: { projects: Project[]; showCaption?: boolean } = $props();

	let idx = $state(0);
	let hover = $state(false); // centre slide hovered / focused / tapped
	const n = $derived(projects.length);

	// flat track: every slide the same size, the strip slides sideways
	let vw = $state(0);
	const gap = $derived(vw < 700 ? 14 : 28);
	const slideW = $derived(vw ? Math.round(vw * (vw < 700 ? 0.8 : 0.56)) : 0);
	const step = $derived(slideW + gap);
	const shift = $derived(vw / 2 - idx * step - slideW / 2);

	function go(d: number) {
		idx = (idx + d + projects.length) % projects.length;
		hover = false;
	}

	// drag / swipe
	let root: HTMLElement;
	let dragX = 0,
		dragging = false;
	function down(e: PointerEvent) {
		dragging = true;
		dragX = e.clientX;
	}
	function up(e: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		const dx = e.clientX - dragX;
		if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
	}

	onMount(() => {
		// arrow keys drive the carousel while it is on screen
		let visible = true;
		const io = new IntersectionObserver((es) => (visible = es[0].isIntersecting), { threshold: 0.2 });
		if (root) io.observe(root);

		const onKey = (e: KeyboardEvent) => {
			if (!visible) return;
			const t = e.target as HTMLElement | null;
			if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
			if (e.key === 'ArrowRight') go(1);
			if (e.key === 'ArrowLeft') go(-1);
		};
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('keydown', onKey);
			io.disconnect();
		};
	});
</script>

<div class="carousel" bind:this={root}>
	<div
		class="viewport"
		bind:clientWidth={vw}
		onpointerdown={down}
		onpointerup={up}
		onpointercancel={() => (dragging = false)}
		role="region"
		aria-roledescription="carousel"
		aria-label="Projects"
	>
		<div class="track" style="transform: translate3d({shift}px,0,0); gap: {gap}px">
			{#each projects as p, i}
				<a
					class="slide"
					class:on={i === idx}
					style="width: {slideW}px"
					href={p.link}
					tabindex={i === idx ? 0 : -1}
					aria-hidden={i !== idx}
					onpointerenter={() => (hover = i === idx)}
					onpointerleave={() => (hover = false)}
					onfocusin={() => (hover = i === idx)}
					onfocusout={() => (hover = false)}
					onclick={(e) => {
						if (i !== idx) {
							e.preventDefault();
							idx = i;
						}
					}}
				>
					<div class="shot">
						<Preview project={p} active={i === idx && hover} />
					</div>
					{#if showCaption}
						<div class="cap">
							<span class="t">{p.title}</span>
							<span class="mono m">{p.tags.slice(0, 3).join(' · ')} · {p.year}</span>
						</div>
					{/if}
				</a>
			{/each}
		</div>
	</div>

	<div class="bar">
		<button class="nav" onclick={() => go(-1)} aria-label="Previous project">←</button>
		<div class="dots" role="tablist" aria-label="Choose project">
			{#each projects as p, i}
				<button
					role="tab"
					aria-selected={i === idx}
					aria-label={p.title}
					class:on={i === idx}
					onclick={() => (idx = i)}
				></button>
			{/each}
		</div>
		<button class="nav" onclick={() => go(1)} aria-label="Next project">→</button>
	</div>
</div>

<style>
	.viewport {
		overflow: hidden;
		touch-action: pan-y;
		user-select: none;
	}
	.track {
		display: flex;
		align-items: flex-start;
		transition: transform 0.65s var(--ease-out);
		will-change: transform;
	}
	.slide {
		flex: 0 0 auto;
		color: var(--deep);
		opacity: 0.32;
		transition: opacity 0.45s var(--ease-out);
	}
	.slide:hover {
		text-decoration: none;
	}
	.slide.on {
		opacity: 1;
	}
	.shot {
		aspect-ratio: 16 / 10;
		background: var(--mist);
		overflow: hidden;
	}

	/* small, quiet caption under every slide */
	.cap {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding-top: 0.85rem;
	}
	.t {
		font-size: 0.95rem;
		font-weight: 600;
	}
	.m {
		font-size: 0.62rem;
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.4rem;
		margin-top: 2rem;
	}
	.nav {
		font-family: var(--mono);
		font-size: 0.9rem;
		color: var(--mid);
		padding: 0.2rem 0.3rem;
		transition: color 0.2s;
	}
	.nav:hover {
		color: var(--dot);
	}
	.dots {
		display: flex;
		gap: 9px;
		align-items: center;
	}
	.dots button {
		width: 6px;
		height: 6px;
		background: var(--haze);
		transition:
			background 0.25s,
			transform 0.3s var(--ease-out);
	}
	.dots button.on {
		background: var(--dot);
		transform: scale(1.4);
	}

	@media (max-width: 700px) {
		.bar {
			margin-top: 1.4rem;
		}
	}
</style>
