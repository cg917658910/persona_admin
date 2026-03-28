import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmThemeApi } from '#/api/pm/theme';

import { h } from 'vue';

import { Button, Space, Tag } from 'ant-design-vue';

type ActionClickParams<T> = { code: string; row: T };
type ActionClickFn<T> = (params: ActionClickParams<T>) => void;

export const STATUS_OPTIONS = [
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已归档', value: 'archived' },
];

export const CATEGORY_OPTIONS = [
  { label: '心理结构', value: 'psychology' },
  { label: '命运走向', value: 'destiny' },
];

export const SUBJECT_TYPE_OPTIONS = [
  { label: '人物主题', value: 'character' },
  { label: '关系主题', value: 'relation' },
];

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'keyword',
      label: '关键词',
      componentProps: {
        allowClear: true,
        placeholder: '搜索主题名称 / slug / code / 简介',
      },
    },
    {
      component: 'Select',
      fieldName: 'category',
      label: '分类',
      componentProps: { allowClear: true, options: CATEGORY_OPTIONS },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: { allowClear: true, options: STATUS_OPTIONS },
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Divider',
      fieldName: 'basicDivider',
      formItemClass: 'col-span-2 pb-0',
      hideLabel: true,
      renderComponentContent: () => ({ default: () => '基础信息' }),
    },
    { component: 'Input', fieldName: 'name', label: '名称', rules: 'required' },
    { component: 'Input', fieldName: 'slug', label: 'Slug', rules: 'required' },
    { component: 'Input', fieldName: 'code', label: 'Code', rules: 'required' },
    {
      component: 'Select',
      fieldName: 'subjectType',
      label: '主题类型',
      defaultValue: 'character',
      rules: 'required',
      componentProps: { options: SUBJECT_TYPE_OPTIONS },
    },
    {
      component: 'Select',
      fieldName: 'category',
      label: '分类',
      componentProps: { allowClear: true, options: CATEGORY_OPTIONS },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      defaultValue: 'draft',
      componentProps: { options: STATUS_OPTIONS },
    },
    {
      component: 'Input',
      fieldName: 'coverUrl',
      label: '封面图',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'summary',
      label: '简介',
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      component: 'InputNumber',
      fieldName: 'sortOrder',
      label: '排序',
      defaultValue: 100,
      componentProps: { min: 0, style: { width: '100%' } },
    },
    {
      component: 'Divider',
      fieldName: 'membersDivider',
      formItemClass: 'col-span-2 pb-0',
      hideLabel: true,
      renderComponentContent: () => ({ default: () => '主题成员' }),
    },
    {
      component: 'Input',
      fieldName: 'characterSlugs',
      label: '人物成员',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'relationSlugs',
      label: '关系成员',
      formItemClass: 'col-span-2',
    },
  ];
}

export function useColumns<T = PmThemeApi.ThemeItem>(
  onActionClick: ActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { field: 'name', title: '名称', minWidth: 180 },
    { field: 'code', title: 'Code', width: 140 },
    {
      field: 'subjectType',
      title: '主题类型',
      width: 110,
      slots: {
        default: ({ row }: any) =>
          h(
            Tag,
            { color: row.subjectType === 'relation' ? 'purple' : 'gold' },
            () => (row.subjectType === 'relation' ? '关系主题' : '人物主题'),
          ),
      },
    },
    { field: 'category', title: '分类', width: 120 },
    { field: 'sortOrder', title: '排序', width: 90 },
    { field: 'summary', title: '简介', minWidth: 240 },
    {
      field: 'characterSlugs',
      title: '人物',
      width: 80,
      formatter: ({ cellValue }: any) => (cellValue || []).length,
    },
    {
      field: 'relationSlugs',
      title: '关系',
      width: 80,
      formatter: ({ cellValue }: any) => (cellValue || []).length,
    },
    {
      field: 'status',
      title: '状态',
      width: 90,
      slots: {
        default: ({ row }: any) =>
          h(
            Tag,
            {
              color:
                row.status === 'published'
                  ? 'green'
                  : row.status === 'archived'
                    ? 'default'
                    : 'gold',
            },
            () =>
              row.status === 'published'
                ? '已发布'
                : row.status === 'archived'
                  ? '已归档'
                  : '草稿',
          ),
      },
    },
    {
      align: 'center',
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 180,
      slots: {
        default: ({ row }) =>
          h(Space, {}, () => [
            h(
              Button,
              {
                type: 'link',
                onClick: () => onActionClick({ code: 'edit', row }),
              },
              () => '编辑',
            ),
            h(
              Button,
              {
                danger: true,
                type: 'link',
                onClick: () => onActionClick({ code: 'delete', row }),
              },
              () => '删除',
            ),
          ]),
      },
    },
  ];
}
