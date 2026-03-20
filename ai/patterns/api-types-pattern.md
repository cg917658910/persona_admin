# API Types Pattern

## 目标

让接口定义、类型定义、页面调用三者保持同源。

## 参考样板

- `playground/src/api/system/menu.ts`
- `playground/src/api/system/role.ts`

## 推荐写法

- 使用 `namespace XxxApi`
- 在 namespace 内定义实体类型
- 在同文件导出 CRUD 函数
- 页面侧通过 `XxxApi.XxxItem` 或类似类型引用

## 设计原则

- 页面不要自己重复声明同一份实体结构
- 接口层允许保留少量业务映射逻辑，但不要夹杂页面交互逻辑
- 前端临时字段应在表单提交前清洗，而不是污染通用类型
