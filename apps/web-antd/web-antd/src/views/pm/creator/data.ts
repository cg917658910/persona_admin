import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmCreatorApi } from '#/api/pm/creator';

import { h } from 'vue';

import { Button, Space } from 'ant-design-vue';

type ActionClickParams<T> = { code: string; row: T };
type ActionClickFn<T> = (params: ActionClickParams<T>) => void;

export const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'keyword',
      label: 'Keyword',
      componentProps: {
        allowClear: true,
        placeholder: 'Search by name / slug / summary',
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: 'Status',
      componentProps: { allowClear: true, options: STATUS_OPTIONS },
    },
  ];
}

export function useColumns<T = PmCreatorApi.CreatorItem>(
  onActionClick: ActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { field: 'name', title: 'Name', minWidth: 180 },
    { field: 'slug', title: 'Slug', width: 180 },
    { field: 'creatorTypeCode', title: 'Type', width: 120 },
    { field: 'summary', title: 'Summary', minWidth: 260 },
    { field: 'status', title: 'Status', width: 100 },
    {
      field: 'actions',
      fixed: 'right',
      title: 'Actions',
      width: 180,
      slots: {
        default: ({ row }) =>
          h(Space, {}, () => [
            h(
              Button,
              { type: 'link', onClick: () => onActionClick({ code: 'edit', row }) },
              () => 'Edit',
            ),
            h(
              Button,
              { danger: true, type: 'link', onClick: () => onActionClick({ code: 'delete', row }) },
              () => 'Delete',
            ),
          ]),
      },
    },
  ];
}
