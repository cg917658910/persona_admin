import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmThemeApi } from '#/api/pm/theme';

import { h } from 'vue';

import { Button, Space } from 'ant-design-vue';

type ActionClickParams<T> = { code: string; row: T };
type ActionClickFn<T> = (params: ActionClickParams<T>) => void;

export const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

export const CATEGORY_OPTIONS = [
  { label: 'Psychology', value: 'psychology' },
  { label: 'Destiny', value: 'destiny' },
];

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'keyword',
      label: 'Keyword',
      componentProps: {
        allowClear: true,
        placeholder: 'Search by name / code / category / summary',
      },
    },
    {
      component: 'Select',
      fieldName: 'category',
      label: 'Category',
      componentProps: { allowClear: true, options: CATEGORY_OPTIONS },
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
      renderComponentContent: () => ({ default: () => 'Basic Info' }),
    },
    { component: 'Input', fieldName: 'name', label: 'Name', rules: 'required' },
    { component: 'Input', fieldName: 'slug', label: 'Slug', rules: 'required' },
    { component: 'Input', fieldName: 'code', label: 'Code', rules: 'required' },
    {
      component: 'Select',
      fieldName: 'category',
      label: 'Category',
      componentProps: { allowClear: true, options: CATEGORY_OPTIONS },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: 'Status',
      defaultValue: 'draft',
      componentProps: { options: STATUS_OPTIONS },
    },
    {
      component: 'Input',
      fieldName: 'coverUrl',
      label: 'Cover URL',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'summary',
      label: 'Summary',
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      component: 'InputNumber',
      fieldName: 'sortOrder',
      label: 'Sort',
      defaultValue: 100,
      componentProps: { min: 0, style: { width: '100%' } },
    },

    {
      component: 'Divider',
      fieldName: 'membersDivider',
      formItemClass: 'col-span-2 pb-0',
      hideLabel: true,
      renderComponentContent: () => ({ default: () => 'Characters' }),
    },
    {
      component: 'Input',
      fieldName: 'characterSlugs',
      label: 'Characters',
      formItemClass: 'col-span-2',
    },
  ];
}

export function useColumns<T = PmThemeApi.ThemeItem>(
  onActionClick: ActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { field: 'name', title: 'Name', minWidth: 180 },
    { field: 'code', title: 'Code', width: 140 },
    { field: 'category', title: 'Category', width: 120 },
    { field: 'sortOrder', title: 'Sort', width: 90 },
    { field: 'summary', title: 'Summary', minWidth: 240 },
    {
      field: 'characterSlugs',
      title: 'Characters',
      width: 100,
      formatter: ({ cellValue }: any) => (cellValue || []).length,
    },
    { field: 'status', title: 'Status', width: 110 },
    {
      align: 'center',
      field: 'operation',
      fixed: 'right',
      title: 'Actions',
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
              () => 'Edit',
            ),
            h(
              Button,
              {
                danger: true,
                type: 'link',
                onClick: () => onActionClick({ code: 'delete', row }),
              },
              () => 'Delete',
            ),
          ]),
      },
    },
  ];
}
