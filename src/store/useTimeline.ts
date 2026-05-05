import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '../utils/supabase';

export type TimelineLine = 'engineering' | 'exam';

const timelineTables: Record<TimelineLine, string> = {
  engineering: 'timeline_items',
  exam: 'exam_timeline_items',
};

export const useTimelineStore = defineStore('timeline', () => {
  const items = ref<any[]>([]);
  const loading = ref(false);
  const editingId = ref<number | null>(null);
  const currentLine = ref<TimelineLine>('engineering');
  const lastError = ref<string | null>(null);

  const sortedItems = computed(() => {
    return [...items.value].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  });

  const currentEditingItem = computed(() => {
    return items.value.find((item) => item.id === editingId.value) || null;
  });

  const tableForLine = (line: TimelineLine) => timelineTables[line];

  const fetchItems = async (line: TimelineLine = currentLine.value) => {
    currentLine.value = line;
    loading.value = true;
    lastError.value = null;
    editingId.value = null;

    const table = tableForLine(line);
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });

    console.log(`[fetchItems:${line}] table:`, table, 'data:', data, 'error:', error);

    if (error) {
      items.value = [];
      lastError.value = error.message;
      console.error(`[fetchItems:${line}] 查询失败:`, error.message);
    } else {
      items.value = data || [];
      if ((data || []).length === 0) {
        console.warn(`[fetchItems:${line}] 返回空数组，请检查 ${table} 是否有数据以及 Supabase RLS 策略`);
      }
    }

    loading.value = false;
  };

  const addItem = async (newItem: any, line: TimelineLine = currentLine.value) => {
    const table = tableForLine(line);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    const { data, error } = await supabase
      .from(table)
      .insert([
        {
          date_str: newItem.date,
          content: newItem.content,
          type: newItem.type,
          user_id: userId,
        },
      ])
      .select();

    if (error) {
      lastError.value = error.message;
      console.error(`[addItem:${line}] 新增失败:`, error.message);
      return;
    }

    if (data) {
      items.value.unshift(data[0]);
    }
  };

  const updateItem = async (id: number, updates: any, line: TimelineLine = currentLine.value) => {
    const table = tableForLine(line);
    const { error } = await supabase
      .from(table)
      .update({
        date_str: updates.date,
        content: updates.content,
        type: updates.type,
      })
      .eq('id', id);

    if (error) {
      lastError.value = error.message;
      console.error(`[updateItem:${line}] 修改失败:`, error.message);
      return;
    }

    await fetchItems(line);
  };

  const deleteItem = async (id: number, line: TimelineLine = currentLine.value) => {
    const table = tableForLine(line);
    const { error } = await supabase.from(table).delete().eq('id', id);

    if (error) {
      lastError.value = error.message;
      console.error(`[deleteItem:${line}] 删除失败:`, error.message);
      return;
    }

    items.value = items.value.filter((item) => item.id !== id);
    editingId.value = null;
  };

  const setEditing = (id: number | null) => {
    editingId.value = id;
  };

  return {
    items,
    loading,
    editingId,
    currentLine,
    lastError,
    sortedItems,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    currentEditingItem,
    setEditing,
  };
});
