import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmDictApi } from '#/api/pm/dict';

import { h } from 'vue';

import { Button, Space, Tag, Tooltip } from 'ant-design-vue';

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

export const motivationCategoryOptions = [
  { label: '核心驱动力', value: 'core' },
  { label: '次级驱动力', value: 'secondary' },
];

export const regionTypeOptions = [
  { label: '国家', value: 'country' },
  { label: '地区', value: 'area' },
  { label: '城市', value: 'city' },
  { label: '虚构地点', value: 'fictional' },
  { label: '历史区域', value: 'historical_region' },
];

export function needsDescription(_dictKey: PmDictApi.DictKey) {
  return true;
}

export function needsCategory(dictKey: PmDictApi.DictKey) {
  return dictKey === 'motivations';
}

export function needsRegionType(dictKey: PmDictApi.DictKey) {
  return dictKey === 'regions';
}

export function needsParent(dictKey: PmDictApi.DictKey) {
  return dictKey === 'regions' || dictKey === 'culturalRegions';
}

export function needsCoverUrl(dictKey: PmDictApi.DictKey) {
  return dictKey === 'regions' || dictKey === 'culturalRegions';
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'keyword',
      label: '关键词',
      componentProps: {
        allowClear: true,
        placeholder: '搜索 code、名称或说明',
      },
    },
  ];
}

function textCell(text?: string, maxWidth = 240) {
  const value = String(text || '').trim();
  if (!value) {
    return '-';
  }
  return h(
    Tooltip,
    { title: value },
    () =>
      h(
        'span',
        {
          style: {
            display: 'inline-block',
            maxWidth: `${maxWidth}px`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            verticalAlign: 'bottom',
            whiteSpace: 'nowrap',
          },
        },
        value,
      ),
  );
}

export function useColumns<T extends PmDictApi.DictItem>(
  dictKey: PmDictApi.DictKey,
  onActionClick: (params: DictActionParams<T>) => void,
): VxeTableGridOptions['columns'] {
  const columns: NonNullable<VxeTableGridOptions['columns']> = [
    { field: 'code', title: 'Code', minWidth: 160 },
    { field: 'name', title: '名称', minWidth: 180 },
  ];

  if (needsCategory(dictKey)) {
    columns.push({
      field: 'category',
      title: '分类',
      width: 120,
    });
  }

  if (needsRegionType(dictKey)) {
    columns.push({
      field: 'regionType',
      title: '地区类型',
      width: 140,
    });
  }

  if (needsParent(dictKey)) {
    columns.push({
      field: 'parentCode',
      title: '父级',
      minWidth: 140,
    });
  }

  if (needsDescription(dictKey)) {
    columns.push({
      field: 'description',
      title: '说明',
      minWidth: 220,
      slots: {
        default: ({ row }: any) => textCell(row.description),
      },
    });
  }

  columns.push(
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
  );

  return columns;
}
