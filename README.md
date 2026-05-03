# Vue 3 + TypeScript + Vite

## 方案的可拓展性说明
关于路由： 目前数据在 useTimeline 中，未来你可以引入 vue-router，在不同路由组件中调用同一个 useTimeline 实例，数据依然是同步的。

关于分页： 可以在 useTimeline 的 sortedItems 计算属性中加入 slice(page * size, (page + 1) * size) 逻辑，非常容易实现。

关于后端： 如果日后需要后端，只需要在 useTimeline 的 addItem 和 updateItem 中加入 fetch 或 axios 请求即可，组件层代码无需改动。

响应式布局： 侧边栏可以设置在移动端通过按钮弹出（Drawer模式），而主界面的 Flex 布局在手机端依然能保持良好的可读性。