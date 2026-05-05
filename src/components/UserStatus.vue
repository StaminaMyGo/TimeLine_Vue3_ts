<template>
  <div class="user-status">
    <template v-if="authStore.authState === 'authenticated'">
      <span class="user-email" :title="authStore.user?.email">{{ authStore.user?.email }}</span>
      <button @click="handleLogout" class="btn-logout">退出</button>
    </template>
    <template v-else>
      <span class="status-label">未登录</span>
      <button @click="authStore.openLoginModal()" class="btn-login-sm">登录</button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/useAuth'
import { useTimelineStore, type TimelineLine } from '../store/useTimeline'

const props = defineProps<{
  activeLine: TimelineLine
}>()

const authStore = useAuthStore()
const store = useTimelineStore()

const handleLogout = async () => {
  await authStore.logout()
  await store.fetchItems(props.activeLine)
}
</script>

<style scoped>
.user-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
}

.user-email {
  color: var(--clay-body);
  font-size: 13px;
  word-break: break-all;
  flex: 1;
  min-width: 0;
}

.status-label {
  color: var(--clay-muted);
  font-size: 13px;
}

.btn-logout,
.btn-login-sm {
  flex-shrink: 0;
  height: 32px;
  padding: 0 14px;
  border: 1px solid var(--clay-hairline);
  border-radius: var(--clay-radius-sm);
  background: var(--clay-canvas);
  color: var(--clay-body);
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
}

.btn-logout:hover,
.btn-login-sm:hover {
  border-color: var(--clay-primary);
  color: var(--clay-primary);
}
</style>
