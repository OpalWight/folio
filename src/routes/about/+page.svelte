<script lang="ts">
	import Hobbies from '$lib/components/Hobbies.svelte';
	import NowPlaying from '$lib/components/NowPlaying.svelte';
	import Wip from '$lib/components/Wip.svelte';
	import { reveal } from '$lib/reveal';
</script>

<svelte:head>
	<title>About — Albert Vo</title>
	<meta name="description" content="Albert Vo's story: pre-med turned engineer, BCI and biology-adjacent ML at UC Davis, based in San Jose." />
</svelte:head>

<section class="wrap ab">
	<div class="sec" use:reveal>
		<h2>About</h2>
		<span class="right">San Jose · UC Davis · open to work</span>
	</div>
	<div class="rule"></div>

	<div class="story" use:reveal data-stagger-group>
		<div class="portrait" data-stagger>
			<Wip options={{ cell: 3.6, push: 90 }} />
		</div>
		<div class="text">
			<p class="label" data-stagger>My story</p>
			<p class="big" data-stagger>I started in medicine and ended up building the instruments.</p>
			<p data-stagger>
				I came to UC Davis pre-med. Somewhere between organic chemistry and a neurotech club meeting I realised
				the part of medicine I cared about was the signal: what the body is saying, how you read it, and what
				you can do once you can.
			</p>
			<p data-stagger>
				So I switched to building. Brain–computer interfaces at Efferent Systems and Neurotech at Davis,
				RNA structure models in the Computational RNA Biology & Medicine Lab, and the plain, dependable
				software that keeps a team moving, like CareFlow and the club's internal platform.
			</p>
			<p data-stagger>
				I like owning things end to end: sensor to model to interface, and the infrastructure underneath.
				When something breaks at 2 a.m., I would rather it be my cluster in the closet than someone else's.
			</p>
			<dl class="facts" data-stagger>
				<div><dt class="label">Studying</dt><dd>UC Davis</dd></div>
				<div><dt class="label">Based in</dt><dd>San Jose, CA</dd></div>
				<div><dt class="label">Status</dt><dd><span class="pulse"></span>Open to work</dd></div>
				<div><dt class="label">Contact</dt><dd><a href="mailto:atrvo@ucdavis.edu">atrvo@ucdavis.edu</a></dd></div>
			</dl>
		</div>
	</div>
</section>

<section class="wrap music" use:reveal data-stagger-group>
	<div class="sec" data-stagger>
		<h2>Music</h2>
		<span class="right">Live from Spotify</span>
	</div>
	<div class="rule"></div>

	<div class="np" data-stagger>
		<p class="label">What I'm listening to</p>
		<NowPlaying />
	</div>
</section>

<Hobbies />

<style>
	.ab {
		padding-top: calc(var(--header-h) + 56px);
	}
	.story {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: 2.5rem 4rem;
		margin-top: 2.2rem;
		align-items: start;
	}
	.portrait {
		position: relative;
		aspect-ratio: 4 / 5;
		border: 1px solid var(--haze);
		overflow: hidden;
		background: var(--mist);
	}
	.text {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		color: var(--text);
		max-width: 58ch;
	}
	.big {
		font-family: var(--serif);
		font-size: clamp(1.8rem, 3.6vw, 2.9rem);
		line-height: 1.08;
		color: var(--deep);
		margin-bottom: 0.4rem;
	}
	.music {
		padding-top: 5.5rem;
	}
	.np {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		margin-top: 1.8rem;
	}
	.facts {
		display: grid;
		grid-template-columns: repeat(2, auto);
		gap: 1.2rem 2rem;
		margin: 1rem 0 0;
		padding-top: 1.2rem;
		border-top: 1px solid var(--haze);
	}
	dt {
		margin-bottom: 0.2rem;
	}
	dd {
		margin: 0;
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--deep);
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}
	dd a {
		color: var(--deep);
	}
	.pulse {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--dot);
		box-shadow: 0 0 0 0 rgba(47, 69, 214, 0.35);
		animation: pulse 2.2s ease-out infinite;
	}
	@keyframes pulse {
		to {
			box-shadow: 0 0 0 9px rgba(47, 69, 214, 0);
		}
	}
	@media (max-width: 860px) {
		.story {
			grid-template-columns: 1fr;
		}
		.portrait {
			aspect-ratio: 16 / 10;
		}
	}
	@media (max-width: 700px) {
		.music {
			padding-top: 3.6rem;
		}
		.np {
			margin-top: 1.4rem;
		}
	}
</style>
