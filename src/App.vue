<template>
  <Side2Main>
    <template #sidebar>
      <EditorSidebar />
    </template>
    <template #main>
      <TimelineDisplay />
    </template>
  </Side2Main>
</template>

<script setup lang="ts">
import Side2Main from './layout/side2main.vue';
import EditorSidebar from './components/EditorSidebar.vue';
import TimelineDisplay from './components/TimelineDisplay.vue';
</script>