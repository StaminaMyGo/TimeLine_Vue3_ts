<template>
  <BlogHome v-if="currentRoute === 'blog'" />
  <Side2Main v-else>
    <template #sidebar>
      <EditorSidebar :active-line="currentLine" />
    </template>
    <template #main>
      <TimelineDisplay :active-line="currentLine" />
    </template>
  </Side2Main>
  <AuthModal />
  <InstallPrompt />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref} from 'vue';
import Side2Main from './layout/side2main.vue';
import EditorSidebar from './components/EditorSidebar.vue';
import TimelineDisplay from './components/TimelineDisplay.vue';
import BlogHome from './pages/BlogHome.vue';
import AuthModal from './components/AuthModal.vue';
import InstallPrompt from './components/InstallPrompt.vue';
import { usePWAInstallTrigger } from './composables/usePWAInstallTrigger'
import { resolveRoute, type AppRoute } from './router/resolveRoute';

const currentRoute = ref<AppRoute>(resolveRoute());
const currentLine = computed(() => (currentRoute.value === 'exam' ? 'exam' : 'engineering'));


// 同步路由
const syncRoute = () => {
  currentRoute.value = resolveRoute();
};

onMounted(() => {
  syncRoute();
  window.addEventListener('hashchange', syncRoute);
  usePWAInstallTrigger()
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncRoute);
});
</script>
