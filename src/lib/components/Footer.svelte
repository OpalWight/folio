<script lang="ts">
	import { onMount } from 'svelte';

	type Now = { isPlaying: boolean; title: string | null; artist?: string; url?: string | null };
	let now = $state<Now | null>(null);
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
			if (d.title) {
				const line = `${d.isPlaying ? 'Now playing' : 'Last played'} — ${d.title} · ${d.artist}`;
				if (line !== last) {
					last = line;
					scrambleTo(line);
				}
			}
		} catch {
			failures++;
			now = null;
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

<footer class="wrap">
	<div class="row">
		<a href="#top" class="mono up">Back to top ↑</a>
		<span class="mono">© 2026 Albert Vo</span>
	</div>
	<div class="row">
		<a class="mono" href="mailto:atrvo@ucdavis.edu">atrvo@ucdavis.edu</a>
		<a class="mono" href="https://github.com/OpalWight" target="_blank" rel="noopener">GitHub</a>
		<a class="mono" href="https://www.linkedin.com/in/albert-vo-0552372b1/" target="_blank" rel="noopener">LinkedIn</a>
	</div>
	{#if now?.title}
		<div class="row np">
			{#if now.isPlaying}
				<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
			{/if}
			{#if now.url}
				<a class="mono line" href={now.url} target="_blank" rel="noopener">{shown}</a>
			{:else}
				<span class="mono line">{shown}</span>
			{/if}
		</div>
	{/if}
</footer>

<style>
	footer {
		border-top: 1px solid var(--haze);
		margin-top: 5rem;
		padding-top: 1.8rem;
		padding-bottom: 2.4rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem 2rem;
		align-items: center;
	}
	.row {
		display: flex;
		gap: 1.4rem;
		flex-wrap: wrap;
		align-items: center;
	}
	.row:nth-child(2) {
		justify-content: flex-end;
	}
	footer a {
		color: var(--deep);
	}
	.np {
		grid-column: 1 / -1;
		padding-top: 1rem;
		border-top: 1px solid var(--haze);
	}
	.line {
		color: var(--dot);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}
	.eq {
		display: inline-flex;
		gap: 2px;
		align-items: flex-end;
		height: 10px;
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
			height: 3px;
		}
		50% {
			height: 10px;
		}
	}
	@media (max-width: 700px) {
		footer {
			grid-template-columns: 1fr;
		}
		.row:nth-child(2) {
			justify-content: flex-start;
		}
	}
</style>
