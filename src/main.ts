import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { supabase } from './utils/supabase';
import { useAuthStore } from './store/useAuth';

const app = createApp(App);

app.config.errorHandler = (err: any) => {
  document.getElementById('app')!.innerHTML = '<pre style="color:red">ERROR: ' + (err?.stack || err?.message || String(err)) + '</pre>';
};

app.use(createPinia());

const authStore = useAuthStore();

const mountApp = async () => {
  await authStore.initAuth();

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
      console.log('用户已登录:', session?.user);
      authStore.user = session?.user ?? null;
      authStore.isLoggedIn = !!session?.user;
    } else if (event === 'SIGNED_OUT') {
      console.log('用户已退出');
      authStore.user = null;
      authStore.isLoggedIn = false;
    }
  });

  app.mount('#app');

  setTimeout(() => {
    const appDiv = document.getElementById('app');
    if (appDiv && appDiv.children.length === 0) {
      appDiv.innerHTML = '<div style="padding:20px;color:red">DEBUG: App mounted but no content rendered. Check console for errors.</div>';
    }
  }, 1000);
};

void mountApp();
