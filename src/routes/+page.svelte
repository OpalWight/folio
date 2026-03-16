<script lang="ts">
  import { onMount } from "svelte";
  import { projects } from "$lib/projects";

  let spotifyData = $state({
    title: "LOADING...",
    artist: "SPOTIFY",
    isPlaying: false,
    progress_ms: 0,
    duration_ms: 0,
  });

  let displayTitle = $state("LOADING...");
  let lastTitle = "";

  $effect(() => {
    const newTitle = spotifyData.title;
    if (newTitle && newTitle !== lastTitle) {
      lastTitle = newTitle;
      animateSlotMachine(newTitle);
    }
  });

  function animateSlotMachine(target: string) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";
    const len = target.length;
    let resolved = 0;

    const interval = setInterval(() => {
      let result = "";
      for (let i = 0; i < len; i++) {
        if (i < resolved) {
          result += target[i];
        } else if (target[i] === " ") {
          result += " ";
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      displayTitle = result;

      resolved++;
      if (resolved > len) {
        clearInterval(interval);
        displayTitle = target;
      }
    }, 80);
  }

  onMount(async () => {
    async function updateSpotify() {
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.title) {
          spotifyData = data;
        }
      } catch (e) {
        spotifyData = {
          title: "OFFLINE",
          artist: "---",
          isPlaying: false,
          progress_ms: 0,
          duration_ms: 0,
        };
      }
    }

    updateSpotify();

    const syncInterval = setInterval(updateSpotify, 10000);

    const tickerInterval = setInterval(() => {
      if (
        spotifyData.isPlaying &&
        spotifyData.progress_ms < spotifyData.duration_ms
      ) {
        spotifyData.progress_ms += 1000;
      }
    }, 1000);

    return () => {
      clearInterval(syncInterval);
      clearInterval(tickerInterval);
    };
  });

  function formatTime(ms: number) {
    if (!ms) return "00:00";
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function getProgressBar(progress: number, duration: number, width: number) {
    if (!duration) return "-".repeat(width);
    const percent = Math.min(progress / duration, 1);
    const filled = Math.round(width * percent);
    return "\u2588".repeat(filled) + "-".repeat(width - filled);
  }
</script>

<svelte:head>
  <title>ALBERT VO | END TO END SOLUTIONS</title>
</svelte:head>

<section class="masthead">
  <div class="masthead-layout">
    <div class="masthead-left">
      <h1>ALBERT VO</h1>
      <div class="masthead-meta">
        <p>EST. 2006</p>
        <p>SAN JOSE, CA</p>
        <p class="status">CURRENT STATUS: <strong>AVAILABLE</strong></p>
      </div>
    </div>
    <div class="masthead-right">
      <div class="spotify-display">
        <p class="spotify-label">{spotifyData.isPlaying ? "WHAT I'M LISTENING TO:" : "LAST PLAYED:"}</p>
        <p class="spotify-title">{displayTitle}</p>
        <p class="spotify-artist">{spotifyData.artist}</p>
        <p class="spotify-bar">{getProgressBar(spotifyData.progress_ms, spotifyData.duration_ms, 20)}</p>
        <p class="spotify-time">
          <span>{formatTime(spotifyData.progress_ms)}</span>
          <span>{formatTime(spotifyData.duration_ms)}</span>
        </p>
      </div>
    </div>
  </div>
</section>


<section class="about">
  <h2 class="section-header">ABOUT ME</h2>

  <p>
    <strong>I am a software engineer specializing in architecting systems from the
    metal to the browser.</strong>
  </p>

  <p>
    A pre-med student turned software engineer, I bridge the gap between
    clinical empathy and technical complexity. I'm dedicated to end-to-end
    ownership and building robust, scalable systems that prioritize
    human-centric impact.
  </p>
</section>

<section class="projects">
  <h2 class="section-header">FEATURED PROJECTS</h2>

  <div class="project-grid">
    {#each projects as project}
      <a href={project.link} class="project-item">
        <div class="project-image-placeholder">
          {#if project.image}
            <img src={project.image} alt={project.title} class="project-image" />
          {/if}
          <div class="overlay"></div>
        </div>

        <div class="project-content">
          <h3>{project.title}</h3>
          <p class="project-year">(built in {project.year})</p>
        </div>
      </a>
    {/each}
  </div>
</section>

<section class="hobbies">
  <h2 class="section-header">OFF THE CLOCK</h2>

  <div class="hobby-item">
    <h3 class="hobby-title">GUITAR</h3>
    <p>
      still very much a noob, but I enjoy learning to play and sing along to
      wtv song I'm listening to at the time!
    </p>
  </div>

  <div class="hobby-item">
    <h3 class="hobby-title">OVERWATCH</h3>
    <p>Tracer main. Need a duo, hmu @opalwight on steam.</p>
  </div>
</section>

<section class="footer">
  <div class="grid grid-2">
    <div>
      <p>&copy; 2026 ALBERT VO</p>
    </div>
    <div class="footer-links">
      <a href="https://github.com/OpalWight">GITHUB</a>
      <a href="https://www.linkedin.com/in/albert-vo-0552372b1/">LINKEDIN</a>
      <a href="mailto:atrvo@ucdavis.edu">CONTACT</a>
    </div>
  </div>
</section>

<style>
  .masthead {
    border-top: 3px solid black;
    padding: 0.25rem 0 0;
    margin-top: 0;
  }

  .masthead-layout {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
  }

  .masthead-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .masthead-left h1 {
    font-size: 2.5rem;
    line-height: 1.1;
    white-space: nowrap;
  }

  .masthead-meta {
    margin-top: 1rem;
    font-weight: 700;
    font-size: 0.75rem;
  }

  .masthead-meta .status {
    margin-top: 0.5rem;
  }

  .masthead-right {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    flex-shrink: 0;
    align-self: center;
  }

  .spotify-display {
    font-size: 0.75rem;
  }

  .spotify-label {
    color: #888;
    margin-bottom: 0.15rem;
  }

  .spotify-title {
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .spotify-artist {
    color: #555;
  }

  .spotify-bar {
    letter-spacing: -0.05em;
    margin-top: 0.25rem;
  }

  .spotify-time {
    display: flex;
    justify-content: space-between;
    color: #888;
    font-size: 0.65rem;
  }

.section-header {
    margin-bottom: 1rem;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
    gap: 1rem;
  }

  .project-item {
    display: flex;
    flex-direction: column;
    background: var(--container-bg);
    text-decoration: none;
    color: inherit;
  }

  .project-content {
    padding: 0.45rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex-grow: 1;
    text-align: left;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  .project-item:hover .project-content {
    background-color: var(--accent-color);
    color: white;
  }

  .project-item:hover h3,
  .project-item:hover .project-year {
    color: white;
  }

  .project-content h3 {
    font-size: 0.7rem;
    margin: 0;
  }

  .project-year {
    font-size: 0.6rem;
    margin-top: 0.15rem;
    color: #888;
  }

  .project-image-placeholder {
    background-color: #ccc;
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  .project-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }

  .about p {
    margin-top: 1rem;
  }

  .hobby-item {
    margin-top: 1.5rem;
  }

  .hobby-title {
    margin-bottom: 0.25rem;
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

  .footer-links {
    display: flex;
    gap: 2rem;
    justify-content: flex-end;
  }

  @media (max-width: 767px) {
    .masthead-layout {
      flex-direction: column;
      gap: 1.5rem;
    }

    .masthead-right {
      text-align: left;
      align-self: flex-start;
    }

    .spotify-time {
      justify-content: flex-start;
      gap: 2rem;
    }

    .footer-links {
      text-align: left;
      justify-content: flex-start;
      margin-top: 2rem;
    }

    .project-item {
      grid-template-columns: 1fr;
    }

    .project-image-placeholder {
      order: -1;
    }
  }
</style>
