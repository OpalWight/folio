<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Transition from '$lib/components/Transition.svelte';
	import Cursor from '$lib/components/Cursor.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let { children } = $props();

	onMount(() => {
		// hairlines draw in as they enter the viewport
		const io = new IntersectionObserver(
			(es) =>
				es.forEach((e) => {
					if (e.isIntersecting) {
						e.target.classList.add('in');
						io.unobserve(e.target);
					}
				}),
			{ threshold: 0.2 }
		);
		const observe = () => document.querySelectorAll('.rule:not(.in)').forEach((r) => io.observe(r));
		observe();
		const mo = new MutationObserver(observe);
		mo.observe(document.body, { childList: true, subtree: true });
		return () => {
			io.disconnect();
			mo.disconnect();
		};
	});
</script>

<svelte:head>
	<link
		rel="icon"
		href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='9' fill='%232F45D6'/%3E%3C/svg%3E"
	/>
	<meta property="og:site_name" content="Albert Vo" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:image" content="{page.url.origin}/lily.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div id="top"></div>
<Cursor />
<Header />
<Transition />
<main>
	{@render children()}
</main>
<Footer />
