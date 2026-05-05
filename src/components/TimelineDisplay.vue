<template>
  <div class="main-display">
    <div v-if="store.loading" class="status-text">加载中...</div>
    <div v-else-if="store.items.length === 0" class="status-text">{{ emptyText }}</div>
    <div v-for="item in store.sortedItems" :key="item.id" class="item-wrapper">
      <div v-if="item.type === 'section'" class="section-node" @click="store.setEditing(item.id)">
        <span class="section-label">{{ item.date_str }}</span>
      </div>
      <div v-else class="post-node" @click="store.setEditing(item.id)">
        <div class="date-col">{{ item.date_str }}</div>
        <div class="axis-col">
          <div class="dot"></div>
          <div class="line"></div>
        </div>
        <div class="content-col">
          <div class="bubble" :class="{ active: store.editingId === item.id }">
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useTimelineStore, type TimelineLine } from '../store/useTimeline';

const props = defineProps<{
  activeLine: TimelineLine;
}>();

const store = useTimelineStore();

const emptyText = computed(() => {
  if (store.lastError) {
    return `读取${props.activeLine === 'exam' ? '考研线' : '工程线'}失败：${store.lastError}`;
  }

  if (props.activeLine === 'exam') {
    return '考研线暂无记录。若要保存考研线数据，请先在 Supabase 创建 exam_timeline_items 表。';
  }

  return '暂无记录，请检查控制台日志或 Supabase RLS 策略';
});

watch(
  () => props.activeLine,
  (line) => {
    store.fetchItems(line);
  },
  { immediate: true },
);
</script>

<style scoped>
.main-display {
  flex: 1;
  height: 100%;
  padding: 48px 56px;
  overflow-y: auto;
  background:
    radial-gradient(circle at 92% 12%, rgba(255, 176, 132, 0.2), transparent 28%),
    radial-gradient(circle at 16% 84%, rgba(184, 164, 237, 0.18), transparent 32%),
    var(--clay-canvas);
  box-sizing: border-box;
}

.section-node {
  margin: 24px 0 24px 174px;
  cursor: pointer;
}

.section-label {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  padding: 0 14px;
  border-radius: 999px;
  background: var(--clay-brand-ochre);
  color: var(--clay-ink);
  font-size: 13px;
  font-weight: 600;
}

.post-node {
  display: grid;
  grid-template-columns: 210px 28px minmax(0, 1fr);
  align-items: stretch;
  cursor: pointer;
}

.date-col {
  padding: 15px 18px 0 0;
  color: var(--clay-muted);
  font-size: 14px;
  text-align: right;
}

.axis-col {
  position: relative;
  display: flex;
  justify-content: center;
}

.dot {
  width: 12px;
  height: 12px;
  border: 3px solid var(--clay-brand-teal);
  border-radius: 50%;
  background: var(--clay-canvas);
  z-index: 2;
  margin-top: 17px;
}

.line {
  position: absolute;
  top: 18px;
  bottom: -18px;
  width: 3px;
  border-radius: 999px;
  background: var(--clay-brand-teal);
  z-index: 1;
}

.content-col {
  min-width: 0;
  padding-left: 28px;
  padding-bottom: 28px;
}

.bubble {
  display: inline-block;
  max-width: min(960px, 100%);
  padding: 18px 24px;
  border: 1px solid var(--clay-hairline);
  border-radius: var(--clay-radius-lg);
  background: var(--clay-surface-card);
  color: var(--clay-ink);
  font-size: 18px;
  line-height: 1.45;
  box-shadow: var(--clay-shadow-soft);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.bubble.active {
  border-color: var(--clay-primary);
  transform: translateX(6px);
}

.item-wrapper:nth-of-type(6n + 1) .bubble {
  background: var(--clay-surface-card);
}

.item-wrapper:nth-of-type(6n + 2) .bubble {
  background: rgba(184, 164, 237, 0.42);
}

.item-wrapper:nth-of-type(6n + 3) .bubble {
  background: rgba(255, 176, 132, 0.45);
}

.item-wrapper:nth-of-type(6n + 4) .bubble {
  background: rgba(232, 185, 74, 0.38);
}

.status-text {
  margin: 0 auto;
  max-width: 680px;
  padding: 32px;
  border: 1px solid var(--clay-hairline);
  border-radius: var(--clay-radius-xl);
  background: var(--clay-surface-card);
  color: var(--clay-muted);
  text-align: center;
  font-size: 16px;
}

@media (max-width: 900px) {
  .main-display {
    padding: 32px 20px;
  }

  .post-node {
    grid-template-columns: 1fr;
  }

  .date-col {
    text-align: left;
    padding: 0 0 8px;
  }

  .axis-col {
    display: none;
  }

  .content-col {
    padding-left: 0;
  }

  .section-node {
    margin-left: 0;
  }
}
</style>
