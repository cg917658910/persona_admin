<script lang="ts" setup>
import type { PmResourceApi } from '#/api/pm/resource';

import { computed } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createResource } from '#/api/pm/resource';
import { uploadResource } from '#/api/pm/upload';

interface DrawerData {
  resourceType?: PmResourceApi.ResourceType;
}

const emit = defineEmits<{ success: [] }>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    labelWidth: 110,
  },
  schema: [
    { fieldName: 'name', label: '名称', component: 'Input', rules: 'required' },
    { fieldName: 'url', label: 'URL', component: 'Input', rules: 'required' },
    { fieldName: 'mimeType', label: 'MIME', component: 'Input' },
    {
      fieldName: 'size',
      label: '大小(Byte)',
      component: 'InputNumber',
      componentProps: { min: 0, style: { width: '100%' } },
    },
    { fieldName: 'linkedModule', label: '关联模块', component: 'Input' },
    {
      fieldName: 'linkedCount',
      label: '关联数量',
      component: 'InputNumber',
      defaultValue: 0,
      componentProps: { min: 0, style: { width: '100%' } },
    },
  ],
  showDefaultActions: false,
});

const currentType = computed<PmResourceApi.ResourceType>(
  () => drawerApi.getData<DrawerData>()?.resourceType || 'image',
);

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: async () => {
    const values = (await formApi.validate()) as any;
    await createResource({
      linkedCount: values.linkedCount ?? 0,
      linkedModule: values.linkedModule,
      mimeType: values.mimeType,
      name: values.name,
      size: values.size,
      type: currentType.value,
      url: values.url,
    });
    message.success('资源已记录');
    drawerApi.close();
    emit('success');
  },
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      await (formApi as any).resetForm();
      return;
    }
    drawerApi.setState({
      title: currentType.value === 'image' ? '新建图片资源' : '新建音频资源',
    });
    await (formApi as any).resetForm();
    await (formApi as any).setValues({ linkedCount: 0 });
  },
});

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }
  const uploaded = await uploadResource(file, currentType.value);
  await (formApi as any).setValues({
    mimeType: uploaded.mimeType,
    name: uploaded.name,
    size: uploaded.size,
    url: uploaded.url,
  });
  message.success('已填入文件信息');
}
</script>

<template>
  <Drawer class="w-[560px]">
    <div class="px-4 pt-4">
      <input
        type="file"
        :accept="currentType === 'image' ? 'image/*' : 'audio/*'"
        @change="handleFileChange"
      />
    </div>
    <Form />
    <div class="mt-2 px-4 text-xs text-gray-500">
      上传会先填充表单；如果后端上传接口暂不可用，也可手动录入。
    </div>
  </Drawer>
</template>
