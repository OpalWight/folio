<script lang="ts">
	import Preview from '$lib/components/Preview.svelte';
	import type { Project } from '$lib/projects';
	import { onMount } from 'svelte';

	let { projects, showCaption = true }: { projects: Project[]; showCaption?: boolean } = $props();

	/**
	 * Endless strip. The list is laid out three times over and the carousel lives in
	 * the middle copy, so there is always a run of cards either side of the centre.
	 * Stepping off the middle copy is corrected once the slide has finished — the
	 * track jumps back by one list length with the transition switched off, which
	 * lands on an identical card and so cannot be seen.
	 */
	const n = $derived(projects.length);
	const COPIES = 3;
	const view = $derived(Array.from({ length: n * COPIES }, (_, k) => projects[k % n]));

	let idx = $state(0); // index into `view`
	let jump = $state(false); // the correction hop, done without a transition
	let hover = $state(false); // centre slide hovered / focused / tapped
	let over = $state(false); // pointer is on any slide — what surfaces the arrows

	const real = $derived(n ? ((idx % n) + n) % n : 0);

	/**
	 * Re-arm the transition after a correction hop. Two frames is the right signal,
	 * but a backgrounded tab gets no frames at all, so a short timer backs it up —
	 * otherwise the strip would be left permanently un-animated.
	 */
	function unjump() {
		const off = () => (jump = false);
		requestAnimationFrame(() => requestAnimationFrame(off));
		setTimeout(off, 90);
	}

	let sized = -1; // plain, not state: this must not re-run the effect
	$effect(() => {
		// start in the middle copy — only when the list itself appears or changes,
		// never in response to idx, which would cut a slide short mid-transition
		if (n && n !== sized) {
			sized = n;
			// take the starting position without animating there from the first copy
			jump = true;
			idx = n;
			unjump();
		}
	});

	// flat track: every slide the same size, the strip slides sideways
	let vw = $state(0);
	const gap = $derived(vw < 700 ? 14 : 28);
	// full-bleed strip: the centre slide keeps the reading column's proportions while
	// its neighbours run out to the window edges
	const slideW = $derived(vw ? Math.round(Math.min(vw * (vw < 700 ? 0.82 : 0.52), 720)) : 0);
	const step = $derived(slideW + gap);
	const shift = $derived(vw / 2 - idx * step - slideW / 2);

	function go(d: number) {
		idx += d;
		// if a run of steps landed outside the three copies — possible only when the
		// transitions were never running — snap back rather than walking off the end
		if (idx < 1 || idx > 3 * n - 2) {
			jump = true;
			idx = n + real;
			unjump();
		}
		hover = false;
	}

	/** Shortest way round to a given project. */
	function goTo(i: number) {
		let d = i - real;
		if (d > n / 2) d -= n;
		if (d < -n / 2) d += n;
		idx += d;
		hover = false;
	}

	/** Once a slide has settled, walk back to the middle copy without animating. */
	let trackEl: HTMLElement;
	function settle(e: TransitionEvent) {
		if (e.target !== trackEl || e.propertyName !== 'transform' || jump) return;
		if (idx >= n && idx < 2 * n) return;
		jump = true;
		idx = n + real;
		unjump();
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
		<div
			class="track"
			bind:this={trackEl}
			class:jump
			style="transform: translate3d({shift}px,0,0); gap: {gap}px"
			ontransitionend={settle}
		>
			{#each view as p, i (i)}
				<a
					class="slide"
					class:on={i === idx}
					style="width: {slideW}px"
					href={p.link}
					tabindex={i === idx ? 0 : -1}
					aria-hidden={i !== idx}
					onpointerenter={() => {
						hover = i === idx;
						over = true;
					}}
					onpointerleave={() => {
						hover = false;
						over = false;
					}}
					onfocusin={() => (hover = i === idx)}
					onfocusout={() => (hover = false)}
					onclick={(e) => {
						if (i !== idx) {
							e.preventDefault();
							idx = i;
						}
					}}
					data-slide={i}
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

	<div class="bar" class:on={over}>
		<button class="nav" onclick={() => go(-1)} aria-label="Previous project">←</button>
		<div class="dots" role="tablist" aria-label="Choose project">
			{#each projects as p, i}
				<button
					role="tab"
					aria-selected={i === real}
					aria-label={p.title}
					class:on={i === real}
					onclick={() => goTo(i)}
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
	/* the hop back to the middle copy must not animate, or it would be a visible rewind */
	.track.jump {
		transition: none;
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
		position: relative; /* Preview's layers are absolute; they need this to stay in the slide */
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
	/* the arrows are a hover affordance: they appear either side of the dots only while
	   a card is under the pointer, and stay for keyboard focus */
	.nav {
		font-family: var(--mono);
		font-size: 0.9rem;
		color: var(--mid);
		padding: 0.2rem 0.3rem;
		opacity: 0;
		transition:
			color 0.2s,
			opacity 0.35s var(--ease-out),
			transform 0.35s var(--ease-out);
	}
	.nav:first-child {
		transform: translateX(6px);
	}
	.nav:last-child {
		transform: translateX(-6px);
	}
	.bar.on .nav,
	.bar:hover .nav,
	.nav:focus-visible {
		opacity: 1;
		transform: none;
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
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--haze);
		transition:
			background 0.25s,
			transform 0.3s var(--ease-out);
	}
	.dots button:hover {
		background: var(--mid);
	}
	.dots button.on {
		background: var(--dot);
		transform: scale(1.35);
	}

	@media (max-width: 700px) {
		.bar {
			margin-top: 1.4rem;
		}
	}
</style>
