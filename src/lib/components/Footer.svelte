<footer class="wrap">
	<div class="row">
		<a href="#top" class="mono up">Back to top ↑</a>
		<span class="mono">© 2026 Albert Vo</span>
	</div>
	<div class="row end">
		<a class="mono" href="mailto:atrvo@ucdavis.edu">atrvo@ucdavis.edu</a>
		<a class="mono" href="https://github.com/OpalWight" target="_blank" rel="noopener">GitHub</a>
		<a class="mono" href="https://www.linkedin.com/in/albert-vo-0552372b1/" target="_blank" rel="noopener">LinkedIn</a>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--haze);
		margin-top: 5rem;
		padding-top: 1.8rem;
		padding-bottom: 2.4rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem 2rem;
	}
	.row {
		display: flex;
		gap: 1.4rem;
		flex-wrap: wrap;
		align-items: center;
	}
	.end {
		justify-content: flex-end;
	}
	footer a {
		color: var(--deep);
	}
	@media (max-width: 700px) {
		footer {
			flex-direction: column;
			align-items: flex-start;
		}
		.end {
			justify-content: flex-start;
		}
	}
</style>
