export type AppRoute = 'engineering' | 'exam' | 'blog';

const validRoutes: AppRoute[] = ['blog', 'exam'];

export const resolveRoute = (): AppRoute => {
  const raw = window.location.hash
    .replace(/^#\/?/, '')
    .split('?')[0]
    .replace(/\/$/, ''); // 去尾斜杠

  if (validRoutes.includes(raw as AppRoute)) {
    return raw as AppRoute;
  }

  return 'engineering';
};