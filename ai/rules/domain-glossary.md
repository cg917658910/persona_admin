# Domain Glossary

## 业务词汇

- `menu`：菜单、目录、外链、内嵌页面、按钮权限的统一抽象
- `role`：角色，通常关联权限集合
- `dept`：部门，通常是树形结构
- `authCode`：后端权限标识
- `meta`：路由或菜单附加配置，如标题、图标、徽标、缓存等

## 页面结构词汇

- `list.vue`：模块主页面
- `data.ts`：列配置、表单 schema、选项常量
- `modules/form.vue`：新增/编辑表单容器
- `Page`：vben 标准页面容器
- `Grid`：通过 `useVbenVxeGrid` 创建的表格组件
- `FormDrawer` / `FormModal`：通过 `useVbenDrawer` / `useVbenModal` 连接的业务表单

## 交互词汇

- `query`：刷新表格数据
- `keepSource`：保留表格原始数据，便于编辑和状态追踪
- `treeConfig`：树表格配置
- `proxyConfig`：把表格查询和接口调用联通

## AI 应如何理解这些词

- 看到 `system/*`，默认按后台管理 CRUD 模块处理
- 看到 `meta.*`，优先联想到 route/menu 扩展字段，而不是普通表单平铺字段
- 看到 `modules/form.vue`，默认这是新增和编辑共用的业务表单
