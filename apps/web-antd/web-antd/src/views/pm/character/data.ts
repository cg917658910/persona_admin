import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmCharacterApi } from '#/api/pm/character';

import { h } from 'vue';

import { Button, Space } from 'ant-design-vue';

type ActionClickParams<T> = { code: string; row: T };
type ActionClickFn<T> = (params: ActionClickParams<T>) => void;

export const CHARACTER_TYPE_OPTIONS = [
  { label: 'Historical', value: 'historical' },
  { label: 'Literary', value: 'literary' },
  { label: 'Film / TV', value: 'film_tv' },
  { label: 'Anime', value: 'anime' },
];

export const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Unknown', value: 'unknown' },
];

export const TEMP_OPTIONS = [
  { label: 'Low', value: 'low' },
  { label: 'Mid', value: 'mid' },
  { label: 'High', value: 'high' },
];

export const REGION_OPTIONS = [
  { label: 'China', value: 'china' },
  { label: 'Japan', value: 'japan' },
  { label: 'Russia', value: 'russia' },
];

export const CULTURE_OPTIONS = [
  { label: 'Literature', value: 'literature' },
  { label: 'Film / TV', value: 'film_tv' },
  { label: 'Anime', value: 'anime' },
  { label: 'History', value: 'history' },
];

export const MOTIVATION_OPTIONS = [
  { label: 'Freedom', value: 'freedom' },
  { label: 'Control', value: 'control' },
  { label: 'Love', value: 'love' },
  { label: 'Recognition', value: 'recognition' },
  { label: 'Justice', value: 'justice' },
];

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'keyword',
      label: 'Keyword',
      componentProps: {
        allowClear: true,
        placeholder: 'Search by name / slug / summary / one-line definition',
      },
    },
    {
      component: 'Select',
      fieldName: 'characterTypeCode',
      label: 'Type',
      componentProps: { allowClear: true, options: CHARACTER_TYPE_OPTIONS },
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
    {
      component: 'Divider',
      fieldName: 'basicDivider',
      formItemClass: 'col-span-2 pb-0',
      hideLabel: true,
      renderComponentContent: () => ({ default: () => 'Basic Info' }),
    },
    { component: 'Input', fieldName: 'name', label: 'Name', rules: 'required' },
    { component: 'Input', fieldName: 'slug', label: 'Slug', rules: 'required' },
    {
      component: 'Select',
      fieldName: 'characterTypeCode',
      label: 'Type',
      rules: 'required',
      componentProps: { options: CHARACTER_TYPE_OPTIONS },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: 'Status',
      defaultValue: 'draft',
      componentProps: { options: STATUS_OPTIONS },
    },
    {
      component: 'Select',
      fieldName: 'gender',
      label: 'Gender',
      componentProps: { allowClear: true, options: GENDER_OPTIONS },
    },
    {
      component: 'Select',
      fieldName: 'regionCode',
      label: 'Region',
      componentProps: { allowClear: true, options: REGION_OPTIONS },
    },
    {
      component: 'Select',
      fieldName: 'culturalRegionCode',
      label: 'Culture',
      componentProps: { allowClear: true, options: CULTURE_OPTIONS },
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
      formItemClass: 'col-span-2',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'oneLineDefinition',
      label: 'One-line Definition',
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
      component: 'InputNumber',
      fieldName: 'discoverWeight',
      label: 'Discover Weight',
      defaultValue: 1,
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.1,
        style: { width: '100%' },
      },
    },
    {
      component: 'Switch',
      fieldName: 'homeToday',
      label: 'Today Character',
      defaultValue: false,
    },
    {
      component: 'Switch',
      fieldName: 'featuredHome',
      label: 'Home Featured',
      defaultValue: false,
    },
    {
      component: 'InputNumber',
      fieldName: 'homeSort',
      label: 'Home Sort',
      defaultValue: 100,
      componentProps: { min: 0, style: { width: '100%' } },
    },

    {
      component: 'Divider',
      fieldName: 'coreDivider',
      formItemClass: 'col-span-2 pb-0',
      hideLabel: true,
      renderComponentContent: () => ({ default: () => 'Core Model' }),
    },
    { component: 'Input', fieldName: 'coreIdentity', label: 'Core Identity' },
    { component: 'Input', fieldName: 'coreFear', label: 'Core Fear' },
    {
      component: 'Input',
      fieldName: 'coreConflict',
      label: 'Core Conflict',
      formItemClass: 'col-span-2',
    },
    { component: 'Input', fieldName: 'emotionalTone', label: 'Emotional Tone' },
    {
      component: 'Select',
      fieldName: 'emotionalTemperature',
      label: 'Temperature',
      componentProps: { allowClear: true, options: TEMP_OPTIONS },
    },
    {
      component: 'Select',
      fieldName: 'primaryMotivation',
      label: 'Primary Motivation',
      componentProps: { allowClear: true, options: MOTIVATION_OPTIONS },
    },

    {
      component: 'Divider',
      fieldName: 'personalityDivider',
      formItemClass: 'col-span-2 pb-0',
      hideLabel: true,
      renderComponentContent: () => ({
        default: () => 'Personality & Imagery',
      }),
    },
    {
      component: 'Input',
      fieldName: 'dominantEmotions',
      label: 'Dominant Emotions',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'suppressedEmotions',
      label: 'Suppressed Emotions',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'valuesTags',
      label: 'Values Tags',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'symbolicImages',
      label: 'Symbolic Images',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'elements',
      label: 'Elements',
      formItemClass: 'col-span-2',
    },

    {
      component: 'Divider',
      fieldName: 'relationDivider',
      formItemClass: 'col-span-2 pb-0',
      hideLabel: true,
      renderComponentContent: () => ({ default: () => 'Relations & Timeline' }),
    },
    {
      component: 'Input',
      fieldName: 'workSlugs',
      label: 'Works',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      fieldName: 'themeSlugs',
      label: 'Themes',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'relationshipProfile',
      label: 'Relationship Profile JSON',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Textarea',
      fieldName: 'timeline',
      label: 'Timeline',
      formItemClass: 'col-span-2',
    },
  ];
}

export function useColumns<T = PmCharacterApi.CharacterItem>(
  onActionClick: ActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { field: 'name', title: 'Name', minWidth: 160 },
    { field: 'slug', title: 'Slug', width: 180 },
    { field: 'characterTypeCode', title: 'Type', width: 110 },
    { field: 'oneLineDefinition', title: 'One-line Definition', minWidth: 240 },
    { field: 'sortOrder', title: 'Sort', width: 90 },
    {
      field: 'homeToday',
      title: 'Today',
      width: 90,
      formatter: ({ cellValue }: any) => (cellValue ? 'Yes' : 'No'),
    },
    {
      field: 'featuredHome',
      title: 'Featured',
      width: 100,
      formatter: ({ cellValue }: any) => (cellValue ? 'Yes' : 'No'),
    },
    { field: 'homeSort', title: 'Home Sort', width: 110 },
    { field: 'discoverWeight', title: 'Weight', width: 100 },
    {
      field: 'hasSong',
      title: 'Song',
      width: 90,
      formatter: ({ cellValue }: any) => (cellValue ? 'Yes' : 'No'),
    },
    { field: 'status', title: 'Status', width: 90 },
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
