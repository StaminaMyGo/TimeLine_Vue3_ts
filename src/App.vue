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
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Side2Main from './layout/side2main.vue';
import EditorSidebar from './components/EditorSidebar.vue';
import TimelineDisplay from './components/TimelineDisplay.vue';
import BlogHome from './pages/BlogHome.vue';

type AppRoute = 'engineering' | 'exam' | 'blog';

const currentRoute = ref<AppRoute>('engineering');
const currentLine = computed(() => (currentRoute.value === 'exam' ? 'exam' : 'engineering'));

const resolveRoute = (): AppRoute => {
  const route = window.location.hash.replace(/^#\/?/, '');
  if (route === 'blog') return 'blog';
  if (route === 'exam') return 'exam';
  return 'engineering';
};

const syncRoute = () => {
  currentRoute.value = resolveRoute();
};

onMounted(() => {
  syncRoute();
  window.addEventListener('hashchange', syncRoute);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncRoute);
});
</script>
