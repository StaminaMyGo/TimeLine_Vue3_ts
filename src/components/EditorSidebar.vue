<template>
  <div class="sidebar">
    <!-- 登录区域 -->
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
      <button v-if="isEditing" @click="handleDelete" class="btn-delete">删除记录</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import { useTimelineStore } from '../store/useTimeline';
import { useAuthStore } from '../store/useAuth';
import type { TimelineType } from '../data/types';

const store = useTimelineStore();
const authStore = useAuthStore();

// 登录表单状态
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
  }
};

const handleLogout = async () => {
  await authStore.logout();
};
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

const handleDelete = async () => {
  if (store.editingId && confirm('确定要删除这条记录吗？')) {
    await store.deleteItem(store.editingId);
  }
};
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
.btn-delete { margin-top: 10px; width: 100%; border: 1px solid #e74c3c; background: transparent; cursor: pointer; color: #e74c3c; font-size: 13px; padding: 8px; border-radius: 4px; }
.btn-delete:hover { background: #e74c3c; color: white; }

/* 登录区域样式 */
.auth-section { margin-bottom: 15px; }
.btn-login { background: #3498db; color: white; border: none; padding: 10px; width: 100%; cursor: pointer; border-radius: 4px; font-size: 14px; }
.btn-login:hover { background: #2980b9; }
.user-info { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
.user-email { font-size: 13px; color: #333; word-break: break-all; }
.btn-logout { background: transparent; border: 1px solid #ccc; padding: 4px 12px; cursor: pointer; border-radius: 4px; font-size: 12px; color: #666; }
.btn-logout:hover { border-color: #999; color: #333; }
.error-text { color: #e74c3c; font-size: 12px; margin-top: 8px; }
.divider { border: none; border-top: 1px solid #eee; margin: 15px 0; }
</style>