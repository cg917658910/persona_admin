import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmResourceApi } from '#/api/pm/resource';

import { h } from 'vue';

import { Button, Image, Space, Tag } from 'ant-design-vue';

type ActionClickParams<T> = { code: string; row: T };

export function useGridFormSchema(label: string): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'keyword',
      label: `${label} Search`,
      componentProps: {
        allowClear: true,
        placeholder: `Search ${label} by name / URL / MIME`,
      },
    },
  ];
}

export function useColumns(
  resourceType: PmResourceApi.ResourceType,
  onActionClick: (
    params: ActionClickParams<PmResourceApi.ResourceItem>,
  ) => void,
): VxeTableGridOptions<PmResourceApi.ResourceItem>['columns'] {
  return [
    {
      field: 'url',
      title: 'Preview',
      width: 100,
      slots: {
        default: ({ row }) => {
          if (resourceType === 'image') {
            return row.url
              ? h(Image, {
                  src: row.url,
                  width: 44,
                  height: 44,
                  style: { borderRadius: '6px', objectFit: 'cover' },
                })
              : '-';
          }
          return h('span', { style: 'font-size: 18px; color: #1677ff' }, 'A');
        },
      },
    },
    {
      field: 'name',
      title: 'Name',
      minWidth: 180,
      slots: {
        default: ({ row }) =>
          h(Space, {}, () => [
            resourceType === 'image'
              ? h('span', { style: 'color:#52c41a' }, 'I')
              : h('span', { style: 'color:#1677ff' }, 'A'),
            h('span', row.name),
          ]),
      },
    },
    { field: 'url', title: 'URL', minWidth: 260 },
    { field: 'mimeType', title: 'MIME', width: 140 },
    {
      field: 'linkedModule',
      title: 'Linked Module',
      minWidth: 140,
      slots: {
        default: ({ row }) =>
          h(Tag, { color: 'purple' }, () => row.linkedModule || '-'),
      },
    },
    { field: 'linkedCount', title: 'Linked Count', width: 110 },
    { field: 'createdAt', title: 'Created At', minWidth: 160 },
    {
      field: 'actions',
      fixed: 'right',
      title: 'Actions',
      width: 200,
      slots: {
        default: ({ row }) =>
          h(Space, {}, () => [
            h(
              Button,
              {
                type: 'link',
                onClick: () => onActionClick({ code: 'select', row }),
              },
              () => 'Select',
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
