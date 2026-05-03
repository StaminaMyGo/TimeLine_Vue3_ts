import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
app.config.errorHandler = (err: any) => {
  document.getElementById('app')!.innerHTML = '<pre style="color:red">ERROR: ' + (err?.stack || err?.message || String(err)) + '</pre>';
};
app.use(createPinia());
app.mount('#app');

// DEBUG: if still empty after mount, insert fallback text
setTimeout(() => {
  const appDiv = document.getElementById('app');
  if (appDiv && appDiv.children.length === 0) {
    appDiv.innerHTML = '<div style="padding:20px;color:red">DEBUG: App mounted but no content rendered. Check console for errors.</div>';
  }
}, 1000);