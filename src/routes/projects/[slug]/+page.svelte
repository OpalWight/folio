<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.project.title} | ALBERT VO</title>
</svelte:head>

<section class="project-nav">
  <a href="/" class="back-link">&lt;- BACK TO HOME</a>
</section>

<section class="project-hero">
  <h1 class="section-header">{data.project.title}</h1>
  <p>BUILT IN {data.project.year}</p>

  <div class="project-tags">
    {#each data.project.tags as tag}
      <span class="tag">{tag}</span>
    {/each}
  </div>
</section>

<section class="project-about">
  <h2 class="section-header">ABOUT</h2>
  <p>{data.project.description}</p>
</section>

<section class="project-demo">
  <h2 class="section-header">DEMO</h2>
  <div class="video-placeholder">
    <div class="video-overlay">
      <span class="play-icon">&#9654;</span>
      <span class="play-text">DEMO VIDEO</span>
    </div>
  </div>
</section>

<section class="project-links">
  <h2 class="section-header">LINKS</h2>
  <a href={data.project.github} target="_blank" rel="noopener noreferrer" class="action-btn">
    VIEW ON GITHUB &rarr;
  </a>
</section>

<style>
  .project-nav {
    border-top: 3px solid black;
  }

  .back-link {
    transition: letter-spacing 0.2s ease;
  }

  .back-link:hover {
    letter-spacing: 0.05em;
  }

  .section-header {
    margin-bottom: 1rem;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .tag {
    background-color: var(--text-color);
    color: var(--bg-color);
    padding: 0.15rem 0.5rem;
    font-weight: 700;
  }

  .video-placeholder {
    width: 100%;
    aspect-ratio: 16 / 9;
    background-color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--text-color);
  }

  .video-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    color: #666;
    user-select: none;
  }

  .play-icon {
    font-size: 2rem;
    opacity: 0.6;
  }

  .play-text {
    font-weight: 700;
    letter-spacing: 0.1em;
    opacity: 0.6;
  }

  .action-btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    font-weight: 700;
    text-decoration: none;
    background-color: var(--text-color);
    color: var(--bg-color);
    border: 1px solid var(--text-color);
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .action-btn:hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: white;
    text-decoration: none;
  }

  @media (max-width: 767px) {
    .project-hero h1 {
      word-break: break-word;
    }
  }
</style>
