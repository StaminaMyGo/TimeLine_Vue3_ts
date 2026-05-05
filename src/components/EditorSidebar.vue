<template>
  <div class="sidebar">
    <UserStatus :active-line="activeLine" />
    <hr class="divider" />

    <h3>{{ isEditing ? '编辑记录' : '新增记录' }}</h3>
    <div class="form-group">
      <label>类型</label>
      <select v-model="form.type">
        <option value="post">普通学习内容</option>
        <option value="section">章节/月分节点</option>
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
      <button v-if="isEditing" @click="handleDelete" class="btn-delete">删除记录</button>
    </div>

    <nav class="route-tabs" aria-label="页面路由">
      <a href="#/engineering" class="route-link" :class="{ 'route-link-active': activeLine === 'engineering' }">工程线</a>
      <a href="#/exam" class="route-link" :class="{ 'route-link-active': activeLine === 'exam' }">考研线</a>
      <a href="#/blog" class="route-link">个人博客</a>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useTimelineStore, type TimelineLine } from '../store/useTimeline';
import type { TimelineType } from '../data/types';
import UserStatus from './UserStatus.vue';

const props = defineProps<{
  activeLine: TimelineLine;
}>();

const store = useTimelineStore();

const isEditing = computed(() => !!store.currentEditingItem);

const formatFullDate = () => {
  const now = new Date();
  const format = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${format(now.getMonth() + 1)}-${format(now.getDate())}-${format(now.getHours())}:${format(now.getMinutes())}:${format(now.getSeconds())}`;
};

const form = ref<{ type: TimelineType; date: string; content: string }>({
  type: 'post',
  date: formatFullDate(),
  content: '',
});

const handleSave = async () => {
  if (isEditing.value && store.editingId) {
    await store.updateItem(store.editingId, { ...form.value }, props.activeLine);
    await nextTick();
    store.setEditing(null);
  } else {
    await store.addItem({ ...form.value }, props.activeLine);
    resetForm();
  }
};

const cancel = () => store.setEditing(null);

const handleDelete = async () => {
  if (store.editingId && confirm('确定要删除这条记录吗？')) {
    await store.deleteItem(store.editingId, props.activeLine);
  }
};

const resetForm = () => {
  form.value = { type: 'post' as TimelineType, date: formatFullDate(), content: '' };
};

watch(
  () => store.currentEditingItem,
  (newVal) => {
    if (newVal) {
      form.value = {
        type: newVal.type,
        date: newVal.date_str || newVal.date,
        content: newVal.content,
      };
    } else {
      resetForm();
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.sidebar {
  position: relative;
  width: 320px;
  height: 100%;
  padding: 16px 18px 90px;
  border-right: 1px solid var(--clay-hairline);
  background: var(--clay-surface-soft);
  box-sizing: border-box;
  color: var(--clay-ink);
}

h3 {
  margin: 0 0 16px;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.15;
}

.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: var(--clay-ink);
  font-size: 13px;
  font-weight: 600;
}

input,
textarea,
select {
  width: 100%;
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid var(--clay-hairline);
  border-radius: var(--clay-radius-md);
  background: var(--clay-canvas);
  color: var(--clay-ink);
  box-sizing: border-box;
  outline: none;
  font-size: 13px;
}

textarea {
  min-height: 110px;
  resize: vertical;
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--clay-primary);
}

.btn-save {
  width: 100%;
  height: 38px;
  border: 0;
  border-radius: var(--clay-radius-md);
  background: var(--clay-primary);
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.btn-save:hover {
  background: var(--clay-primary-active);
}

.btn-cancel {
  margin-top: 10px;
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--clay-muted);
  cursor: pointer;
  font-size: 13px;
}

.btn-delete {
  margin-top: 10px;
  width: 100%;
  padding: 8px;
  border: 1px solid var(--clay-error);
  border-radius: var(--clay-radius-md);
  background: transparent;
  color: var(--clay-error);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.btn-delete:hover {
  background: var(--clay-error);
  color: white;
}

.divider {
  border: none;
  border-top: 1px solid var(--clay-hairline);
  margin: 16px 0;
}

.route-tabs {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 18px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.route-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 8px;
  border: 1px solid var(--clay-hairline);
  border-radius: var(--clay-radius-md);
  background: var(--clay-canvas);
  color: var(--clay-ink);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  box-sizing: border-box;
}

.route-link-active {
  border-color: var(--clay-primary);
  background: var(--clay-primary);
  color: #fff;
}

.route-link:hover {
  border-color: var(--clay-primary);
}
</style>
