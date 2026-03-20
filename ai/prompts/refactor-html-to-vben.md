# Refactor HTML to Vben Prompt

请把现有页面改造成当前仓库的 vben 风格实现。

要求：

- 不保留“纯 HTML 拼页面”的组织方式
- 优先改造成 `Page + Grid + FormDrawer/FormModal + useVbenForm` 模式
- 参考 `playground/src/views/system/*` 的文件结构与交互方式
- 能抽到 `data.ts` 的列、schema、options 就不要塞在 `list.vue`
- API 请求移到 `src/api/*`
- 路由、权限、标题、文案同步整理

请输出：

- 原实现存在的结构问题
- 改造后的 vben 组织方式
- 关键代码改动
- 剩余风险
