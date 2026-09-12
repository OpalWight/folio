<script lang="ts">
	import { reveal } from '$lib/reveal';

	const hobbies = [
		{ name: 'Guitar', note: 'Still very much a noob. I learn whatever I am listening to that week and sing along.' },
		{ name: 'Overwatch', note: 'Tracer main. Need a duo? @opalwight on Steam.' },
		{ name: 'Homelab', note: 'A k3s cluster in the closet that streams media and trains small models.' },
		{ name: 'Music', note: 'What I am playing right now is in the footer, live from Spotify.' }
	];
</script>

<section class="wrap hob" use:reveal data-stagger-group>
	<div class="sec" data-stagger>
		<h2>Off the clock</h2>
	</div>
	<div class="rule"></div>

	<div class="list">
		{#each hobbies as h}
			<div class="row" data-stagger>
				<h3>{h.name}</h3>
				<p>{h.note}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.hob {
		padding-top: 5.5rem;
	}
	.list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 4rem;
		margin-top: 1.4rem;
	}
	.row {
		padding: 1.6rem 0;
		border-bottom: 1px solid var(--haze);
	}
	h3 {
		font-family: var(--serif);
		font-size: clamp(1.6rem, 3vw, 2.3rem);
		line-height: 1;
		color: var(--deep);
		transition: transform 0.5s var(--ease-out);
	}
	.row:hover h3 {
		transform: translateX(6px);
	}
	p {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		color: var(--text);
		max-width: 46ch;
	}
	@media (max-width: 700px) {
		.hob {
			padding-top: 3.6rem;
		}
		.list {
			grid-template-columns: 1fr;
		}
	}
</style>
