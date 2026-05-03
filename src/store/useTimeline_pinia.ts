import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { TimelineItem, TimelineType } from '../data/types';

export const useTimelineStore = defineStore('timeline', () => {
  const items = ref<any[]>([]);
  const editingId = ref<string | null>(null);

  // 排序后的列表
  const sortedItems = computed(() => 
    [...items.value].sort((a, b) => b.timestamp - a.timestamp)
  );

  // 当前编辑对象
  const currentEditingItem = computed(() => 
    items.value.find(i => i.id === editingId.value) || null
  );

  const addItem = (item: { type: TimelineType; date: string; content: string }) => {
    items.value.push({
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now()
    });
  };

  const updateItem = (id: string, updates: Partial<TimelineItem>) => {
    const index = items.value.findIndex(i => i.id === id);
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updates };
    }
  };

  const setEditing = (id: string | null) => {
    editingId.value = id;
  };

  return { items, editingId, sortedItems, currentEditingItem, addItem, updateItem, setEditing };
});