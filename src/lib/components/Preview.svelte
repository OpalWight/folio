<script lang="ts">
	import Wip from '$lib/components/Wip.svelte';
	import type { Project } from '$lib/projects';

	/**
	 * Project preview screen. Priority: live site (iframe) → recorded demo (video)
	 * → still image → WIP placeholder.
	 * `mode: 'hover'` only loads the live source once `active` turns true;
	 * `mode: 'always'` loads it on mount.
	 */
	let {
		project,
		mode = 'hover',
		active = false
	}: { project: Project; mode?: 'hover' | 'always'; active?: boolean } = $props();

	const source = $derived(project.live ? 'live' : project.demo ? 'demo' : 'none');
	const on = $derived(mode === 'always' || active);

	let armed = $state(false); // the iframe / video is only created once it is wanted
	let loaded = $state(false);
	let blocked = $state(false); // the site refused to be framed (X-Frame-Options / CSP)
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

	const showing = $derived(on && armed && loaded && !blocked && source !== 'none');

	/**
	 * A frame refused by X-Frame-Options still fires `load`, but leaves an empty
	 * same-origin document behind. Detect that and keep the still image rather than
	 * cross-fading to a blank screen.
	 */
	function onFrameLoad(e: Event) {
		const f = e.currentTarget as HTMLIFrameElement;
		try {
			const d = f.contentDocument;
			if (d && d.body && d.body.childElementCount === 0 && !d.body.textContent?.trim()) blocked = true;
		} catch {
			// cross-origin: it rendered, which is what we want
		}
		loaded = true;
	}
</script>

<div class="preview" bind:clientWidth={w}>
	<div class="still" class:out={showing}>
		{#if project.image}
			<img src={project.image} alt="" loading="lazy" />
		{:else}
			<Wip options={{ cell: 3 }} />
		{/if}
	</div>

	{#if armed && source !== 'none'}
		<div class="media" class:in={showing}>
			{#if source === 'live'}
				<iframe
					src={project.live}
					title="{project.title} — live site"
					loading="lazy"
					sandbox="allow-scripts allow-same-origin"
					style="transform: scale({w ? w / 1280 : 0.3})"
					onload={onFrameLoad}
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
		{#if !loaded && !blocked}
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
	.still.out {
		opacity: 0;
	}
	.media {
		opacity: 0;
		background: var(--white);
		overflow: hidden;
		pointer-events: none;
	}
	.media.in {
		opacity: 1;
	}
	.media iframe {
		width: 1280px;
		height: 800px;
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
