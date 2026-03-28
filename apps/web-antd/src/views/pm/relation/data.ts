import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmRelationApi } from '#/api/pm/relation';

import { h } from 'vue';

import { Button, Space, Tag } from 'ant-design-vue';

export type ActionClickParams<T> = { code: string; row: T };
export type ActionClickFn<T> = (params: ActionClickParams<T>) => void;

export const STATUS_OPTIONS = [
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已归档', value: 'archived' },
];

export const RELATION_TYPE_OPTIONS = [
  { label: '伴侣', value: 'partner' },
  { label: '恋人', value: 'lover' },
  { label: '朋友', value: 'friend' },
  { label: '亲属', value: 'family' },
  { label: '对手', value: 'rival' },
  { label: '镜像', value: 'mirror' },
];

export const LINK_TYPE_OPTIONS = [
  { label: '相似关系', value: 'related' },
  { label: '镜像关系', value: 'mirror' },
  { label: '同作品关系', value: 'same_work' },
];

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'keyword',
      label: '关键词',
      componentProps: {
        allowClear: true,
        placeholder: '搜索关系名 / slug / 人物 / 作品 / 简介',
      },
    },
    {
      component: 'Select',
      fieldName: 'relationTypeCode',
      label: '关系类型',
      componentProps: { allowClear: true, options: RELATION_TYPE_OPTIONS },
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
    {
      component: 'Select',
      fieldName: 'relationTypeCode',
      label: '关系类型',
      rules: 'required',
      componentProps: { allowClear: true, options: RELATION_TYPE_OPTIONS },
    },
    {
      component: 'Input',
      fieldName: 'workSlug',
      label: '所属作品',
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      defaultValue: 'draft',
      componentProps: { options: STATUS_OPTIONS },
    },
    {
      component: 'InputNumber',
      fieldName: 'sortOrder',
      label: '排序',
      defaultValue: 100,
      componentProps: { min: 0, style: { width: '100%' } },
    },
    {
      component: 'Input',
      fieldName: 'coverUrl',
      label: '封面图',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Divider',
      fieldName: 'charactersDivider',
      formItemClass: 'col-span-2 pb-0',
      hideLabel: true,
      renderComponentContent: () => ({ default: () => '关系双方' }),
    },
    {
      component: 'Input',
      fieldName: 'sourceCharacterSlug',
      label: '人物 1',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'targetCharacterSlug',
      label: '人物 2',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'themeSlugs',
      label: '关系主题',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Divider',
      fieldName: 'contentDivider',
      formItemClass: 'col-span-2 pb-0',
      hideLabel: true,
      renderComponentContent: () => ({ default: () => '核心内容' }),
    },
    {
      component: 'Textarea',
      fieldName: 'summary',
      label: '简介',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'oneLineDefinition',
      label: '一句话定义',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'coreTension',
      label: 'Core Tension',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'connectionTrigger',
      label: '为什么他们会靠近',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'sustainingMechanism',
      label: '这段关系靠什么维持',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'relationConflict',
      label: '这段关系最深的拉扯是什么',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'fateImpact',
      label: '它最终会把双方带向哪里',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'relationArc',
      label: '关系弧线总述',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'sourcePerspective',
      label: '人物 1 视角',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'targetPerspective',
      label: '人物 2 视角',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'sourceDesireInRelation',
      label: '人物 1 想要',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'sourceFearInRelation',
      label: '人物 1 害怕',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'sourceUnsaid',
      label: '人物 1 未说出口',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'targetDesireInRelation',
      label: '人物 2 想要',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'targetFearInRelation',
      label: '人物 2 害怕',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'targetUnsaid',
      label: '人物 2 未说出口',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Divider',
      fieldName: 'advancedDivider',
      formItemClass: 'col-span-2 pb-0',
      hideLabel: true,
      renderComponentContent: () => ({ default: () => '扩展字段' }),
    },
    {
      component: 'Input',
      fieldName: 'symbolicImages',
      label: '关系意象',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'relationKeywords',
      label: '关系关键词',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'tensionTags',
      label: '张力标签',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'phenomenology',
      label: '关系体验',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'relationPalette',
      label: '关系色板',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'events',
      label: '关系线',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'songs',
      label: '关系之歌',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'links',
      label: '关联关系',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'coverPrompt',
      label: '封面提示词',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'songPrompt',
      label: '歌曲提示词',
      formItemClass: 'col-span-2',
    },
  ];
}

export function useColumns<T = PmRelationApi.RelationItem>(
  onActionClick: ActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { field: 'name', title: '名称', minWidth: 180 },
    { field: 'slug', title: 'Slug', width: 220 },
    {
      field: 'relationTypeCode',
      title: '关系类型',
      width: 110,
      formatter: ({ row }: any) => row.relationTypeName || row.relationTypeCode,
    },
    { field: 'sourceCharacterName', title: '人物 1', width: 130 },
    { field: 'targetCharacterName', title: '人物 2', width: 130 },
    { field: 'workName', title: '作品', width: 160 },
    { field: 'coreTension', title: '最深张力', minWidth: 220 },
    {
      field: 'status',
      title: '状态',
      width: 100,
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
