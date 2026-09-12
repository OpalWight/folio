<script lang="ts">
	import { page } from '$app/state';
	import DotField from '$lib/components/DotField.svelte';
</script>

<svelte:head>
	<title>{page.status} — Albert Vo</title>
</svelte:head>

<section class="err">
	<div class="field">
		<DotField src="/lily.jpg" options={{ cell: 5, mask: [0.3, 0.5, 0.35, 0.3], focus: [0.7, 0.45] }} />
	</div>
	<div class="copy">
		<p class="mono">{page.status}</p>
		<h1>This page wandered off the field.</h1>
		<a href="/" class="mono">← Back to the portfolio</a>
	</div>
</section>

<style>
	.err {
		position: relative;
		min-height: 100svh;
		display: grid;
		place-items: center;
		overflow: hidden;
	}
	.field {
		position: absolute;
		inset: 0;
	}
	.copy {
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		padding: 0 var(--pad);
	}
	h1 {
		font-family: var(--serif);
		font-size: clamp(2rem, 6vw, 4.4rem);
		color: var(--deep);
		text-shadow:
			0 0 18px #fff,
			0 0 36px #fff;
	}
	a {
		color: var(--deep);
	}
</style>
