<template>
  <div class="layout-container">
    <aside class="layout-sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <slot name="sidebar"></slot>
    </aside>
    <main class="layout-main">
      <slot name="main"></slot>
    </main>
    <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen" aria-label="切换侧栏">
      <span class="menu-icon">{{ sidebarOpen ? '✕' : '☰' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const sidebarOpen = ref(false)
</script>

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

.menu-toggle {
  display: none;
}

@media (max-width: 768px) {
  .layout-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .layout-sidebar.sidebar-open {
    transform: translateX(0);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background: var(--clay-primary);
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    z-index: 100;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  }
}
</style>
