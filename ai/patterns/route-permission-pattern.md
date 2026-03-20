# Route Permission Pattern

## 目标

让路由、菜单、权限字段形成闭环，而不是各写各的。

## 参考样板

- `playground/src/router/routes/modules/system.ts`
- `playground/src/api/system/menu.ts`
- `playground/src/views/system/menu/*`

## 路由规则

- 模块路由集中在 `router/routes/modules/*.ts`
- route `name` 使用 PascalCase
- route `meta` 至少考虑 `title`、`icon`、`order`

## 权限相关

- 按钮或菜单权限优先和 `authCode` 一致
- 当页面字段来自菜单 `meta` 时，要同步理解其在路由/菜单系统中的作用
- 新增模块若涉及权限，需要同时确认后端字段、前端 route meta、页面行为

## AI 常见误区

- 只加页面，不加 route
- 只加 route，不加权限字段
- 把显示文案、权限标识、路由标识混成一个概念
