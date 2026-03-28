import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmDictApi } from '#/api/pm/dict';

import { h } from 'vue';

import { Button, Space, Tag } from 'ant-design-vue';

import { dictLabels } from '#/api/pm/dict';

export type DictActionParams<T> = { code: string; row: T };

export const DICT_OPTIONS: Array<{
  key: PmDictApi.DictKey;
  label: string;
}> = [
  { key: 'workTypes', label: dictLabels.workTypes },
  { key: 'characterTypes', label: dictLabels.characterTypes },
  { key: 'creatorTypes', label: dictLabels.creatorTypes },
  { key: 'culturalRegions', label: dictLabels.culturalRegions },
  { key: 'motivations', label: dictLabels.motivations },
  { key: 'regions', label: dictLabels.regions },
];

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'keyword',
      label: '关键词',
      componentProps: {
        allowClear: true,
        placeholder: '搜索 code 或名称',
      },
    },
  ];
}

export function useColumns<T extends PmDictApi.DictItem>(
  onActionClick: (params: DictActionParams<T>) => void,
): VxeTableGridOptions['columns'] {
  return [
    { field: 'code', title: 'Code', minWidth: 180 },
    { field: 'name', title: '名称', minWidth: 200 },
    { field: 'sortOrder', title: '排序', width: 100 },
    {
      field: 'isActive',
      title: '状态',
      width: 100,
      slots: {
        default: ({ row }: any) =>
          h(
            Tag,
            { color: row.isActive === false ? 'default' : 'green' },
            () => (row.isActive === false ? '已停用' : '启用中'),
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
              () => '停用',
            ),
          ]),
      },
    },
  ];
}
