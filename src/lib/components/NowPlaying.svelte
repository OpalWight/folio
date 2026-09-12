<script lang="ts">
	import { onMount } from 'svelte';

	type Now = { isPlaying: boolean; title: string | null; artist?: string; url?: string | null };

	/** `lg` is the About-page feature size; `sm` is for tighter spots. */
	let { size = 'lg' }: { size?: 'lg' | 'sm' } = $props();

	let now = $state<Now | null>(null);
	let ready = $state(false);
	let shown = $state('');
	let timer: ReturnType<typeof setInterval> | undefined;

	const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—';

	function scrambleTo(target: string) {
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) {
			shown = target;
			return;
		}
		if (timer) clearInterval(timer);
		let res = 0;
		timer = setInterval(() => {
			let out = '';
			for (let k = 0; k < target.length; k++) {
				out += k < res || target[k] === ' ' ? target[k] : CH[Math.floor(Math.random() * CH.length)];
			}
			shown = out;
			if (++res > target.length) {
				clearInterval(timer);
				shown = target;
			}
		}, 26);
	}

	let last = '';
	let failures = 0;
	async function refresh() {
		// back off after repeated failures (e.g. a revoked token) instead of hammering the API
		if (failures >= 2 && Date.now() % 120000 > 15000) return;
		try {
			const r = await fetch('/api/spotify');
			if (!r.ok) throw new Error(String(r.status));
			failures = 0;
			const d: Now = await r.json();
			now = d;
			if (d.title && d.title !== last) {
				last = d.title;
				scrambleTo(d.title);
			}
		} catch {
			failures++;
			now = null;
		} finally {
			ready = true;
		}
	}

	onMount(() => {
		refresh();
		const id = setInterval(refresh, 15000);
		return () => {
			clearInterval(id);
			if (timer) clearInterval(timer);
		};
	});
</script>

<div class="np" class:sm={size === 'sm'}>
	{#if now?.title}
		<p class="mono status">
			{#if now.isPlaying}
				<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
			{/if}
			<span>{now.isPlaying ? 'Now playing' : 'Last played'}</span>
		</p>
		{#if now.url}
			<a class="track" href={now.url} target="_blank" rel="noopener">{shown}</a>
		{:else}
			<span class="track">{shown}</span>
		{/if}
		{#if now.artist}
			<p class="artist">{now.artist}</p>
		{/if}
	{:else if ready}
		<p class="mono status"><span>Feed offline</span></p>
		<p class="quiet">
			Spotify is not answering at the moment. It usually comes back on its own — check again in a minute.
		</p>
	{:else}
		<p class="mono status"><span>Checking Spotify</span></p>
	{/if}
</div>

<style>
	.np {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.55rem;
	}
	.status {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		color: var(--mid);
	}
	.track {
		font-family: var(--serif);
		font-size: clamp(2.1rem, 5.6vw, 3.6rem);
		line-height: 1.02;
		letter-spacing: -0.01em;
		color: var(--deep);
		overflow-wrap: break-word;
		max-width: 20ch;
		text-decoration: none;
		transition: color 0.4s var(--ease-out);
	}
	a.track:hover {
		color: var(--dot);
		text-decoration: underline;
		text-underline-offset: 6px;
		text-decoration-thickness: 1px;
	}
	.artist {
		font-size: 0.95rem;
		color: var(--text);
	}
	.quiet {
		font-size: 0.9rem;
		color: var(--mid);
		max-width: 46ch;
	}
	.np.sm .track {
		font-size: clamp(1.3rem, 3vw, 1.8rem);
	}
	.np.sm .artist {
		font-size: 0.85rem;
	}

	.eq {
		display: inline-flex;
		gap: 2px;
		align-items: flex-end;
		height: 12px;
	}
	.eq i {
		width: 2px;
		background: var(--dot);
		animation: eq 1s ease-in-out infinite;
	}
	.eq i:nth-child(2) {
		animation-delay: 0.2s;
	}
	.eq i:nth-child(3) {
		animation-delay: 0.4s;
	}
	@keyframes eq {
		0%,
		100% {
			height: 4px;
		}
		50% {
			height: 12px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.eq i {
			animation: none;
			height: 8px;
		}
		.track {
			transition: none;
		}
	}
</style>
