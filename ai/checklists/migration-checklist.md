# Migration Checklist

- 明确原页面属于列表页、详情页还是表单页
- 找到 `playground` 中最接近的样板
- 先迁移结构，再迁移样式细节
- 优先抽离 API、类型、路由
- 优先改造成 `Page`、`Grid`、`Drawer/Modal`、`Form` 组合
- 清理直写 HTML 布局和散落请求
- 对齐命名和目录
- 最后补上刷新、回填、校验、异常处理
