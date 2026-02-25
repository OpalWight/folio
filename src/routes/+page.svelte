<script lang="ts">
  import { onMount } from 'svelte';

  const projects = [
    {
      title: "CAREFLOW",
      description: "Revolutionizing nursing assistant education through immersive patient simulations and personalized quizzes.",
      tags: ["#REACT", "#NODEJS", "#SQL"],
      link: "#",
    },
    {
      title: "NEUROTECH",
      description: "Brain-computer interface visualization suite for real-time neural data analysis.",
      tags: ["#PYTHON", "#C++", "#WASM"],
      link: "#",
    },
    {
      title: "CYCLONE",
      description: "High-performance computer vision system for gate detection using YOLO and distributed computing.",
      tags: ["#GO", "#PYTHON", "#YOLO"],
      link: "#",
    },
    {
      title: "BASE PAIRING PROBABILITY MODEL",
      description: "Finding alternatives to noisy experimental icSHAPE data by utilizing RNA base pairing probabilities.",
      tags: ["#BIOINFORMATICS", "#MATH", "#TS"],
      link: "#",
    },
    {
      title: "BARNYARD",
      description: "Custom-built k3s homelab optimized for media streaming, high-availability file storage, and localized machine learning workloads.",
      tags: ["#K3S", "#SELFHOSTED", "#ML"],
      link: "#",
    }
  ];

  let spotifyData = $state({ title: 'LOADING...', artist: 'SPOTIFY', isPlaying: false, progress_ms: 0, duration_ms: 0 });

  onMount(async () => {
    async function updateSpotify() {
      try {
        const res = await fetch('/api/spotify');
        const data = await res.json();
        if (data.title) {
          spotifyData = data;
        }
      } catch (e) {
        spotifyData = { title: 'OFFLINE', artist: 'IPOD', isPlaying: false, progress_ms: 0, duration_ms: 0 };
      }
    }
    
    updateSpotify();
    
    // Sync with Spotify every 10 seconds
    const syncInterval = setInterval(updateSpotify, 10000);
    
    // Local ticker to update the time every second
    const tickerInterval = setInterval(() => {
      if (spotifyData.isPlaying && spotifyData.progress_ms < spotifyData.duration_ms) {
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
    for (let i = 0; i < str.length; i++) {
      // Check if character is CJK (Full-width)
      if (str.charCodeAt(i) >= 0x1100 && (
          (str.charCodeAt(i) <= 0x115f) ||
          (str.charCodeAt(i) >= 0x2e80 && str.charCodeAt(i) <= 0xa4cf) ||
          (str.charCodeAt(i) >= 0xac00 && str.charCodeAt(i) <= 0xd7a3) ||
          (str.charCodeAt(i) >= 0xf900 && str.charCodeAt(i) <= 0xfaff) ||
          (str.charCodeAt(i) >= 0xfe10 && str.charCodeAt(i) <= 0xfe19) ||
          (str.charCodeAt(i) >= 0xfe30 && str.charCodeAt(i) <= 0xfe6f) ||
          (str.charCodeAt(i) >= 0xff00 && str.charCodeAt(i) <= 0xff60) ||
          (str.charCodeAt(i) >= 0xffe0 && str.charCodeAt(i) <= 0xffe6)
      )) {
        width += 2;
      } else {
        width += 1;
      }
    }
    return width;
  }

  function truncate(str: string, len: number) {
    if (!str) return ' '.repeat(len);
    
    let currentWidth = 0;
    let result = '';
    
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const charWidth = getVisualWidth(char);
      
      if (currentWidth + charWidth > len - 3 && i < str.length - 1) {
        result += '...';
        currentWidth += 3;
        break;
      }
      
      result += char;
      currentWidth += charWidth;
    }
    
    return result + ' '.repeat(Math.max(0, len - currentWidth));
  }

  function formatTime(ms: number) {
    if (!ms) return '00:00';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function getProgressBar(progress: number, duration: number, width: number) {
    if (!duration) return '-'.repeat(width);
    const percent = Math.min(progress / duration, 1);
    const filled = Math.round(width * percent);
    return '#'.repeat(filled) + '-'.repeat(width - filled);
  }

  function getPlaybackStatus(progress: number, duration: number, len: number) {
    if (!duration) return ' '.repeat(len);
    const current = formatTime(progress);
    const total = formatTime(duration);
    const spaces = len - current.length - total.length;
    return current + ' '.repeat(Math.max(0, spaces)) + total;
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
      <p class="motto">"Building End to End Solutions"</p>
    </div>
    <div class="hero-meta">
      <p>EST. 2006</p>
      <p>SAN JOSE, CA</p>
      <p class="status">CURRENT STATUS: <strong>AVAILABLE</strong></p>
    </div>
  </div>
</section>

<section class="about">

  <h2 class="section-header">ABOUT ME</h2>

  <div class="grid grid-2">

        <div>

          <p class="bold-italic">I am a software engineer specializing in architecting systems from the metal to the browser.</p>

        </div>

    

                    <div>

                      <p>A pre-med student turned software engineer, I bridge the gap between clinical empathy and technical complexity. I'm dedicated to end-to-end ownership and building robust, scalable systems that prioritize human-centric impact.</p>

                    </div>

                

            

        

    

  </div>

</section>



<section class="projects">

  <h2 class="section-header">FEATURED PROJECTS</h2>

  <div class="project-grid">

    {#each projects as project}

      <div class="project-item">

        <div class="project-image-placeholder">

          <div class="overlay"></div>

        </div>

        <div class="project-content">

          <div class="project-meta">

            <span>[ PRJ_0{projects.indexOf(project) + 1} ]</span>

            <span>2026</span>

          </div>

          <h3>{project.title}</h3>

          <p>{project.description}</p>

          <div class="project-tags">

            {#each project.tags as tag}

              <span>{tag}</span>

            {/each}

          </div>

          <a href={project.link} class="more-link">MORE -></a>

        </div>

      </div>

    {/each}

  </div>

</section>



<section class="hobbies">



  <h2 class="section-header">OFF THE CLOCK</h2>



  <div class="grid grid-2">



    <div class="interactive-zone">



      <h3 class="hobby-title">GUITAR</h3>



      <p>Exploring complex arrangements and soundscapes. Always searching for the perfect tone.</p>



    </div>



        <div class="interactive-zone">



          <h3 class="hobby-title">OVERWATCH</h3>



          <p>Tracer main. Need a duo, hmu @opalwight on steam.</p>



        </div>



    



  </div>



</section>





<section class="ascii-art-container">
  <pre class="ascii-art">
 ________________________________
| \___===____________________()__\
| |                              |
| |   _________________________  |
| |  |                        |  |
| |  | {truncate(spotifyData.isPlaying ? 'NOW PLAYING:' : 'LAST PLAYED:', 22)} |  |
| |  |                        |  |
| |  | {truncate(spotifyData.title, 22)} |  |
| |  | {truncate(spotifyData.artist, 22)} |  |
| |  | {getProgressBar(spotifyData.progress_ms, spotifyData.duration_ms, 22)} |  |
| |  | {getPlaybackStatus(spotifyData.progress_ms, spotifyData.duration_ms, 22)} |  |
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
    border-top: 8px solid black;
    padding: 0;
    height: 0;
  }

  .site-title {
    font-size: clamp(2rem, 5vw, 4rem);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .motto {
    font-size: 1.5rem;
    font-weight: 700;
    font-style: italic;
  }

  .hero-meta {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: right;
    font-weight: 700;
  }

  .status {
    margin-top: 2rem;
  }

  .section-header {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .project-item {
    display: flex;
    flex-direction: column;
    border: 2px solid black;
    background: var(--bg-color);
  }

  .project-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 1rem;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  .project-item:hover .project-content {
    background-color: var(--accent-color);
    color: white;
  }

  .project-item:hover .more-link,
  .project-item:hover .project-tags span,
  .project-item:hover .project-meta span,
  .project-item:hover h3,
  .project-item:hover p {
    color: white;
  }

  .project-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    font-weight: 700;
  }

  .project-content h3 {
    font-size: 1.2rem;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.7rem;
    font-weight: 700;
    margin-top: auto;
  }

  .project-image-placeholder {
    background-color: #ccc;
    position: relative;
    height: 200px;
    border-bottom: 2px solid black;
  }

  .hobby-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .ascii-art-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6rem 2rem;
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

  .ascii-source {
    font-size: 0.7rem;
    font-weight: 700;
    opacity: 0.5;
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

  .more-link {
    display: inline-block;
    margin-top: 1rem;
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
