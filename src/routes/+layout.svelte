<script>
  import '../app.css';
  import favicon from '$lib/assets/AV.svg';
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
  <div class="main-column">
    <main>
      {@render children()}
    </main>
  </div>
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
