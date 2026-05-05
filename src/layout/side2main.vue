<template>
  <div class="layout-container">
    <aside class="layout-sidebar">
      <slot name="sidebar"></slot>
    </aside>
    <main class="layout-main">
      <slot name="main"></slot>
    </main>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--clay-canvas);
}

.layout-sidebar {
  flex-shrink: 0;
  z-index: 10;
}

.layout-main {
  flex-grow: 1;
  position: relative;
}
</style>
