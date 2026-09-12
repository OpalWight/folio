<script lang="ts">
	import { onMount } from 'svelte';
	import DotField from './DotField.svelte';

	const words = ['Researcher', 'Software Engineer', 'Data Scientist', 'Neurotech Engineer'];
	let i = $state(0);
	let out = $state(false);
	let loadIn = $state(true);
	let scrollY = $state(0);

	const article = $derived(/^[aeiou]/i.test(words[i]) ? 'an' : 'a');

	onMount(() => {
		// converge-from-noise only on the first visit this session
		try {
			loadIn = !sessionStorage.getItem('folio:seen');
			sessionStorage.setItem('folio:seen', '1');
		} catch {}

		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) return;
		const id = setInterval(() => {
			out = true;
			setTimeout(() => {
				i = (i + 1) % words.length;
				out = false;
			}, 420);
		}, 2800);
		return () => clearInterval(id);
	});
</script>

<svelte:window bind:scrollY />

<section class="hero" class:loadIn>
	<div class="field" style="transform: translateY({scrollY * 0.18}px)">
		<DotField
			src="/lily.jpg"
			label="A white lily rendered as blue dots that drift on their own and move away from the cursor"
			options={{ cell: 4.2, focus: [0.7, 0.45], mask: [0.2, 0.84, 0.4, 0.34], loadIn, cursorZone: true }}
		/>
	</div>

	<div class="copy" style="transform: translateY({scrollY * 0.32}px); opacity: {Math.max(0, 1 - scrollY / 520)}">
		<p class="pre">Hello</p>
		<h1>
			<span class="l1">Hi, I'm Albert,</span>
			<span class="l2"><span class="art">{article}</span> <em><span class:out>{words[i]}</span></em><span class="dot">.</span></span>
		</h1>
	</div>

</section>

<style>
	.hero {
		position: relative;
		height: 100vh;
		height: 100svh;
		min-height: 560px;
		overflow: hidden;
		background: var(--white);
	}
	.field {
		position: absolute;
		inset: 0;
		will-change: transform;
	}

	.copy {
		position: absolute;
		left: var(--pad);
		right: var(--pad);
		bottom: clamp(48px, 12vh, 120px);
		pointer-events: none;
		display: flex;
		flex-direction: column;
		gap: 0.9em;
		align-items: flex-start;
		will-change: transform, opacity;
	}
	.loadIn .copy {
		animation: rise 0.9s var(--ease-out) 0.5s both;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}

	.pre {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--mid);
		text-shadow:
			0 0 10px #fff,
			0 0 20px #fff;
	}
	h1 {
		font-family: var(--serif);
		font-size: clamp(2.5rem, 7.2vw, 6.2rem);
		line-height: 1.02;
		letter-spacing: -0.01em;
		color: var(--deep);
		display: flex;
		flex-direction: column;
		text-shadow:
			0 0 18px #fff,
			0 0 36px #fff,
			0 0 6px #fff;
	}
	.l1 {
		display: block;
	}
	.l2 {
		display: block;
		white-space: nowrap;
	}
	.art {
		color: var(--deep);
	}
	em {
		font-style: italic;
		color: var(--dot);
		display: inline-block;
	}
	em > span {
		display: inline-block;
		clip-path: inset(0 0 0 0);
		transition: clip-path 0.42s var(--ease-hard);
	}
	em > span.out {
		clip-path: inset(0 100% 0 0);
	}
	.dot {
		color: var(--dot);
	}


	@media (max-width: 700px) {
		.hero {
			min-height: 480px;
		}
		.copy {
			bottom: 56px;
		}
		h1 {
			font-size: clamp(2.2rem, 10.5vw, 3.4rem);
		}
		.l2 {
			white-space: normal;
		}
	}
</style>
