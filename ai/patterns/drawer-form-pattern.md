# Drawer Form Pattern

## 适用场景

- 列表页上的新增和编辑
- 字段较多，但仍属于当前页面上下文
- 需要保留列表状态，不适合整页跳转

## 参考样板

- `playground/src/views/system/role/modules/form.vue`
- `playground/src/views/system/menu/modules/form.vue`

## 标准做法

1. 用 `useVbenDrawer` 连接 `modules/form.vue`
2. 在 `onOpenChange` 中读取 `drawerApi.getData()`
3. 打开时重置或回填表单
4. 提交前 `validate`
5. 提交过程中 `lock`
6. 成功后 `close` 并 `emit('success')`

## 必查点

- 是否存在编辑回填遗漏
- 是否需要前端临时字段和提交前清洗
- 是否在失败时正确 `unlock`
- 是否在关闭重开时避免脏数据残留
