<template>
  <Teleport to="body">
    <div v-if="authStore.showLoginModal" class="modal-overlay" @click.self="authStore.closeLoginModal()">
      <div class="modal-container">
        <button class="modal-close" @click="authStore.closeLoginModal()" aria-label="关闭">✕</button>
        <h2 class="modal-title">登录</h2>
        <form @submit.prevent="handleLogin" class="modal-form">
          <div class="form-group">
            <label>邮箱</label>
            <input v-model="email" type="email" placeholder="user@example.com" required />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="password" type="password" placeholder="******" required />
          </div>
          <p v-if="loginError" class="error-text">{{ loginError }}</p>
          <button type="submit" class="btn-login" :disabled="loading">登录</button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../store/useAuth'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const loginError = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loginError.value = ''
  loading.value = true
  const result = await authStore.login(email.value, password.value)
  loading.value = false
  if (!result.success) {
    loginError.value = result.error?.message || '登录失败'
  } else {
    email.value = ''
    password.value = ''
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
}

.modal-container {
  position: relative;
  width: 400px;
  max-width: 90%;
  padding: 36px 32px 28px;
  background: var(--clay-canvas);
  border-radius: var(--clay-radius-lg);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--clay-muted);
  font-size: 18px;
  cursor: pointer;
  border-radius: var(--clay-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: var(--clay-surface-soft);
  color: var(--clay-ink);
}

.modal-title {
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: 600;
  color: var(--clay-ink);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: var(--clay-ink);
  font-size: 14px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--clay-hairline);
  border-radius: var(--clay-radius-md);
  background: var(--clay-canvas);
  color: var(--clay-ink);
  box-sizing: border-box;
  outline: none;
  font-size: 14px;
}

.form-group input:focus {
  border-color: var(--clay-primary);
}

.error-text {
  color: var(--clay-error);
  font-size: 13px;
  margin: 0;
}

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
  margin-top: 4px;
}

.btn-login:hover:not(:disabled) {
  background: var(--clay-primary-active);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-container {
    width: 90%;
    padding: 28px 20px 22px;
  }
}
</style>
