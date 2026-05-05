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
.main-display { flex: 1; padding: 40px; background: #f4f7f9; height: 100%; overflow-y: auto; }
.section-node { margin: 20px 0 20px 45px; cursor: pointer; }
.section-label { background: #3498db; color: white; padding: 4px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
.post-node { display: flex; align-items: stretch; cursor: pointer; }
.date-col { width: 160px; text-align: right; padding-right: 15px; color: #999; font-size: 13px; padding-top: 10px; }
.axis-col { position: relative; width: 20px; display: flex; justify-content: center; }
.dot { width: 8px; height: 8px; border: 2px solid #8576b9; border-radius: 50%; background: #fff; z-index: 2; margin-top: 15px; }
.line { position: absolute; top: 15px; bottom: -15px; width: 2px; background: #8576b9; z-index: 1; }
.content-col { flex: 1; padding-left: 20px; padding-bottom: 25px; }
.bubble { background: #fff; padding: 12px 18px; border-radius: 6px; display: inline-block; box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: 0.2s; border: 2px solid transparent; }
.bubble.active { border-color: #8576b9; transform: translateX(5px); }
.status-text { text-align: center; color: #999; padding: 40px; font-size: 14px; }
</style>
