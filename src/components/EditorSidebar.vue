<template>
  <div class="sidebar">
    <h3>{{ isEditing ? '编辑记录' : '新增记录' }}</h3>
    <div class="form-group">
      <label>类型</label>
      <select v-model="form.type">
        <option value="post">普通学习内容</option>
        <option value="section">章节/月份节点</option>
      </select>
    </div>
    <div class="form-group">
      <label>日期 (自动更新)</label>
      <input v-model="form.date" :readonly="!isEditing" class="date-input" />
    </div>
    <div class="form-group" v-if="form.type === 'post'">
      <label>学习内容</label>
      <textarea v-model="form.content" rows="4"></textarea>
    </div>
    <div class="actions">
      <button @click="handleSave" class="btn-save">{{ isEditing ? '保存修改' : '立即发布' }}</button>
      <button v-if="isEditing" @click="cancel" class="btn-cancel">取消编辑</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import { useTimelineStore } from '../store/useTimeline';
import type { TimelineType } from '../data/types';

const store = useTimelineStore();
const isEditing = computed(() => !!store.currentEditingItem);

// 工具函数：生成 YYYY-MM-DD-HH:MM:SS
const formatFullDate = () => {
  const n = new Date();
  const f = (v: number) => String(v).padStart(2, '0');
  return `${n.getFullYear()}-${f(n.getMonth() + 1)}-${f(n.getDate())}-${f(n.getHours())}:${f(n.getMinutes())}:${f(n.getSeconds())}`;
};


const form = ref<{ type: TimelineType; date: string; content: string }>({
  type: 'post',
  date: formatFullDate(),
  content: ''
});


const handleSave = async () => {
  if (isEditing.value && store.editingId) {
    store.updateItem(store.editingId, { ...form.value });
    await nextTick();
    store.setEditing(null);
  } else {
    store.addItem({ ...form.value });
    resetForm();
  }
};

const cancel = () => store.setEditing(null);
const resetForm = () => {
  form.value = { type: 'post' as TimelineType, date: formatFullDate(), content: '' };
};

watch(() => store.currentEditingItem, (newVal) => {
  if (newVal) {
    form.value = { type: newVal.type, date: newVal.date, content: newVal.content };
  } else {
    resetForm();
  }
}, { immediate: true });
</script>

<style scoped>
.sidebar { width: 300px; padding: 20px; border-right: 1px solid #ddd; background: #fff; height: 100%; box-sizing: border-box; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px; }
input, textarea, select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.btn-save { background: #8576b9; color: white; border: none; padding: 10px; width: 100%; cursor: pointer; border-radius: 4px; }
.btn-cancel { margin-top: 10px; width: 100%; border: none; background: transparent; cursor: pointer; color: #666; font-size: 13px; }
</style>