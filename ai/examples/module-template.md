# Module Template

## 标准模块目录

```text
src/
├─ api/
│  └─ system/
│     └─ user.ts
├─ router/
│  └─ routes/
│     └─ modules/
│        └─ system.ts
└─ views/
   └─ system/
      └─ user/
         ├─ list.vue
         ├─ data.ts
         └─ modules/
            └─ form.vue
```

## 模块职责映射

- `user.ts`：定义 `SystemUserApi` 与 CRUD 请求
- `list.vue`：定义页面、表格、操作事件、弹窗连接
- `data.ts`：定义 columns、schema、options
- `form.vue`：定义新增/编辑表单
- `system.ts`：接入新路由

## 选样板建议

- 普通分页 CRUD：参考 `apps/web-antd/src/views/system/role`
- 树形 CRUD：参考 `apps/web-antd/src/views/system/dept` 或 `apps/web-antd/src/views/system/menu`
- 动态表单较复杂：优先参考 `apps/web-antd/src/views/system/menu/modules/form.vue`

## 推荐搭配阅读

- `ai/examples/web-antd-new-module-copy-guide.md`
- `ai/patterns/crud-page-pattern.md`
- `ai/checklists/frontend-delivery-checklist.md`
