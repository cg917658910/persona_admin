<script lang="ts" setup>
import type { PmCreatorApi } from '#/api/pm/creator';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createCreator, updateCreator } from '#/api/pm/creator';

interface DrawerData {
  record?: PmCreatorApi.CreatorItem;
}

const emit = defineEmits<{ success: [] }>();
const editingId = ref<string>('');

const [Form, formApi] = useVbenForm({
  commonConfig: { labelWidth: 120 },
  schema: [
    { fieldName: 'name', label: '创作者名称', component: 'Input', rules: 'required' },
    { fieldName: 'slug', label: 'Slug', component: 'Input', rules: 'required' },
    {
      fieldName: 'creatorTypeCode',
      label: '创作者类型',
      component: 'Input',
      componentProps: { placeholder: 'author / director / historian' },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      defaultValue: 'draft',
      componentProps: {
        options: [
          { label: '草稿', value: 'draft' },
          { label: '已发布', value: 'published' },
          { label: '归档', value: 'archived' },
        ],
      },
    },
    { fieldName: 'coverUrl', label: '封面地址', component: 'Input' },
    {
      fieldName: 'summary',
      label: '摘要',
      component: 'Textarea',
      componentProps: { rows: 4 },
    },
    {
      fieldName: 'workSlugsText',
      label: '作品 Slugs',
      component: 'Input',
      componentProps: { placeholder: '多个用逗号分隔' },
    },
    {
      fieldName: 'workNamesText',
      label: '作品名称',
      component: 'Input',
      componentProps: { placeholder: '多个用逗号分隔' },
    },
    { fieldName: 'regionCode', label: '地区', component: 'Input' },
    { fieldName: 'culturalRegionCode', label: '文化区域', component: 'Input' },
  ],
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: async () => {
    const values = (await formApi.validate()) as any;
    const payload = {
      coverUrl: values.coverUrl,
      creatorTypeCode: values.creatorTypeCode,
      culturalRegionCode: values.culturalRegionCode,
      name: values.name,
      regionCode: values.regionCode,
      slug: values.slug,
      status: values.status,
      summary: values.summary,
      workNames: splitText(values.workNamesText),
      workSlugs: splitText(values.workSlugsText),
    };
    if (editingId.value) {
      await updateCreator(editingId.value, payload);
      message.success('创作者已更新');
    } else {
      await createCreator(payload);
      message.success('创作者已创建');
    }
    drawerApi.close();
    emit('success');
  },
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      editingId.value = '';
      await (formApi as any).resetForm();
      return;
    }
    const record = drawerApi.getData<DrawerData>()?.record;
    editingId.value = String(record?.id || '');
    drawerApi.setState({
      title: `${record ? '编辑' : '新建'}创作者`,
    });
    await (formApi as any).resetForm();
    await (formApi as any).setValues(
      record
        ? {
            coverUrl: record.coverUrl,
            creatorTypeCode: record.creatorTypeCode,
            culturalRegionCode: record.culturalRegionCode,
            name: record.name,
            regionCode: record.regionCode,
            slug: record.slug,
            status: record.status,
            summary: record.summary,
            workNamesText: (record.workNames || []).join(', '),
            workSlugsText: (record.workSlugs || []).join(', '),
          }
        : {
            status: 'draft',
          },
    );
  },
});

function splitText(value: string) {
  return String(value || '')
    .replaceAll('，', ',')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
</script>

<template>
  <Drawer class="w-[620px]">
    <Form />
  </Drawer>
</template>
