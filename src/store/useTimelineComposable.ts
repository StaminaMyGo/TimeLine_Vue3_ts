import { reactive, computed } from 'vue';
import type { TimelineItem } from '../data/types.ts';

const state = reactive({
  items: [] as TimelineItem[],
  editingId: null as string | null,
});

export const useTimeline = () => {
  const sortedItems = computed(() => [...state.items].sort((a, b) => b.timestamp - a.timestamp));
  const currentEditingItem = computed(() => state.items.find(i => i.id === state.editingId) || null);

  const addItem = (item: Omit<TimelineItem, 'id' | 'timestamp'>) => {
    state.items.push({
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now()
    });
  };

  const updateItem = (id: string, updates: Partial<TimelineItem>) => {
    const index = state.items.findIndex(i => i.id === id);
    if (index !== -1) state.items[index] = { ...state.items[index], ...updates };
  };

  const setEditing = (id: string | null) => { state.editingId = id; };

  return { state, sortedItems, currentEditingItem, addItem, updateItem, setEditing };
};