<template>
  <div class="blog-page" id="blog-top">
    <header class="blog-header">
      <a class="brand" href="#/blog" aria-label="LyY 个人博客">LyY</a>
      <nav class="top-nav" aria-label="博客导航">
        <a href="#/blog" class="nav-link">搜索</a>
        <a href="#/blog" class="nav-link active">首页</a>
        <a href="#/engineering" class="nav-link line-link">工程线</a>
        <a href="#/exam" class="nav-link line-link">考研线</a>
        <a href="#/blog" class="nav-link">标签</a>
        <a href="#/blog" class="nav-link">分类</a>
        <a href="#/blog" class="nav-link">友情链接</a>
      </nav>
    </header>

    <main class="blog-shell">
      <section class="content-column" aria-label="文章列表">
        <div class="post-grid">
          <article v-for="post in paginatedPosts" :key="post.id" class="post-card">
            <div class="post-avatar" aria-hidden="true">{{ post.avatar }}</div>
            <h2>{{ post.title }}</h2>
            <p class="published">发表于 {{ post.date }}</p>
            <div class="tag-row">
              <span v-for="tag in post.tags" :key="tag" class="tag-pill">{{ tag }}</span>
            </div>
          </article>
        </div>

        <nav class="pagination" aria-label="分页">
          <button class="page-button" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
            ‹
          </button>
          <button
            v-for="page in pageCount"
            :key="page"
            class="page-button"
            :class="{ current: currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button class="page-button" :disabled="currentPage === pageCount" @click="goToPage(currentPage + 1)">
            ›
          </button>
        </nav>
      </section>

      <aside class="blog-sidebar" aria-label="侧边栏">
        <section class="profile-card glass-card">
          <div class="profile-avatar">LyY</div>
          <h2>LyY</h2>
          <div class="profile-stats">
            <div>
              <strong>{{ posts.length }}</strong>
              <span>文章数</span>
            </div>
            <div>
              <strong>{{ uniqueTags.length }}</strong>
              <span>标签数</span>
            </div>
            <div>
              <strong>{{ categories.length }}</strong>
              <span>分类数</span>
            </div>
          </div>
          <div class="social-links">
            <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.8 1.2 1.8 1.2 1 .1.6 2.1 3.4 1.5.1-.7.4-1.2.7-1.5-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
              </svg>
            </a>
            <a href="https://gitee.com/" target="_blank" rel="noreferrer" aria-label="Gitee">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 0 20h4.9a3.1 3.1 0 0 0 3.1-3.1v-6.8H11v3.1h5.7v3a.7.7 0 0 1-.7.7h-4A6.9 6.9 0 1 1 18.6 10H12a2.9 2.9 0 0 0-2.9 2.9V15h3.1v-1.2a.7.7 0 0 1 .7-.7H22V12A10 10 0 0 0 12 2Z" />
              </svg>
            </a>
          </div>
        </section>

        <section class="glass-card list-card">
          <h2>分类</h2>
          <div class="compact-list">
            <span v-for="category in visibleCategories" :key="category" class="compact-pill">
              {{ category }}
            </span>
          </div>
        </section>

        <section class="glass-card list-card">
          <h2>标签</h2>
          <div class="compact-list">
            <span v-for="tag in visibleTags" :key="tag" class="compact-pill">
              {{ tag }}
            </span>
          </div>
        </section>

        <section class="glass-card site-info">
          <h2>网站资讯</h2>
          <dl>
            <div>
              <dt>文章数目 :</dt>
              <dd>{{ posts.length }}</dd>
            </div>
            <div>
              <dt>本站访客数 :</dt>
              <dd>4884</dd>
            </div>
            <div>
              <dt>本站总访问量 :</dt>
              <dd>9895</dd>
            </div>
            <div>
              <dt>最近更新时间 :</dt>
              <dd>2026-05-05</dd>
            </div>
          </dl>
        </section>
      </aside>
    </main>

    <div class="fixed-actions" aria-label="快捷操作">
      <button type="button" title="设置" aria-label="设置">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.4 13.5c.1-.5.1-1 .1-1.5s0-1-.1-1.5l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2.6-1.5L14 2h-4l-.4 2.5A7 7 0 0 0 7 6L4.6 5l-2 3.5 2 1.5a9.7 9.7 0 0 0 0 3l-2 1.5 2 3.5L7 18a7 7 0 0 0 2.6 1.5L10 22h4l.4-2.5A7 7 0 0 0 17 18l2.4 1 2-3.5-2-1.5ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
        </svg>
      </button>
      <button type="button" title="返回顶部" aria-label="返回顶部" @click="scrollTop">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5 5 12l1.8 1.8L10.7 10v9h2.6v-9l3.9 3.8L19 12l-7-7Z" />
        </svg>
      </button>
    </div>

    <footer class="blog-footer">
      <p>©2026 - 2027 By LyY</p>
      <p>人和程序，总有一个要跑。</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  tags: string[];
  category: string;
  avatar: string;
}

const pageSize = 12;
const currentPage = ref(1);

const posts: BlogPost[] = [
  { id: 1, title: 'Vue3 组合式 API 实践笔记', date: '2026-05-05', tags: ['Vue3', 'TypeScript'], category: '前端工程', avatar: 'V' },
  { id: 2, title: 'Pinia 状态管理拆分思路', date: '2026-05-04', tags: ['Pinia', '状态管理'], category: '前端工程', avatar: 'P' },
  { id: 3, title: 'Vite 项目部署到 GitHub Pages', date: '2026-05-03', tags: ['Vite', '部署'], category: '工程化', avatar: 'G' },
  { id: 4, title: 'MySQL 事务与隔离级别复盘', date: '2026-05-02', tags: ['MySQL', '数据库'], category: '数据库', avatar: 'M' },
  { id: 5, title: 'Supabase 登录状态恢复记录', date: '2026-05-01', tags: ['Supabase', 'Auth'], category: '后端服务', avatar: 'S' },
  { id: 6, title: 'CSS 毛玻璃卡片的可读性控制', date: '2026-04-30', tags: ['CSS', 'UI'], category: '界面设计', avatar: 'C' },
  { id: 7, title: '时间线数据排序与分页策略', date: '2026-04-29', tags: ['分页', '数据结构'], category: '数据处理', avatar: 'T' },
  { id: 8, title: 'TypeScript 类型收窄小结', date: '2026-04-28', tags: ['TypeScript', '类型'], category: '前端工程', avatar: 'T' },
  { id: 9, title: '路由切换时的页面状态保留', date: '2026-04-27', tags: ['路由', 'Vue3'], category: '前端工程', avatar: 'R' },
  { id: 10, title: '组件样式作用域的取舍', date: '2026-04-26', tags: ['组件', 'CSS'], category: '界面设计', avatar: 'S' },
  { id: 11, title: '学习记录表单交互优化', date: '2026-04-25', tags: ['表单', '交互'], category: '产品细节', avatar: 'F' },
  { id: 12, title: 'Git 提交流程与分支命名', date: '2026-04-24', tags: ['Git', '工作流'], category: '工程化', avatar: 'B' },
  { id: 13, title: 'Markdown 笔记结构整理', date: '2026-04-23', tags: ['Markdown', '笔记'], category: '知识管理', avatar: 'N' },
  { id: 14, title: 'HTTP 缓存头基础复习', date: '2026-04-22', tags: ['HTTP', '网络'], category: '计算机基础', avatar: 'H' },
  { id: 15, title: '异步请求错误提示设计', date: '2026-04-21', tags: ['异步', '错误处理'], category: '产品细节', avatar: 'E' },
  { id: 16, title: '数据库索引命中排查', date: '2026-04-20', tags: ['索引', 'MySQL'], category: '数据库', avatar: 'I' },
  { id: 17, title: '组件拆分前先看数据流', date: '2026-04-19', tags: ['组件', '架构'], category: '前端工程', avatar: 'A' },
  { id: 18, title: '页面空状态的表达方式', date: '2026-04-18', tags: ['UI', '空状态'], category: '界面设计', avatar: 'U' },
  { id: 19, title: '本地开发环境排错清单', date: '2026-04-17', tags: ['调试', '环境'], category: '工程化', avatar: 'D' },
  { id: 20, title: '从需求描述到页面骨架', date: '2026-04-16', tags: ['需求', '页面设计'], category: '产品细节', avatar: 'L' },
  { id: 21, title: '算法题里的边界条件', date: '2026-04-15', tags: ['算法', '边界条件'], category: '计算机基础', avatar: 'A' },
  { id: 22, title: '接口字段命名保持一致', date: '2026-04-14', tags: ['接口', '命名'], category: '后端服务', avatar: 'I' },
  { id: 23, title: '小步重构的提交颗粒度', date: '2026-04-13', tags: ['重构', 'Git'], category: '工程化', avatar: 'R' },
  { id: 24, title: '博客侧边栏信息组织', date: '2026-04-12', tags: ['博客', '布局'], category: '界面设计', avatar: 'B' },
  { id: 25, title: '登录态与匿名数据隔离', date: '2026-04-11', tags: ['Auth', '数据安全'], category: '后端服务', avatar: 'L' },
  { id: 26, title: '响应式网格的断点选择', date: '2026-04-10', tags: ['响应式', 'CSS'], category: '界面设计', avatar: 'R' },
];

const uniqueTags = computed(() => Array.from(new Set(posts.flatMap((post) => post.tags))));
const categories = computed(() => Array.from(new Set(posts.map((post) => post.category))));
const visibleTags = computed(() => withOverflow(uniqueTags.value));
const visibleCategories = computed(() => withOverflow(categories.value));
const pageCount = computed(() => Math.ceil(posts.length / pageSize));
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return posts.slice(start, start + pageSize);
});

function withOverflow(items: string[]) {
  return items.length > 5 ? [...items.slice(0, 4), '...'] : items;
}

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), pageCount.value);
  document.getElementById('blog-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollTop() {
  document.getElementById('blog-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
</script>

<style scoped>
:global(body) {
  margin: 0;
}

.blog-page {
  min-height: 100vh;
  color: #1f2937;
  background:
    linear-gradient(135deg, rgba(255, 250, 240, 0.96), rgba(250, 245, 232, 0.92)),
    #fffaf0;
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
  overflow-x: hidden;
}

.blog-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  padding: 0 64px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.24);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  box-sizing: border-box;
}

.brand {
  color: #111827;
  font-size: 30px;
  font-weight: 800;
  text-decoration: none;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 22px;
  font-size: 17px;
  font-weight: 700;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  color: #334155;
  text-decoration: none;
  transition: color 0.18s ease, transform 0.18s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #0891b2;
}

.nav-link.line-link {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid rgba(20, 184, 166, 0.32);
  border-radius: 8px;
  background: rgba(240, 253, 250, 0.7);
  color: #0f766e;
  box-sizing: border-box;
}

.nav-link.line-link:hover {
  color: #fff;
  background: #0891b2;
  border-color: #0891b2;
}

.blog-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 28px;
  width: min(1680px, calc(100vw - 132px));
  margin: 34px auto 0;
  padding-right: 34px;
  box-sizing: border-box;
}

.content-column {
  min-width: 0;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.post-card,
.glass-card {
  border: 1px solid rgba(255, 255, 255, 0.68);
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.11);
  backdrop-filter: blur(18px);
}

.post-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 168px;
  padding: 24px 22px;
  border-radius: 8px;
  box-sizing: border-box;
  overflow: hidden;
}

.post-card::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: linear-gradient(180deg, #0ea5a3, #8b5cf6);
  opacity: 0.82;
}

.post-card h2 {
  position: relative;
  z-index: 1;
  margin: 0;
  padding-right: 42px;
  color: #0f172a;
  font-size: 20px;
  line-height: 1.36;
}

.published {
  position: relative;
  z-index: 1;
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.tag-row {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.tag-pill,
.compact-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #0f766e;
  font-weight: 700;
  line-height: 1;
}

.tag-pill {
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid rgba(14, 165, 163, 0.24);
  background: rgba(240, 253, 250, 0.74);
  font-size: 13px;
}

.compact-pill {
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid rgba(20, 184, 166, 0.32);
  background: rgba(240, 253, 250, 0.62);
  font-size: 14px;
}

.post-avatar,
.profile-avatar {
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 800;
  background: linear-gradient(135deg, #0f766e, #8b5cf6);
  box-shadow: 0 12px 28px rgba(14, 116, 144, 0.26);
}

.post-avatar {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-size: 17px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin: 32px 0 28px;
}

.page-button {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border: 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.82);
  color: #64748b;
  font-size: 19px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
}

.page-button.current {
  background: #0ea5a3;
  color: #fff;
}

.page-button:disabled {
  opacity: 0.42;
  cursor: not-allowed;
}

.blog-sidebar {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.glass-card {
  border-radius: 8px;
  padding: 24px;
  box-sizing: border-box;
}

.profile-card {
  text-align: center;
}

.profile-avatar {
  width: 88px;
  height: 88px;
  margin: 0 auto 14px;
  border-radius: 50%;
  font-size: 24px;
}

.profile-card h2,
.list-card h2,
.site-info h2 {
  margin: 0 0 18px;
  color: #111827;
  font-size: 22px;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0;
}

.profile-stats div {
  display: grid;
  gap: 6px;
}

.profile-stats strong {
  color: #0f172a;
  font-size: 24px;
}

.profile-stats span {
  color: #64748b;
  font-size: 13px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 18px;
}

.social-links a {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #0f172a;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.1);
}

.social-links svg,
.fixed-actions svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
}

.compact-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.site-info dl {
  display: grid;
  gap: 16px;
  margin: 0;
}

.site-info dl div {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  color: #334155;
  font-size: 16px;
}

.site-info dt,
.site-info dd {
  margin: 0;
}

.site-info dd {
  font-weight: 700;
}

.fixed-actions {
  position: fixed;
  right: 22px;
  bottom: 68px;
  z-index: 30;
  display: grid;
  gap: 10px;
}

.fixed-actions button {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: #0ea5e9;
  cursor: pointer;
  box-shadow: 0 14px 30px rgba(14, 165, 233, 0.28);
}

.blog-footer {
  display: grid;
  gap: 8px;
  place-items: center;
  padding: 16px 20px 34px;
  color: #0f172a;
  font-size: 16px;
}

.blog-footer p {
  margin: 0;
}

@media (max-width: 1280px) {
  .blog-header {
    padding: 0 36px;
  }

  .blog-shell {
    grid-template-columns: minmax(0, 1fr) 300px;
    width: min(1180px, calc(100vw - 60px));
    padding-right: 30px;
  }

  .post-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .blog-header {
    position: static;
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
    padding: 18px 22px;
  }

  .top-nav {
    flex-wrap: wrap;
    gap: 16px 22px;
  }

  .blog-shell {
    grid-template-columns: 1fr;
    width: calc(100vw - 28px);
    padding-right: 0;
    margin-top: 22px;
  }

  .post-grid {
    grid-template-columns: 1fr;
  }

  .fixed-actions {
    right: 14px;
    bottom: 24px;
  }
}

.blog-page {
  color: var(--clay-ink);
  background:
    radial-gradient(circle at 90% 10%, rgba(255, 77, 139, 0.14), transparent 30%),
    radial-gradient(circle at 12% 76%, rgba(164, 212, 197, 0.24), transparent 32%),
    var(--clay-canvas);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
}

.blog-header {
  min-height: 64px;
  border-bottom: 1px solid var(--clay-hairline);
  background: var(--clay-canvas);
  box-shadow: none;
  backdrop-filter: none;
}

.brand {
  color: var(--clay-ink);
  font-size: 28px;
  font-weight: 600;
}

.top-nav {
  font-size: 14px;
  font-weight: 500;
}

.nav-link {
  color: var(--clay-body);
}

.nav-link:hover,
.nav-link.active {
  color: var(--clay-ink);
}

.nav-link.line-link {
  min-height: 38px;
  border-color: var(--clay-hairline);
  border-radius: var(--clay-radius-md);
  background: var(--clay-surface-card);
  color: var(--clay-ink);
  font-weight: 600;
}

.nav-link.line-link:hover {
  border-color: var(--clay-primary);
  background: var(--clay-primary);
  color: #fff;
}

.blog-shell {
  width: min(1280px, calc(100vw - 64px));
  margin-top: 32px;
  padding-right: 32px;
}

.post-card,
.glass-card {
  border: 1px solid var(--clay-hairline);
  background: var(--clay-surface-card);
  box-shadow: none;
  backdrop-filter: none;
}

.post-card {
  min-height: 184px;
  padding: 28px;
  border-radius: var(--clay-radius-xl);
}

.post-card::before {
  display: none;
}

.post-card:nth-child(6n + 1) {
  background: var(--clay-brand-pink);
  color: #fff;
}

.post-card:nth-child(6n + 2) {
  background: var(--clay-brand-teal);
  color: #fff;
}

.post-card:nth-child(6n + 3) {
  background: var(--clay-brand-lavender);
}

.post-card:nth-child(6n + 4) {
  background: var(--clay-brand-peach);
}

.post-card:nth-child(6n + 5) {
  background: var(--clay-brand-ochre);
}

.post-card h2 {
  color: currentColor;
  font-size: 20px;
  font-weight: 600;
}

.published {
  color: currentColor;
  opacity: 0.74;
}

.tag-pill,
.compact-pill {
  border-color: var(--clay-hairline);
  background: var(--clay-canvas);
  color: var(--clay-ink);
  font-weight: 500;
}

.post-avatar,
.profile-avatar {
  background: var(--clay-primary);
  box-shadow: none;
}

.page-button {
  border: 1px solid var(--clay-hairline);
  border-radius: var(--clay-radius-md);
  background: var(--clay-canvas);
  color: var(--clay-ink);
  box-shadow: none;
}

.page-button.current {
  background: var(--clay-primary);
  color: #fff;
}

.glass-card {
  border-radius: var(--clay-radius-xl);
  padding: 28px;
}

.profile-card h2,
.list-card h2,
.site-info h2 {
  color: var(--clay-ink);
  font-size: 24px;
  font-weight: 600;
}

.profile-stats strong,
.social-links a,
.site-info dd {
  color: var(--clay-ink);
}

.profile-stats span,
.site-info dl div {
  color: var(--clay-body);
}

.social-links a {
  border: 1px solid var(--clay-hairline);
  background: var(--clay-canvas);
  box-shadow: none;
}

.fixed-actions button {
  border-radius: var(--clay-radius-md);
  background: var(--clay-primary);
  box-shadow: var(--clay-shadow-soft);
}

.blog-footer {
  margin-top: 32px;
  padding: 32px 20px 40px;
  background: var(--clay-surface-soft);
  color: var(--clay-body);
}
</style>
