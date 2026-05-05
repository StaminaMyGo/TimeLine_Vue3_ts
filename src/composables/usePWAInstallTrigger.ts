import { watch } from 'vue'
import { useAuthStore } from '../store/useAuth'
import { usePWAInstall } from './usePWAInstall'

/**
 * 一次性触发 PWA install 逻辑
 * 条件：登录弹窗关闭后触发 listen()
 */
export function usePWAInstallTrigger() {
  const authStore = useAuthStore()
  const { listen } = usePWAInstall()

  let triggered = false

  const stop = watch(
    () => authStore.showLoginModal,
    (showing) => {
      if (!triggered && showing === false) {
        triggered = true
        listen()
        stop()
      }
    },
    { immediate: false }
  )
}