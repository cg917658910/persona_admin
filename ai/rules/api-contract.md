# API Contract

## 统一约定

- 所有请求通过 `requestClient` 发起
- API 文件集中在 `src/api/*`
- 类型和接口函数放在同一个模块文件中
- 实体主键默认命名为 `id`

## 推荐结构

```ts
export namespace XxxApi {
  export interface XxxItem {
    id: string;
    name: string;
  }
}

async function getXxxList(params?: Recordable<any>) {}
async function getXxxDetail(id: string) {}
async function createXxx(data: Omit<XxxApi.XxxItem, 'id'>) {}
async function updateXxx(id: string, data: Omit<XxxApi.XxxItem, 'id'>) {}
async function deleteXxx(id: string) {}
```

## 列表接口

- 普通分页表格：接收 `page`、`pageSize` 和查询参数
- 树结构表格：通常直接返回数组，不开启分页
- `useVbenVxeGrid` 的 `proxyConfig.ajax.query` 返回值必须与表格场景匹配

## 表单接口

- 新增和编辑尽量共用一个 `form.vue`
- 编辑时优先通过 `drawerApi.getData()` 或 `modalApi.getData()` 回填
- 提交前先 `validate`

## 字段处理

- 前端临时字段允许存在，但提交前要清洗
- 示例：`linkSrc` 仅供表单编辑使用，提交前映射回 `meta.link` 或 `meta.iframeSrc`

## 变更同步

改动接口时，至少同步检查：

- `api/*.ts` 类型
- `data.ts` 列定义和 options
- `form.vue` schema
- `list.vue` 调用方式
- route 和国际化文案
