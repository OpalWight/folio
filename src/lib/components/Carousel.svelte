<script lang="ts">
	import Preview from '$lib/components/Preview.svelte';
	import type { Project } from '$lib/projects';
	import { onMount } from 'svelte';

	let { projects, showCaption = true }: { projects: Project[]; showCaption?: boolean } = $props();

	let idx = $state(0);
	let hover = $state(false); // centre slide hovered / focused / tapped
	const n = $derived(projects.length);
	const cur = $derived(projects[idx]);

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

	// position of slide i relative to the current one: -1 left, 0 center, 1 right, else hidden
	function rel(i: number, at: number, len: number) {
		const d = (i - at + len) % len;
		if (d === 0) return 0;
		if (d === 1) return 1;
		if (d === len - 1) return -1;
		return 9;
	}
</script>

<div class="carousel" bind:this={root}>
	<div
		class="car"
		onpointerdown={down}
		onpointerup={up}
		onpointercancel={() => (dragging = false)}
		role="region"
		aria-roledescription="carousel"
		aria-label="Projects"
	>
		<button class="nav prev" onclick={() => go(-1)} aria-label="Previous project">←</button>
		<div class="stage">
			{#each projects as p, i}
				{@const r = rel(i, idx, n)}
				<a
					class="slide"
					class:c={r === 0}
					class:l={r === -1}
					class:r={r === 1}
					class:h={r === 9}
					href={p.link}
					aria-hidden={r !== 0}
					tabindex={r === 0 ? 0 : -1}
					onpointerenter={() => (hover = r === 0)}
					onpointerleave={() => (hover = false)}
					onfocusin={() => (hover = r === 0)}
					onfocusout={() => (hover = false)}
					onclick={(e) => {
						if (r !== 0) {
							e.preventDefault();
							go(r);
						}
					}}
				>
					<div class="shot">
						<Preview project={p} active={r === 0 && hover} />
					</div>
					{#if p.featured}<span class="mono star">Featured</span>{/if}
					<span class="mono cue">Open →</span>
				</a>
			{/each}
		</div>
		<button class="nav next" onclick={() => go(1)} aria-label="Next project">→</button>
	</div>

	{#if showCaption}
		<div class="caption" aria-live="polite">
			{#key idx}
				<p class="mono tags">
					<b>{String(idx + 1).padStart(2, '0')}</b> / {String(n).padStart(2, '0')} · {cur.tags.join(' · ')}
				</p>
				<h3><a href={cur.link}>{cur.title}</a></h3>
				<p class="mono role">{cur.role ?? ''}{cur.role && (cur.dates ?? cur.year) ? ' · ' : ''}{cur.dates ?? cur.year}</p>
			{/key}
		</div>
	{/if}

	<!-- dot progress: one dot per project, current one filled -->
	<div class="dotsnav" role="tablist" aria-label="Choose project">
		{#each projects as p, i}
			<button role="tab" aria-selected={i === idx} aria-label={p.title} class:on={i === idx} onclick={() => (idx = i)}></button>
		{/each}
	</div>
</div>

<style>
	.car {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.6rem;
		touch-action: pan-y;
		user-select: none;
	}
	.stage {
		position: relative;
		height: clamp(240px, 42vw, 520px);
	}
	.slide {
		position: absolute;
		top: 0;
		left: 50%;
		width: min(74%, 820px);
		height: 100%;
		background: var(--mist);
		border: 1px solid var(--haze);
		overflow: hidden;
		transform-origin: center;
		transition:
			transform 0.7s var(--ease-out),
			opacity 0.5s,
			border-color 0.4s,
			filter 0.5s;
		will-change: transform;
	}
	.shot {
		position: absolute;
		inset: 0;
		transition: transform 0.7s var(--ease-out);
	}
	.star {
		position: absolute;
		left: 12px;
		top: 10px;
		background: var(--white);
		border: 1px solid var(--haze);
		padding: 0.2rem 0.5rem;
		color: var(--dot);
	}
	.cue {
		position: absolute;
		right: 12px;
		bottom: 10px;
		background: var(--white);
		padding: 0.2rem 0.5rem;
		color: var(--dot);
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.3s,
			transform 0.4s var(--ease-out);
	}
	.slide.c {
		transform: translateX(-50%) scale(1);
		opacity: 1;
		z-index: 3;
		filter: none;
	}
	.slide.l {
		transform: translateX(-50%) translateX(-58%) scale(0.72);
		opacity: 0.45;
		z-index: 2;
		filter: saturate(0.6);
	}
	.slide.r {
		transform: translateX(-50%) translateX(58%) scale(0.72);
		opacity: 0.45;
		z-index: 2;
		filter: saturate(0.6);
	}
	.slide.h {
		transform: translateX(-50%) scale(0.5);
		opacity: 0;
		z-index: 1;
		pointer-events: none;
	}
	/* subtle hover: the centre slide lifts its image and shows the open cue */
	.slide.c:hover {
		border-color: var(--mid);
	}
	.slide.c:hover .shot {
		transform: scale(1.03);
	}
	.slide.c:hover .cue {
		opacity: 1;
		transform: none;
	}
	.slide.l:hover,
	.slide.r:hover {
		opacity: 0.8;
	}
	.nav {
		width: 44px;
		height: 44px;
		border: 1px solid var(--haze);
		border-radius: 999px;
		font-family: var(--serif);
		font-size: 1.3rem;
		color: var(--deep);
		background: var(--white);
		transition:
			background 0.2s,
			color 0.2s,
			border-color 0.2s;
	}
	.nav:hover {
		background: var(--deep);
		color: var(--white);
		border-color: var(--deep);
	}
	.caption {
		text-align: center;
		max-width: 60ch;
		margin: 1.5rem auto 0;
		min-height: 7.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.tags b {
		color: var(--dot);
		font-weight: 500;
	}
	.caption h3 {
		font-family: var(--serif);
		font-size: clamp(1.8rem, 4vw, 2.8rem);
		line-height: 1.05;
		margin: 0.4rem 0 0.5rem;
		animation: up 0.5s var(--ease-out) both;
	}
	.caption h3 a {
		color: var(--deep);
	}
	.caption .role {
		animation: up 0.5s var(--ease-out) 60ms both;
	}
	@keyframes up {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
	.dotsnav {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-top: 1.3rem;
	}
	.dotsnav button {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: 1px solid var(--dot);
		background: transparent;
		transition:
			transform 0.3s var(--ease-out),
			background 0.2s;
	}
	.dotsnav button.on {
		background: var(--dot);
		transform: scale(1.35);
	}
	@media (max-width: 700px) {
		.car {
			grid-template-columns: 1fr;
		}
		.nav {
			display: none;
		}
		.slide {
			width: 84%;
		}
		.slide.l {
			transform: translateX(-50%) translateX(-70%) scale(0.7);
		}
		.slide.r {
			transform: translateX(-50%) translateX(70%) scale(0.7);
		}
		.stage {
			height: 58vw;
		}
		.cue {
			display: none;
		}
	}
</style>
