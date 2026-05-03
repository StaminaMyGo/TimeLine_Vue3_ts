import { defineStore } from 'pinia';
import { ref,computed } from 'vue';
import { supabase } from '../utils/supabase';

export const useTimelineStore = defineStore('timeline', () => {
  const items = ref<any[]>([]);
  const loading = ref(false);
const editingId = ref<number | null>(null);

// 必须定义并返回这个计算属性
  const sortedItems = computed(() => {
    // 按照创建时间倒序排列
    return [...items.value].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });

  // 3. 新增：获取当前正在编辑的对象（供侧边栏回显数据）
  const currentEditingItem = computed(() => {
    return items.value.find(item => item.id === editingId.value) || null;
  });
  // 1. 从云端获取数据
  const fetchItems = async () => {
    loading.value = true;
    const { data, error } = await supabase
      .from('timeline_items')
      .select('*')
      .order('created_at', { ascending: false }); // 按时间倒序排序
    
    if (!error) items.value = data;
    loading.value = false;
  };

  // 2. 新增记录到云端
  const addItem = async (newItem: any) => {
    const { data, error } = await supabase
      .from('timeline_items')
      .insert([{ 
        date_str: newItem.date, 
        content: newItem.content, 
        type: newItem.type 
      }])
      .select();
    
    if (!error && data) {
      items.value.unshift(data[0]); // 同步更新前端 UI
    }
  };

  // 3. 修改云端记录
  const updateItem = async (id: number, updates: any) => {
    const { error } = await supabase
      .from('timeline_items')
      .update({
        date_str: updates.date,
        content: updates.content,
        type: updates.type
      })
      .eq('id', id);
    
    if (!error) await fetchItems(); // 重新刷新列表
  };
  const setEditing = (id: number | null) => { editingId.value = id; };

  return { 
    items, 
    loading, 
    editingId, 
    sortedItems, // 确保这一行存在
    fetchItems, 
    addItem, 
    updateItem, 
    currentEditingItem,
    setEditing 
  };
});