<script lang="ts">
	import { projects } from '$lib/projects';
	import Catalogue from '$lib/components/Catalogue.svelte';
	import { reveal } from '$lib/reveal';
</script>

<svelte:head>
	<title>Work — Albert Vo</title>
	<meta name="description" content="Everything Albert Vo has built: BCI tooling, RNA research, CareFlow, club internals, rover, EEG glasses, homelab and more." />
</svelte:head>

<section class="wrap pg">
	<div class="sec" use:reveal>
		<h2>Work</h2>
	</div>
	<div class="rule"></div>

	<div class="cat-wrap">
		<Catalogue {projects} />
	</div>
</section>

<style>
	.pg {
		padding-top: calc(var(--header-h) + 56px);
		padding-bottom: 6rem;
	}
	.cat-wrap {
		margin-top: clamp(2.6rem, 5vw, 4.5rem);
	}
</style>
