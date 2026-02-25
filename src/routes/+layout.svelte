<script>
  import '../app.css';
  let { children } = $props();
</script>

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
