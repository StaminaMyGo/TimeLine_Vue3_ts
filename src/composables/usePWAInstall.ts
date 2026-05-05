import { ref, readonly } from 'vue';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const showInstall = ref(false);
const isIos = ref(false);

function detectIos(): boolean {
  const ua = navigator.userAgent || '';
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes('Mac') && 'ontouchend' in document)
  );
}

export function usePWAInstall() {
  const listen = () => {
    isIos.value = detectIos();

    if (isIos.value) {
      const inStandalone = 'standalone' in navigator && (navigator as any).standalone;
      showInstall.value = !inStandalone;
      return;
    }

    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      deferredPrompt.value = e as BeforeInstallPromptEvent;
      showInstall.value = true;
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt.value = null;
      showInstall.value = false;
    });
  };

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt.value) return false;
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    deferredPrompt.value = null;
    showInstall.value = false;
    return outcome === 'accepted';
  };

  const dismiss = () => {
    showInstall.value = false;
  };

  return {
    showInstall: readonly(showInstall),
    isIos: readonly(isIos),
    listen,
    install,
    dismiss,
  };
}
