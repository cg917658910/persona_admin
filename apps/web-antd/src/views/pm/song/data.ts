import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmSongApi } from '#/api/pm/song';

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
        placeholder: 'Search by title / slug / summary / character',
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

export function useFormSchema(): VbenFormSchema[] {
  return [
    { component: 'Input', fieldName: 'title', label: 'Title', rules: 'required' },
    { component: 'Input', fieldName: 'slug', label: 'Slug', rules: 'required' },
    {
      component: 'Input',
      fieldName: 'characterId',
      label: 'Character',
      rules: 'required',
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
      component: 'Input',
      fieldName: 'audioUrl',
      label: 'Audio URL',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'summary',
      label: 'Summary',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'styles',
      label: 'Styles',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'emotionalCurve',
      label: 'Emotional Curve',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'lyrics',
      label: 'Lyrics',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'prompt',
      label: 'Prompt',
      formItemClass: 'col-span-2',
    },
  ];
}

export function useColumns<T = PmSongApi.SongItem>(
  onActionClick: ActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { field: 'title', title: 'Title', minWidth: 180 },
    { field: 'slug', title: 'Slug', width: 200 },
    { field: 'characterName', title: 'Character', width: 160 },
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
