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

  onMount(async () => {
    async function updateSpotify() {
      try {
        const res = await fetch("/api/spotify");
        const data = await res.json();
        if (data.title) {
          spotifyData = data;
        }
      } catch (e) {
        spotifyData = {
          title: "OFFLINE",
          artist: "IPOD",
          isPlaying: false,
          progress_ms: 0,
          duration_ms: 0,
        };
      }
    }

    updateSpotify();

    // Sync with Spotify every 10 seconds
    const syncInterval = setInterval(updateSpotify, 10000);

    // Local ticker to update the time every second
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

  function getVisualWidth(str: string) {
    let width = 0;
    for (const char of str) {
      const code = char.charCodeAt(0);
      // More comprehensive CJK and full-width ranges
      if (
        (code >= 0x1100 && code <= 0x115f) || // Hangul Jamo
        (code >= 0x2e80 && code <= 0xa4cf && code !== 0x303f) || // CJK Radicals Supplement .. CJK Compatibility Ideographs
        (code >= 0xac00 && code <= 0xd7a3) || // Hangul Syllables
        (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
        (code >= 0xfe10 && code <= 0xfe19) || // Vertical forms
        (code >= 0xfe30 && code <= 0xfe6f) || // CJK Compatibility Forms
        (code >= 0xff00 && code <= 0xff60) || // Fullwidth Forms
        (code >= 0xffe0 && code <= 0xffe6) || // Fullwidth Forms
        (code >= 0x20000 && code <= 0x2fffd) || // CJK Unified Ideographs Extension B-D
        (code >= 0x30000 && code <= 0x3fffd) // CJK Unified Ideographs Extension E-F
      ) {
        width += 2;
      } else {
        width += 1;
      }
    }
    return width;
  }

  function truncate(str: string, len: number) {
    if (!str) return " ".repeat(len);

    const totalWidth = getVisualWidth(str);
    if (totalWidth <= len) {
      return str + " ".repeat(len - totalWidth);
    }

    let result = "";
    let currentWidth = 0;
    const limit = len - 3;

    for (const char of str) {
      const charWidth = getVisualWidth(char);
      if (currentWidth + charWidth > limit) {
        break;
      }
      result += char;
      currentWidth += charWidth;
    }

    result += "...";
    currentWidth += 3;

    return result + " ".repeat(Math.max(0, len - currentWidth));
  }

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
    return "#".repeat(filled) + "-".repeat(width - filled);
  }

  function getPlaybackStatus(progress: number, duration: number, len: number) {
    if (!duration) return " ".repeat(len);
    const current = formatTime(progress);
    const total = formatTime(duration);
    const spaces = len - current.length - total.length;
    return current + " ".repeat(Math.max(0, spaces)) + total;
  }
</script>

<svelte:head>
  <title>ALBERT VO | END TO END SOLUTIONS</title>
</svelte:head>

<section class="hero-top-border"></section>
<section class="hero">
  <div class="grid grid-2">
    <div>
      <h1 class="site-title">ALBERT VO</h1>
      <p class="motto"><em>"Building End to End Solutions"</em></p>
    </div>
    <div class="hero-meta">
      <p>EST. 2006</p>
      <p>SAN JOSE, CA</p>
      <p class="status">CURRENT STATUS: <strong>AVAILABLE</strong></p>
    </div>
  </div>
  <p class="hero-tagline">
    Software engineer building robust, scalable systems from the metal to the browser.
  </p>
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

<section class="ascii-art-container">
  <pre class="ascii-art">
 ________________________________
| \___===____________________()__\
| |                              |
| |   _________________________  |
| |  |                        |  |
| |  | {truncate(
      spotifyData.isPlaying ? "NOW PLAYING:" : "LAST PLAYED:",
      22,
    )} |  |
| |  |                        |  |
| |  | {truncate(spotifyData.title, 22)} |  |
| |  | {truncate(spotifyData.artist, 22)} |  |
| |  | {getProgressBar(
      spotifyData.progress_ms,
      spotifyData.duration_ms,
      22,
    )} |  |
| |  | {getPlaybackStatus(
      spotifyData.progress_ms,
      spotifyData.duration_ms,
      22,
    )} |  |
| |  |                        |  |
| |  |                        |  |
| |  |                        |  |
| |  |________________________|  |
| |                              |
| |                              |
| |              @@@@            |
| |           @@@Menu@@@         |
| |          @@@@@@@@@@@@        |
| |         @&lt;&lt;@@@() @@@&gt;&gt;@      |
| |          @@@@@@@@@@@@        |
| |           @@@ ||&gt; @@@        |
| |              @@@@            |
| |                              |
| |                              |
| |                              |
| |                              |
 \|______________________________|
  </pre>
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
  .hero-top-border {
    border-top: 3px solid black;
    padding: 0;
    height: 0;
    margin-top: 0;
  }

  .hero {
    margin-top: 0;
    border-top: none;
  }

  .site-title {
    margin-bottom: 0.25rem;
  }

  .motto {
    font-weight: 400;
  }

  .hero-meta {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: right;
    font-weight: 700;
  }

  .hero-tagline {
    margin-top: 1.5rem;
  }

  .status {
    margin-top: 1rem;
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

  .ascii-art-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6rem 0;
    text-align: center;
  }

  .ascii-art {
    font-family: "Space Mono", monospace;
    font-size: 20px;
    line-height: 1.2;
    margin-bottom: 2rem;
    white-space: pre;
    display: inline-block;
    text-align: left;
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
    .hero-meta,
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
