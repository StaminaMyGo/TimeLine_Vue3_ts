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
.sidebar {
  position: relative;
  width: 320px;
  height: 100%;
  padding: 28px 24px 104px;
  border-right: 1px solid var(--clay-hairline);
  background: var(--clay-surface-soft);
  box-sizing: border-box;
  color: var(--clay-ink);
}

h3 {
  margin: 0 0 22px;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.15;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--clay-ink);
  font-size: 14px;
  font-weight: 600;
}

input,
textarea,
select {
  width: 100%;
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid var(--clay-hairline);
  border-radius: var(--clay-radius-md);
  background: var(--clay-canvas);
  color: var(--clay-ink);
  box-sizing: border-box;
  outline: none;
}

textarea {
  min-height: 132px;
  resize: vertical;
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--clay-primary);
}

.btn-save,
.btn-login {
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: var(--clay-radius-md);
  background: var(--clay-primary);
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.btn-save:hover,
.btn-login:hover {
  background: var(--clay-primary-active);
}

.btn-cancel {
  margin-top: 12px;
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--clay-muted);
  cursor: pointer;
  font-size: 13px;
}

.btn-delete {
  margin-top: 12px;
  width: 100%;
  padding: 10px;
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

.auth-section {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
}

.user-email {
  color: var(--clay-body);
  font-size: 13px;
  word-break: break-all;
}

.btn-logout {
  min-width: 64px;
  height: 36px;
  border: 1px solid var(--clay-hairline);
  border-radius: var(--clay-radius-sm);
  background: var(--clay-canvas);
  color: var(--clay-body);
  cursor: pointer;
  font-size: 13px;
}

.btn-logout:hover {
  border-color: var(--clay-primary);
  color: var(--clay-primary);
}

.error-text {
  color: var(--clay-error);
  font-size: 13px;
  margin-top: 10px;
}

.divider {
  border: none;
  border-top: 1px solid var(--clay-hairline);
  margin: 22px 0;
}

.route-tabs {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.route-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 10px;
  border: 1px solid var(--clay-hairline);
  border-radius: var(--clay-radius-md);
  background: var(--clay-canvas);
  color: var(--clay-ink);
  text-decoration: none;
  font-size: 14px;
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
