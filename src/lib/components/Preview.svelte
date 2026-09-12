<script lang="ts">
	import Wip from '$lib/components/Wip.svelte';
	import type { Project } from '$lib/projects';

	/**
	 * Project preview screen. Priority: live site (iframe) → recorded demo (video)
	 * → still image → WIP placeholder.
	 * `mode: 'hover'` only loads the live source once `active` turns true;
	 * `mode: 'always'` loads it on mount.
	 * `interactive` hands the pointer to the framed site once it is showing, so you can
	 * scroll and click around inside the preview instead of only looking at it.
	 */
	let {
		project,
		mode = 'hover',
		active = false,
		interactive = false
	}: {
		project: Project;
		mode?: 'hover' | 'always';
		active?: boolean;
		interactive?: boolean;
	} = $props();

	const source = $derived(project.live ? 'live' : project.demo ? 'demo' : 'none');
	const on = $derived(mode === 'always' || active);

	let armed = $state(false); // the iframe / video is only created once it is wanted
	let loaded = $state(false);
	let video = $state<HTMLVideoElement | undefined>(undefined);
	let w = $state(0);

	$effect(() => {
		if (on && source !== 'none') armed = true;
	});

	$effect(() => {
		if (!video) return;
		if (on) {
			video.play().catch(() => {});
		} else {
			video.pause();
			video.currentTime = 0;
		}
	});

	const showing = $derived(on && armed && loaded && source !== 'none');

	/**
	 * A frame a site refuses to serve (X-Frame-Options, or a CSP frame-ancestors list
	 * this origin is not on) still fires `load`, and its `contentDocument` reads null
	 * exactly like a healthy cross-origin frame — so there is no reliable way to tell
	 * the two apart from here. Instead of guessing, the still image stays put
	 * underneath at full opacity and the frame is layered over it: a site that loads
	 * paints across it, a refused one stays transparent and the still shows through.
	 */
</script>

<div class="preview" bind:clientWidth={w}>
	<div class="still">
		{#if project.image}
			<img src={project.image} alt="" loading="lazy" />
		{:else}
			<Wip seed={project.slug} options={{ cell: 3 }} />
		{/if}
	</div>

	{#if armed && source !== 'none'}
		<div class="media" class:in={showing} class:live={interactive && showing}>
			{#if source === 'live'}
				<iframe
					src={project.live}
					title="{project.title} — live site"
					loading="lazy"
					sandbox="allow-scripts allow-same-origin"
					style="transform: scale({w ? w / 1280 : 0.3})"
					onload={() => (loaded = true)}
				></iframe>
			{:else}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video
					bind:this={video}
					src={project.demo}
					muted
					loop
					playsinline
					preload="none"
					onloadeddata={() => (loaded = true)}
				></video>
			{/if}
		</div>
		{#if !loaded}
			<span class="progress" aria-hidden="true"></span>
		{/if}
	{/if}
</div>

<style>
	.preview {
		position: absolute;
		inset: 0;
		background: var(--white);
		overflow: hidden;
	}
	.still,
	.media {
		position: absolute;
		inset: 0;
		transition: opacity 0.5s var(--ease-out);
	}
	.still img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top center;
	}
	.media {
		opacity: 0;
		overflow: hidden;
		pointer-events: none;
	}
	/* the framed site takes the pointer once it is up, so you can scroll and click
	   around inside it. A site that refuses to be framed still fires `load`, so its
	   invisible frame takes the pointer too — the card's own links live in the text
	   column, where that cannot reach them. */
	.media.live {
		pointer-events: auto;
	}
	.media.in {
		opacity: 1;
	}
	.media iframe {
		width: 1280px;
		height: 832px;
		border: 0;
		transform-origin: top left;
	}
	.media video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	/* thin progress hairline while the preview loads */
	.progress {
		position: absolute;
		top: 0;
		left: 0;
		height: 2px;
		width: 100%;
		background: var(--dot);
		transform-origin: left;
		animation: load 1.6s var(--ease-out) infinite;
	}
	@keyframes load {
		0% {
			transform: scaleX(0.02);
			opacity: 1;
		}
		70% {
			transform: scaleX(0.9);
			opacity: 1;
		}
		100% {
			transform: scaleX(1);
			opacity: 0;
		}
	}
</style>
