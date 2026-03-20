# Create CRUD Module Prompt

请基于当前仓库的 vben 结构新增一个后台 CRUD 模块。

要求：

- 优先参考 `playground/src/views/system/menu`、`role`、`dept`
- 按 `list.vue + data.ts + modules/form.vue + api + route` 组织
- 页面容器使用 `Page`
- 表格优先使用 `useVbenVxeGrid`
- 新增/编辑优先使用 `useVbenDrawer`，若更适合可改为 `useVbenModal`
- 表单优先使用 `useVbenForm`
- API 通过 `requestClient` 封装到 `src/api`
- 路由接入到对应的 `router/routes/modules/*.ts`
- 命名与当前仓库一致
- 不要发明新的页面架构

交付内容：

- 完整代码改动
- 说明参考了哪些现有模块
- 说明哪些字段是前端临时字段、哪些字段会在提交前清洗
- 最后给出自测建议
