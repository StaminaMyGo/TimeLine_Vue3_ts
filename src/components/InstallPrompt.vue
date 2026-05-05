<template>
  <Teleport to="body">
    <div v-if="showInstall" class="modal-overlay" @click.self="dismiss">
      <div class="modal-container">
        <button class="modal-close" @click="dismiss" aria-label="关闭">✕</button>

        <!-- App icon -->
        <div class="install-icon">
          <img src="/pwa-icon.svg" alt="TimeLine" width="80" height="80" />
        </div>

        <h2 class="modal-title">{{ isIos ? '添加到主屏幕' : '安装应用' }}</h2>
        <p class="modal-desc">
          {{ isIos ? '点击 Safari 分享按钮 → 添加到主屏幕，获得完整 App 体验' : '将此应用安装到桌面，获得更快、更便捷的使用体验' }}
        </p>

        <!-- Non-iOS: install button -->
        <div v-if="!isIos" class="install-actions">
          <button class="btn-install" @click="handleInstall">安装</button>
          <button class="btn-later" @click="dismiss">稍后</button>
        </div>

        <!-- iOS: guide -->
        <div v-else class="ios-guide">
          <div class="ios-guide-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </div>
          <button class="btn-got" @click="dismiss">知道了</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { usePWAInstall } from '../composables/usePWAInstall';

const { showInstall, isIos, install, dismiss } = usePWAInstall();

const handleInstall = async () => {
  await install();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1001;
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
  text-align: center;
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

.install-icon {
  margin-bottom: 16px;
}

.install-icon img {
  border-radius: var(--clay-radius-lg);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.modal-title {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 600;
  color: var(--clay-ink);
}

.modal-desc {
  margin: 0 0 24px;
  color: var(--clay-body);
  font-size: 14px;
  line-height: 1.6;
}

.install-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-install {
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: var(--clay-radius-md);
  background: var(--clay-primary);
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
}

.btn-install:hover {
  background: var(--clay-primary-active);
}

.btn-later {
  width: 100%;
  height: 38px;
  border: none;
  background: transparent;
  color: var(--clay-muted);
  cursor: pointer;
  font-size: 13px;
}

.btn-later:hover {
  color: var(--clay-ink);
}

.ios-guide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.ios-guide-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--clay-surface-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--clay-brand-teal);
}

.btn-got {
  width: 100%;
  height: 44px;
  border: 1px solid var(--clay-hairline);
  border-radius: var(--clay-radius-md);
  background: var(--clay-canvas);
  color: var(--clay-ink);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.btn-got:hover {
  background: var(--clay-surface-soft);
}

@media (max-width: 768px) {
  .modal-container {
    width: 90%;
    padding: 28px 20px 22px;
  }
}
</style>
