# AGENTS.md

## Project Focus

- Primary admin app: `apps/web-antd`
- UI framework: `ant-design-vue`
- Primary implementation target: all real business backend modules should be added under `apps/web-antd`
- Primary pattern source: `playground`

## Required Read Order

Before making non-trivial changes, read these files in order:

1. `ai/README.md`
2. `ai/rules/ai-rules.md`
3. `ai/rules/project-structure.md`
4. `ai/rules/naming-conventions.md`
5. The closest matching file under `playground/src/views/system/*`

If the task is CRUD-related, also read:

- `ai/patterns/crud-page-pattern.md`
- `ai/patterns/drawer-form-pattern.md`
- `ai/patterns/api-types-pattern.md`
- `ai/patterns/route-permission-pattern.md`

## Source of Truth

### For real implementation

Use `apps/web-antd/src` as the destination for production-facing code.

### For implementation patterns

Use `playground/src/views/system/*` as the first reference for CRUD module structure and interaction flow.

Reference priority:

1. `playground/src/views/system/*`
2. `playground/src/views/examples/*`
3. `playground/src/views/demos/*`
4. `docs/vben-components/*`

## Web Antd Working Rules

When working on this repository, assume `web-antd` is the default target unless the user explicitly asks for another app.

New backend modules should usually be added in:

- `apps/web-antd/src/views/<domain>/<module>/`
- `apps/web-antd/src/api/<domain>/<module>.ts`
- `apps/web-antd/src/router/routes/modules/*.ts`

Prefer the same organizational pattern proven in `playground`:

```text
views/<domain>/<module>/
├─ list.vue
├─ data.ts
└─ modules/
   └─ form.vue
```

## Required Vben Patterns

Prefer these building blocks unless there is a strong reason not to:

- `Page`
- `useVbenVxeGrid`
- `useVbenDrawer`
- `useVbenModal`
- `useVbenForm`
- `requestClient`

Do not introduce a custom page architecture when an existing vben pattern already fits.

## CRUD Implementation Default

For CRUD pages in `apps/web-antd`, follow this default process:

1. Find the closest sample in `playground/src/views/system/menu`, `role`, or `dept`
2. Recreate the same file split in `apps/web-antd`
3. Move table columns, form schema, and options into `data.ts`
4. Keep API types and request functions together in `src/api`
5. Add or update route registration in `src/router/routes/modules/*`
6. Verify create, edit, delete, refresh, and form reset flow

## Naming Rules

Use existing repo naming unless the surrounding code clearly uses another convention.

Preferred names:

- `list.vue`
- `data.ts`
- `modules/form.vue`
- `Grid`, `gridApi`
- `Form`, `formApi`
- `FormDrawer`, `formDrawerApi`
- `FormModal`, `formModalApi`
- `onCreate`, `onEdit`, `onDelete`, `onRefresh`, `onActionClick`
- `getXxxList`, `createXxx`, `updateXxx`, `deleteXxx`

## API and Type Rules

- Keep request code under `apps/web-antd/src/api/*`
- Use `requestClient`
- Prefer colocating namespace types and API functions in the same file
- Avoid redefining entity interfaces inside page files when they already belong in API modules
- If the form uses temporary frontend-only fields, clean them before submit

## Route and Permission Rules

- Add routes in `apps/web-antd/src/router/routes/modules/*`
- Keep route names in PascalCase
- Keep path and component paths aligned with the module directory
- If the feature touches menu, auth, or permission behavior, verify route meta and backend fields together

## What To Avoid

- Do not build pages as raw HTML-first screens if a vben pattern applies
- Do not keep all table, schema, and API logic inside one `list.vue`
- Do not invent a new folder structure for each module
- Do not bypass `playground` references and guess the implementation style from memory
- Do not add unrelated refactors during a focused feature task

## Delivery Checklist

Before finishing, check:

- structure matches existing vben style
- target app is `apps/web-antd`
- pattern reference came from `playground`
- API, types, route, page flow are consistent
- create, edit, delete, refresh, reset, and error flow are complete
- user-facing text and naming stay consistent

## Prompting Hint For Codex

If the user asks for a new module and the requirement is not highly specialized, default to this interpretation:

- implement in `apps/web-antd`
- use `playground/src/views/system/*` as the template source
- follow the documents under `ai/`
