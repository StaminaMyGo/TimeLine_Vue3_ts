<template>
  <div class="sidebar">
    <div class="auth-section">
      <template v-if="!authStore.isLoggedIn">
        <div class="form-group">
          <label>邮箱</label>
          <input v-model="email" type="email" placeholder="user@example.com" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="password" type="password" placeholder="******" />
        </div>
        <button @click="handleLogin" class="btn-login">登录</button>
        <p v-if="loginError" class="error-text">{{ loginError }}</p>
      </template>
      <template v-else>
        <div class="user-info">
          <span class="user-email">{{ authStore.user?.email }}</span>
          <button @click="handleLogout" class="btn-logout">退出</button>
        </div>
      </template>
    </div>

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
import { useAuthStore } from '../store/useAuth';
import type { TimelineType } from '../data/types';

const props = defineProps<{
  activeLine: TimelineLine;
}>();

const store = useTimelineStore();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loginError = ref('');

const handleLogin = async () => {
  loginError.value = '';
  const result = await authStore.login(email.value, password.value);
  if (!result.success) {
    loginError.value = result.error?.message || '登录失败';
  } else {
    email.value = '';
    password.value = '';
    await store.fetchItems(props.activeLine);
  }
};

const handleLogout = async () => {
  await authStore.logout();
  await store.fetchItems(props.activeLine);
};

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
.sidebar { position: relative; width: 300px; padding: 20px 20px 88px; border-right: 1px solid #ddd; background: #fff; height: 100%; box-sizing: border-box; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px; }
input, textarea, select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.btn-save { background: #0ea5a3; color: white; border: none; padding: 10px; width: 100%; cursor: pointer; border-radius: 8px; font-weight: 700; }
.btn-save:hover { background: #0891b2; }
.btn-cancel { margin-top: 10px; width: 100%; border: none; background: transparent; cursor: pointer; color: #666; font-size: 13px; }
.btn-delete { margin-top: 10px; width: 100%; border: 1px solid #e74c3c; background: transparent; cursor: pointer; color: #e74c3c; font-size: 13px; padding: 8px; border-radius: 4px; }
.btn-delete:hover { background: #e74c3c; color: white; }
.auth-section { margin-bottom: 15px; }
.btn-login { background: #0ea5a3; color: white; border: none; padding: 10px; width: 100%; cursor: pointer; border-radius: 8px; font-size: 14px; font-weight: 700; }
.btn-login:hover { background: #0891b2; }
.user-info { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
.user-email { font-size: 13px; color: #333; word-break: break-all; }
.btn-logout { background: transparent; border: 1px solid #ccc; padding: 4px 12px; cursor: pointer; border-radius: 4px; font-size: 12px; color: #666; }
.btn-logout:hover { border-color: #999; color: #333; }
.error-text { color: #e74c3c; font-size: 12px; margin-top: 8px; }
.divider { border: none; border-top: 1px solid #eee; margin: 15px 0; }
.route-tabs { position: absolute; left: 20px; right: 20px; bottom: 18px; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.route-link { display: inline-flex; align-items: center; justify-content: center; min-width: 74px; height: 38px; padding: 0 10px; color: #0f766e; text-decoration: none; font-size: 15px; font-weight: 700; border: 1px solid rgba(20, 184, 166, 0.32); border-radius: 8px; background: rgba(240, 253, 250, 0.7); box-sizing: border-box; transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease; }
.route-link-active { color: #fff; border-color: #0ea5a3; background: #0ea5a3; box-shadow: 0 10px 22px rgba(14, 165, 163, 0.24); }
.route-link:hover { color: #fff; border-color: #0891b2; background: #0891b2; }
</style>
