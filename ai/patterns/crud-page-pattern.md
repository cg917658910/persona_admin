# CRUD Page Pattern

## 目标

标准后台 CRUD 页面优先采用如下组合：

- `Page`
- `useVbenVxeGrid`
- `useVbenDrawer` 或 `useVbenModal`
- `data.ts`
- `api/<module>.ts`

## 参考样板

- `playground/src/views/system/role/list.vue`
- `playground/src/views/system/menu/list.vue`
- `playground/src/views/system/dept/list.vue`

## 推荐骨架

```text
views/system/<module>/
├─ list.vue
├─ data.ts
└─ modules/
   └─ form.vue
```

## list.vue 应负责

- 创建 `FormDrawer` 或 `FormModal`
- 创建 `Grid` 和 `gridApi`
- 绑定查询接口
- 处理 `onCreate`、`onEdit`、`onDelete`、`onRefresh`
- 把成功事件回流到刷新逻辑

## 不要做的事

- 不要把所有列定义都塞进 `list.vue`
- 不要把接口请求直接散写在模板交互里
- 不要在新增和编辑之间拆出两份高度重复的表单页面
