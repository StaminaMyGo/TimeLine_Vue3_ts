import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { supabase } from './utils/supabase'
import { useAuthStore } from './store/useAuth'

const app = createApp(App);
app.config.errorHandler = (err: any) => {
  document.getElementById('app')!.innerHTML = '<pre style="color:red">ERROR: ' + (err?.stack || err?.message || String(err)) + '</pre>';
};
app.use(createPinia());
const authStore = useAuthStore();
// 初始化时恢复会话（页面刷新后）
authStore.initAuth();
// 注册全局监听（要在 app.mount 之前或之后都可以）
supabase.auth.onAuthStateChange((event, session) => {
  // const authStore = useAuthStore()
  if (event === 'SIGNED_IN') {
    console.log('用户已登录:', session?.user)
    authStore.user = session?.user ?? null
    authStore.isLoggedIn = true
  } else if (event === 'SIGNED_OUT') {
    console.log('用户已退出')
    authStore.user = null
    authStore.isLoggedIn = false
  }
})

app.mount('#app');

// DEBUG: if still empty after mount, insert fallback text
setTimeout(() => {
  const appDiv = document.getElementById('app');
  if (appDiv && appDiv.children.length === 0) {
    appDiv.innerHTML = '<div style="padding:20px;color:red">DEBUG: App mounted but no content rendered. Check console for errors.</div>';
  }
}, 1000);