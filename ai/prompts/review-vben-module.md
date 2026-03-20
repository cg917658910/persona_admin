# Review Vben Module Prompt

请对这个 vben 模块做代码评审，重点检查是否符合当前仓库的样板模式。

评审重点：

- 是否遵循 `list.vue + data.ts + modules/form.vue + api + route`
- 是否优先复用 vben 现有组件和 hooks
- API、类型、路由、表单、表格是否一致
- 是否有可复用逻辑却被散落在页面中
- 是否引入了偏离项目风格的新模式
- 是否遗漏权限、国际化、状态刷新、提交锁定等闭环

输出格式：

- Findings first
- 给出严重级别
- 指出参考的仓库样板文件
- 如果没有问题，也说明残余风险和测试空缺
