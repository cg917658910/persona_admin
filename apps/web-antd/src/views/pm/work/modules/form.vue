<script lang="ts" setup>
import type { PmWorkApi } from '#/api/pm/work';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createWork, updateWork } from '#/api/pm/work';
import ResourceField from '#/views/pm/components/ResourceField.vue';

interface DrawerData {
  record?: PmWorkApi.WorkItem;
}

const emit = defineEmits<{ success: [] }>();
const editingId = ref<string>('');

const [Form, formApi] = useVbenForm({
  commonConfig: { labelWidth: 120 },
  schema: [
    { fieldName: 'title', label: '作品名称', component: 'Input', rules: 'required' },
    { fieldName: 'slug', label: 'Slug', component: 'Input', rules: 'required' },
    {
      fieldName: 'workTypeCode',
      label: '作品类型',
      component: 'Input',
      componentProps: { placeholder: 'novel / history / anime' },
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
      fieldName: 'creatorSlugsText',
      label: '创作者 Slugs',
      component: 'Input',
      componentProps: { placeholder: '多个用逗号分隔' },
    },
    {
      fieldName: 'creatorNamesText',
      label: '创作者名称',
      component: 'Input',
      componentProps: { placeholder: '多个用逗号分隔' },
    },
    { fieldName: 'regionCode', label: '地区', component: 'Input' },
    { fieldName: 'culturalRegionCode', label: '文化区域', component: 'Input' },
    {
      fieldName: 'releaseYear',
      label: '年份',
      component: 'InputNumber',
      componentProps: { min: 0, style: { width: '100%' } },
    },
  ],
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: async () => {
    const values = (await formApi.validate()) as any;
    const payload = {
      coverUrl: values.coverUrl,
      creatorNames: splitText(values.creatorNamesText),
      creatorSlugs: splitText(values.creatorSlugsText),
      culturalRegionCode: values.culturalRegionCode,
      regionCode: values.regionCode,
      releaseYear: values.releaseYear,
      slug: values.slug,
      status: values.status,
      summary: values.summary,
      title: values.title,
      workTypeCode: values.workTypeCode,
    };
    if (editingId.value) {
      await updateWork(editingId.value, payload);
      message.success('作品已更新');
    } else {
      await createWork(payload);
      message.success('作品已创建');
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
      title: `${record ? '编辑' : '新建'}作品`,
    });
    await (formApi as any).resetForm();
    await (formApi as any).setValues(
      record
        ? {
            coverUrl: record.coverUrl,
            creatorNamesText: (record.creatorNames || []).join(', '),
            creatorSlugsText: (record.creatorSlugs || []).join(', '),
            culturalRegionCode: record.culturalRegionCode,
            regionCode: record.regionCode,
            releaseYear: record.releaseYear,
            slug: record.slug,
            status: record.status,
            summary: record.summary,
            title: record.title,
            workTypeCode: record.workTypeCode,
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
    <Form>
      <template #coverUrl="slotProps">
        <ResourceField
          :model-value="slotProps.modelValue"
          accept="image/*"
          placeholder="/assets/images/works/xxx.webp"
          resource-type="image"
          @update:model-value="slotProps['onUpdate:modelValue']"
        />
      </template>
    </Form>
  </Drawer>
</template>
