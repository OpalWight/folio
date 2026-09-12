<script lang="ts">
	/**
	 * First-visit intro: the name sets itself letter by letter in blue on white with a
	 * single quiet line under it, a hairline fills, then the curtain lifts into the hero.
	 * Deliberately small — a title card, not a splash screen.
	 *
	 * Driven entirely by CSS keyframes so it still clears itself without JS. A tiny
	 * inline script in app.html stamps `no-intro` on <html> for repeat visits in the
	 * same session, which keeps this from flashing on every navigation.
	 */
	const name = 'Albert Vo';
	const letters = name.split('');
</script>

<div class="intro" aria-hidden="true">
	<div class="inner">
		<h1 class="name">
			{#each letters as ch, i}
				{#if ch === ' '}
					<span class="sp">&nbsp;</span>
				{:else}
					<span class="ch" style="--i:{i}">{ch}</span>
				{/if}
			{/each}
		</h1>
		<p class="meta">Engineering Portfolio</p>
	</div>
	<span class="bar"></span>
</div>

<style>
	.intro {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: grid;
		place-items: center;
		background: var(--white);
		animation: curtain 0.7s var(--ease-out) 1.95s forwards;
	}
	@keyframes curtain {
		to {
			opacity: 0;
			transform: translateY(-1.5%);
			visibility: hidden;
			pointer-events: none;
		}
	}

	.inner {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0 var(--pad);
	}

	.name {
		font-family: var(--serif);
		font-size: clamp(1.9rem, 4.4vw, 3.1rem);
		line-height: 1.05;
		letter-spacing: 0.005em;
		color: var(--dot);
		display: flex;
		white-space: pre;
	}
	.ch {
		display: inline-block;
		transform: translateY(0.42em);
		opacity: 0;
		animation: rise 0.72s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: calc(52ms * var(--i));
	}
	.sp {
		display: inline-block;
	}
	@keyframes rise {
		to {
			transform: none;
			opacity: 1;
		}
	}

	.meta {
		font-family: var(--sans);
		font-weight: 400;
		font-size: clamp(0.78rem, 1.5vw, 0.92rem);
		letter-spacing: 0.16em;
		color: var(--mid);
		opacity: 0;
		animation: fade 0.6s ease forwards 0.8s;
	}
	@keyframes fade {
		to {
			opacity: 1;
		}
	}

	/* hairline that fills while the name sets */
	.bar {
		position: absolute;
		left: var(--pad);
		right: var(--pad);
		bottom: 42px;
		height: 1px;
		background: var(--haze);
		transform: scaleX(0);
		transform-origin: left;
		animation: fill 1.75s cubic-bezier(0.6, 0, 0.2, 1) forwards;
	}
	.bar::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--dot);
	}
	@keyframes fill {
		to {
			transform: scaleX(1);
		}
	}

	/* repeat visits in the session, and anyone who asked for less motion, skip it */
	:global(html.no-intro) .intro,
	:global(html.no-intro) .bar {
		display: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.intro {
			display: none;
		}
	}
</style>
