# AI Knowledge Pack for Vben

这套目录用于让 AI Codex 在这个仓库以及后续基于 vben 的项目里，快速进入统一开发方式。

## 阅读顺序

1. `rules/ai-rules.md`
2. `rules/project-structure.md`
3. `rules/naming-conventions.md`
4. `patterns/crud-page-pattern.md`
5. `patterns/drawer-form-pattern.md`
6. `examples/web-antd-new-module-copy-guide.md`

## 当前仓库的参考优先级

1. `playground/src/views/system/*`
2. `apps/web-antd/src/views/system/*`
3. `playground/src/views/examples/*`
4. `playground/src/views/demos/*`
5. `docs/vben-components/*`

## 核心原则

- 优先复用 vben 现有模式，不自创页面骨架。
- 优先参考 `playground` 的真实案例，不凭印象猜 API 和组件用法。
- 在 `web-antd` 落地时，优先复用已经接好的 `apps/web-antd/src/views/system/*` 模板。
- 新增业务模块时，默认沿用 `list.vue + data.ts + modules/form.vue + api/*.ts + route` 的结构。
- 改代码时同时维护类型、路由、文案、权限和交互闭环。

## 适用场景

- 新建 CRUD 模块
- 新建详情页或详情弹窗
- 将已有页面改造成 vben 风格
- Review vben 模块实现质量
- 带上下文修复 bug

## 推荐工作流

1. 先读 `rules/`
2. 再选一个最接近的 `patterns/`
3. 如果目标是 `web-antd`，先读 `examples/web-antd-new-module-copy-guide.md`
4. 然后直接复用 `prompts/` 中的任务模板
5. 交付前跑 `checklists/`
