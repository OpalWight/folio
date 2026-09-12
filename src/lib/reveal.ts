/**
 * `use:reveal` — rises an element in (12px, opacity) the first time it enters the viewport.
 * Children with [data-stagger] come in one after another.
 */
export function reveal(node: HTMLElement, opts: { delay?: number; y?: number } = {}) {
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduce) return;

	const targets: HTMLElement[] = node.hasAttribute('data-stagger-group')
		? (Array.from(node.querySelectorAll('[data-stagger]')) as HTMLElement[])
		: [node];

	targets.forEach((t, i) => {
		t.style.opacity = '0';
		t.style.transform = `translateY(${opts.y ?? 14}px)`;
		t.style.transition = `opacity .8s cubic-bezier(.2,.8,.2,1) ${(opts.delay ?? 0) + i * 90}ms, transform .8s cubic-bezier(.2,.8,.2,1) ${(opts.delay ?? 0) + i * 90}ms`;
	});

	const io = new IntersectionObserver(
		(entries) => {
			if (!entries[0].isIntersecting) return;
			targets.forEach((t) => {
				t.style.opacity = '1';
				t.style.transform = 'none';
			});
			io.disconnect();
		},
		{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
	);
	io.observe(node);

	// safety net: never leave content hidden if the observer never fires (hidden tab, odd embeds)
	const show = () => {
		targets.forEach((t) => {
			t.style.opacity = '1';
			t.style.transform = 'none';
		});
		io.disconnect();
	};
	const fallback = window.setTimeout(show, 3500);

	return {
		destroy() {
			clearTimeout(fallback);
			io.disconnect();
		}
	};
}
