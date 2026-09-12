<script lang="ts">
	import { reveal } from '$lib/reveal';
</script>

<section class="wrap intro" use:reveal data-stagger-group>
	<div class="sec" data-stagger>
		<h2>Intro</h2>
		<a class="right story" href="/about">Read my story →</a>
	</div>
	<div class="rule"></div>

	<div class="cols">
		<p class="big" data-stagger>I build software that connects people.</p>
		<div class="text" data-stagger>
			<p>
				A pre-med student turned engineer, I work where clinical empathy meets technical complexity:
				brain–computer interfaces, biology-adjacent machine learning, and the plain, reliable software that
				keeps a team moving.
			</p>
			<p>
				I like end-to-end ownership. Sensor to model to interface, and the infrastructure underneath it.
			</p>
			<dl class="facts">
				<div><dt class="label">Studying</dt><dd>UC Davis</dd></div>
				<div><dt class="label">Based in</dt><dd>San Jose, CA</dd></div>
				<div><dt class="label">Status</dt><dd><span class="pulse"></span>Open to work</dd></div>
			</dl>
		</div>
	</div>
</section>

<style>
	.intro {
		padding-top: 5.5rem;
	}
	.story {
		color: var(--dot);
	}
	.cols {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 2.5rem 4rem;
		margin-top: 2.2rem;
		align-items: start;
	}
	.big {
		font-family: var(--serif);
		font-size: clamp(2rem, 4.2vw, 3.4rem);
		line-height: 1.05;
		letter-spacing: -0.01em;
		color: var(--deep);
		max-width: 14ch;
	}
	.text {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		color: var(--text);
		max-width: 56ch;
	}
	.facts {
		display: grid;
		grid-template-columns: repeat(3, auto);
		gap: 1.6rem;
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
		.cols {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 700px) {
		.intro {
			padding-top: 3.6rem;
		}
		.facts {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
