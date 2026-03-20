# Project Structure

## 仓库中的关键区域

### `playground/src`

这是 AI 学习和参考 vben 实战模式的首选区域。

- `views/system/*`：真实 CRUD 模块样板
- `views/examples/*`：中等复杂度示例
- `views/demos/*`：单一能力或组件演示
- `api/system/*`：业务接口与类型定义
- `router/routes/modules/system.ts`：模块路由样板

### `apps/web-antd/src`

这是面向实际应用的 web 端目录。需要落地到业务应用时，应参考这里的应用入口、布局、路由和 store 组织。

### `docs/vben-components/*`

这是组件能力文档，适合在已经确定要用哪个组件后补查细节，不适合作为页面结构第一参考。

## 标准业务模块结构

以 `playground/src/views/system/menu` 为基准：

```text
views/system/<module>/
├─ list.vue
├─ data.ts
└─ modules/
   └─ form.vue
```

对应的周边文件：

```text
api/system/<module>.ts
router/routes/modules/system.ts
```

## 每个文件的职责

- `list.vue`：页面入口，承载 Page、Grid、Drawer/Modal、按钮事件、刷新闭环
- `data.ts`：表格列定义、查询表单 schema、常量 options
- `modules/form.vue`：新增/编辑表单，负责校验、回填、提交
- `api/system/<module>.ts`：类型定义和 CRUD 请求
- `router/routes/modules/system.ts`：路由入口、标题、图标、菜单层级

## 推荐参考样板

- 列表 + 查询 + Drawer 表单：`playground/src/views/system/role/*`
- 树表格 + Drawer 表单：`playground/src/views/system/menu/*`
- 树表格 + Modal 表单：`playground/src/views/system/dept/*`
