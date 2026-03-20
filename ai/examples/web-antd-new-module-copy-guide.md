# Web Antd New Module Copy Guide

## 目标

在 `apps/web-antd` 中新增后台模块时，不要从零开始写。优先从已经接好的 `system` 模板复制，再按业务字段做替换。

## 默认目标目录

新模块默认落在：

```text
apps/web-antd/src/views/<domain>/<module>/
apps/web-antd/src/api/<domain>/<module>.ts
apps/web-antd/src/router/routes/modules/*.ts
```

如果没有特殊说明，后台管理模块优先放在：

```text
apps/web-antd/src/views/system/<module>/
apps/web-antd/src/api/system/<module>.ts
```

## 先选模板，不要先写代码

### 1. 普通分页 CRUD

优先复制：

- `apps/web-antd/src/views/system/role/list.vue`
- `apps/web-antd/src/views/system/role/data.ts`
- `apps/web-antd/src/views/system/role/modules/form.vue`
- `apps/web-antd/src/api/system/role.ts`

适用场景：

- 有查询表单
- 有分页列表
- 新增和编辑用 Drawer
- 有状态切换

### 2. 树形部门类 CRUD

优先复制：

- `apps/web-antd/src/views/system/dept/list.vue`
- `apps/web-antd/src/views/system/dept/data.ts`
- `apps/web-antd/src/views/system/dept/modules/form.vue`
- `apps/web-antd/src/api/system/dept.ts`

适用场景：

- 树结构数据
- 需要“新增下级”
- 编辑更适合 Modal

### 3. 动态菜单类 CRUD

优先复制：

- `apps/web-antd/src/views/system/menu/list.vue`
- `apps/web-antd/src/views/system/menu/data.ts`
- `apps/web-antd/src/views/system/menu/modules/form.vue`
- `apps/web-antd/src/api/system/menu.ts`

适用场景：

- 字段联动复杂
- 表单中有 `dependencies`
- 涉及 route/meta/icon/component/authCode 这类系统字段

## 标准复制步骤

### Step 1. 复制目录骨架

示例：新增 `system/user`

```text
apps/web-antd/src/views/system/user/
├─ list.vue
├─ data.ts
└─ modules/
   └─ form.vue
```

优先从最接近的 `role / dept / menu` 整体复制，再改名。

### Step 2. 复制 API 文件

示例：

```text
apps/web-antd/src/api/system/user.ts
```

要求：

- 保留 `namespace XxxApi`
- 保留 CRUD 函数成组导出
- 用 `requestClient`
- 不要在页面文件里重复定义实体类型

### Step 3. 接入 API 导出入口

更新：

- `apps/web-antd/src/api/system/index.ts`
- `apps/web-antd/src/api/index.ts`

确保页面里可以统一从 `#/api` 或 `#/api/system/...` 获取类型和函数。

### Step 4. 接入路由

更新：

- `apps/web-antd/src/router/routes/modules/system.ts`

新增子路由时保持：

- `name` 用 PascalCase
- `path` 与目录一致
- `title` 用国际化 key
- `icon` 与系统菜单风格一致

### Step 5. 接入国际化

至少同步检查：

- `apps/web-antd/src/locales/langs/zh-CN/system.json`
- `apps/web-antd/src/locales/langs/en-US/system.json`

新增字段文案时保持中英文 key 一致。

### Step 6. 清理复制痕迹

逐项检查并替换：

- `SystemRoleApi` / `SystemDeptApi` / `SystemMenuApi`
- `getRoleList` / `getDeptList` / `getMenuList`
- 文案 key
- route name
- table title
- drawer/modal title
- 删除确认和状态文案

## 每个文件该改什么

### `list.vue`

保留：

- `Page`
- `Grid`
- `FormDrawer` 或 `FormModal`
- `onCreate` `onEdit` `onDelete` `onRefresh`

替换：

- 查询接口
- 操作按钮文案
- 表格标题
- 特殊交互逻辑

### `data.ts`

保留：

- columns 定义
- 查询 schema
- options 常量

替换：

- 字段名
- label key
- 特殊 formatter
- 联动逻辑

### `modules/form.vue`

保留：

- `useVbenForm`
- `useVbenDrawer` 或 `useVbenModal`
- `onOpenChange` / `onConfirm`
- 成功后 `emit('success')`

替换：

- schema 字段
- 回填逻辑
- 提交前数据清洗
- create/update API

### `api/*.ts`

保留：

- `namespace`
- CRUD 结构
- `requestClient`

替换：

- 实体字段
- URL
- 详情、校验、树结构等业务接口

## 什么时候选 Drawer，什么时候选 Modal

优先 Drawer：

- 字段较多
- 有复杂联动
- 需要更大的编辑空间

优先 Modal：

- 字段较少
- 树结构轻量编辑
- 交互更短平快

当前仓库参考：

- Drawer：`system/role`、`system/menu`
- Modal：`system/dept`

## 复制后必须检查

- 查询是否能正确触发
- 新增成功后是否刷新列表
- 编辑是否正确回填
- 删除后是否刷新
- 表单关闭重开是否残留脏数据
- 国际化 key 是否都存在
- API 导出入口是否补齐
- route 是否已接入

## 给 Codex 的一句话指令

可以直接这样说：

```text
请在 apps/web-antd 里新增一个 system/user 模块。
以 system/role 为主模板，按 list.vue + data.ts + modules/form.vue + api/system/user.ts + system route 的结构实现，并同步补齐国际化。
```

如果是树结构：

```text
请在 apps/web-antd 里新增一个 system/category 模块。
以 system/dept 为主模板实现树形 CRUD，并保留新增下级交互。
```

如果是复杂系统配置：

```text
请在 apps/web-antd 里新增一个 system/resource 模块。
以 system/menu 为主模板，优先复用动态表单和 route/meta 类字段处理方式。
```
