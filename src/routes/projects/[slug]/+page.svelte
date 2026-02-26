<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.project.title} | ALBERT VO</title>
</svelte:head>

<section class="project-header">
  <a href="/" class="back-link">&lt;- BACK TO HOME</a>
  <h1 class="project-title">{data.project.title}</h1>
  <p class="project-year">BUILT IN {data.project.year}</p>
</section>

<section class="project-details">
  <div class="grid grid-2">
    <div class="project-visual">
       <div class="project-image-placeholder">
          <div class="overlay"></div>
       </div>
    </div>
    <div class="project-info">
      <h2 class="section-header">DESCRIPTION</h2>
      <p class="project-description">{data.project.description}</p>
      
      <h2 class="section-header">TECHNOLOGIES</h2>
      <div class="project-tags">
        {#each data.project.tags as tag}
          <span>{tag}</span>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .project-header {
    padding-top: 2rem;
  }

  .back-link {
    display: inline-block;
    margin-bottom: 2rem;
    font-size: 0.8rem;
  }

  .project-title {
    font-size: clamp(2rem, 5vw, 4rem);
    margin-bottom: 0.5rem;
  }

  .project-year {
    font-size: 1.5rem;
    font-weight: 700;
    font-style: italic;
  }

  .project-image-placeholder {
    background-color: #ccc;
    position: relative;
    aspect-ratio: 16 / 9;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--accent-color);
    opacity: 0.3;
  }

  .project-description {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .section-header {
    font-size: 1rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .project-tags span {
    background-color: var(--text-color);
    color: var(--bg-color);
    padding: 0.2rem 0.5rem;
  }

  @media (max-width: 767px) {
    .project-info {
      margin-top: 2rem;
    }
  }
</style>
