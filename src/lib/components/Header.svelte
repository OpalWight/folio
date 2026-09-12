<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	const links = [
		{ href: '/', label: 'home' },
		{ href: '/work', label: 'work' },
		{ href: '/about', label: 'about' }
	];

	let open = $state(false);

	function isActive(href: string) {
		const path = page.url.pathname;
		if (href === '/') return path === '/';
		if (href === '/work') return path.startsWith('/work') || path.startsWith('/projects');
		return path.startsWith(href);
	}

	function close() {
		open = false;
	}

	$effect(() => {
		document.body.classList.toggle('menu-open', open);
	});

	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<header class="hdr">
	<!-- desktop: glass pill with links -->
	<nav class="pill glass" aria-label="Primary">
		{#each links as l}
			<a href={l.href} class:on={isActive(l.href)} aria-current={isActive(l.href) ? 'page' : undefined}>{l.label}</a>
		{/each}
	</nav>

	<!-- mobile: glass button that becomes a close button -->
	<button
		class="burger glass"
		class:open
		aria-expanded={open}
		aria-controls="mobile-menu"
		aria-label={open ? 'Close menu' : 'Open menu'}
		onclick={() => (open = !open)}
	>
		<span></span><span></span><span></span>
	</button>
</header>

<div id="mobile-menu" class="sheet" class:open aria-hidden={!open}>
	<nav aria-label="Primary, mobile">
		{#each links as l, i}
			<a href={l.href} class:on={isActive(l.href)} style="--i:{i}" onclick={close} tabindex={open ? 0 : -1}>{l.label}</a>
		{/each}
	</nav>
	<p class="mono foot">Albert Vo · 2026</p>
</div>

<style>
	.hdr {
		position: fixed;
		top: 14px;
		left: 0;
		right: 0;
		z-index: 60;
		display: flex;
		justify-content: center;
		pointer-events: none;
		padding: 0 var(--pad);
	}

	/* liquid glass: blur + saturation, bright top edge, hairline outer edge, soft drop */
	.glass {
		pointer-events: auto;
		background: rgba(255, 255, 255, 0.5);
		-webkit-backdrop-filter: blur(22px) saturate(180%);
		backdrop-filter: blur(22px) saturate(180%);
		border: 1px solid rgba(16, 28, 110, 0.14);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.95),
			inset 0 -1px 0 rgba(16, 28, 110, 0.05),
			0 10px 30px -12px rgba(16, 28, 110, 0.35),
			0 1px 2px rgba(16, 28, 110, 0.08);
		position: relative;
		overflow: hidden;
	}
	.glass::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background: linear-gradient(115deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0) 65%, rgba(255, 255, 255, 0.45) 100%);
	}

	.pill {
		display: flex;
		align-items: center;
		gap: 0.15rem;
		padding: 0.3rem 0.4rem;
		border-radius: 999px;
	}
	.pill a {
		position: relative;
		z-index: 1;
		font-size: 0.84rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		color: var(--deep);
		padding: 0.5rem 1.05rem;
		border-radius: 999px;
		transition: background 0.2s, color 0.2s;
	}
	.pill a:hover {
		text-decoration: none;
		color: var(--dot);
		background: rgba(47, 69, 214, 0.07);
	}
	.pill a.on {
		background: var(--deep);
		color: var(--white);
	}

	.burger {
		display: none;
		width: 46px;
		height: 46px;
		border-radius: 999px;
		margin-left: auto;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 5px;
	}
	.burger span {
		position: relative;
		z-index: 1;
		display: block;
		width: 18px;
		height: 1.5px;
		background: var(--deep);
		transition: transform 0.35s var(--ease-out), opacity 0.2s;
	}
	.burger.open span:nth-child(1) {
		transform: translateY(6.5px) rotate(45deg);
	}
	.burger.open span:nth-child(2) {
		opacity: 0;
	}
	.burger.open span:nth-child(3) {
		transform: translateY(-6.5px) rotate(-45deg);
	}

	/* full-screen glass sheet */
	.sheet {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: none;
		flex-direction: column;
		justify-content: center;
		padding: 0 var(--pad);
		background: rgba(255, 255, 255, 0.72);
		-webkit-backdrop-filter: blur(28px) saturate(160%);
		backdrop-filter: blur(28px) saturate(160%);
		opacity: 0;
		transition: opacity 0.3s;
	}
	.sheet.open {
		opacity: 1;
	}
	.sheet nav {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.sheet a {
		font-family: var(--serif);
		font-size: clamp(2.8rem, 12vw, 4.4rem);
		line-height: 1.1;
		color: var(--deep);
		padding: 0.15em 0;
		border-bottom: 1px solid var(--haze);
		transform: translateY(14px);
		opacity: 0;
		transition:
			transform 0.5s var(--ease-out) calc(60ms * var(--i)),
			opacity 0.5s calc(60ms * var(--i));
	}
	.sheet.open a {
		transform: none;
		opacity: 1;
	}
	.sheet a.on {
		color: var(--dot);
		font-style: italic;
	}
	.sheet .foot {
		position: absolute;
		left: var(--pad);
		bottom: 28px;
	}

	@media (max-width: 700px) {
		.pill {
			display: none;
		}
		.burger,
		.sheet {
			display: flex;
		}
		.sheet {
			pointer-events: none;
		}
		.sheet.open {
			pointer-events: auto;
		}
	}
</style>
