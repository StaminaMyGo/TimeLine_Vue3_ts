import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/design.css'
import { useAuthStore } from './store/useAuth'

// ✅ PWA 注册（由插件提供）
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)
app.use(createPinia())

const authStore = useAuthStore()

// ✅ 注册 SW（带更新控制）
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New version available, refreshing...')
    updateSW(true) // 强制刷新
  },
  onOfflineReady() {
    console.log('App ready for offline use')
  }
})

// ✅ 先 mount（避免 TDZ / 初始化竞态）
app.mount('#app')

// ✅ 再初始化登录状态（非阻塞）
authStore.initAuth().catch(console.error)

// ✅ 当 SW 更新时强制刷新（避免版本错配）
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  window.location.reload()
})