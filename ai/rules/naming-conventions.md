# Naming Conventions

## 目录命名

- 业务模块目录使用短名、小写、中划线或单词名
- 推荐：`system/menu`、`system/role`、`system/dept`
- 不推荐：`SystemMenuPage`、`menuManageList`

## 文件命名

- 列表页：`list.vue`
- 数据定义：`data.ts`
- 表单模块：`modules/form.vue`
- 接口文件：`api/system/<module>.ts`

## 组件与变量命名

- 抽屉组件：`FormDrawer`
- 弹窗组件：`FormModal`
- 抽屉 API：`formDrawerApi`
- 弹窗 API：`formModalApi`
- 表格组件：`Grid`
- 表格 API：`gridApi`
- 表单组件：`Form`
- 表单 API：`formApi`

## 函数命名

- 查询刷新：`onRefresh` 或 `refreshGrid`
- 新建：`onCreate`
- 编辑：`onEdit`
- 删除：`onDelete`
- 新增下级：`onAppend`
- 状态切换：`onStatusChange`
- 通用操作分发：`onActionClick`

## API 命名

- 列表：`getXxxList`
- 详情：`getXxxDetail`
- 创建：`createXxx`
- 更新：`updateXxx`
- 删除：`deleteXxx`
- 校验存在：`isXxxExists`

## 类型命名

- 使用 namespace：`SystemMenuApi`、`SystemRoleApi`
- 实体类型：`SystemMenu`、`SystemRole`
- 尽量避免在页面文件里重复声明接口类型

## 路由命名

- 模块根：`System`
- 子路由：`SystemMenu`、`SystemRole`、`SystemDept`
- route name 使用 PascalCase，path 使用 kebab 或扁平路径
