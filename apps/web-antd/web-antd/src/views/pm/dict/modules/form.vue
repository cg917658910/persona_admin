<script lang="ts" setup>
import type { PmDictApi } from '#/api/pm/dict';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createDictItem, dictLabels, updateDictItem } from '#/api/pm/dict';

interface DrawerData {
  dictKey?: PmDictApi.DictKey;
  record?: PmDictApi.DictItem;
}

const emit = defineEmits<{ success: [] }>();
const currentDictKey = ref<PmDictApi.DictKey>('characterTypes');
const editingId = ref<string>('');

const [Form, formApi] = useVbenForm({
  commonConfig: {
    labelWidth: 110,
  },
  schema: [
    { fieldName: 'code', label: 'Code', component: 'Input', rules: 'required' },
    { fieldName: 'name', label: '名称', component: 'Input', rules: 'required' },
    {
      fieldName: 'sortOrder',
      label: '排序',
      component: 'InputNumber',
      defaultValue: 100,
      componentProps: { min: 0, style: { width: '100%' } },
    },
    {
      fieldName: 'isActive',
      label: '启用',
      component: 'Switch',
      defaultValue: true,
    },
  ],
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: async () => {
    const values = (await formApi.validate()) as any;
    const payload = {
      code: values.code,
      dictKey: currentDictKey.value,
      isActive: values.isActive ?? true,
      name: values.name,
      sortOrder: values.sortOrder ?? 100,
    };
    if (editingId.value) {
      await updateDictItem(currentDictKey.value, editingId.value, payload);
      message.success('字典项已更新');
    } else {
      await createDictItem(currentDictKey.value, payload);
      message.success('字典项已创建');
    }
    drawerApi.close();
    emit('success');
  },
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      editingId.value = '';
      currentDictKey.value = 'characterTypes';
      await (formApi as any).resetForm();
      return;
    }
    const payload = drawerApi.getData<DrawerData>() || {};
    currentDictKey.value = payload.dictKey || 'characterTypes';
    editingId.value = String(payload.record?.id || '');
    drawerApi.setState({
      title: `${payload.record ? '编辑' : '新建'}${dictLabels[currentDictKey.value]}`,
    });
    await (formApi as any).resetForm();
    await (formApi as any).setValues(
      payload.record
        ? {
            code: payload.record.code,
            isActive: payload.record.isActive ?? true,
            name: payload.record.name,
            sortOrder: payload.record.sortOrder ?? 100,
          }
        : {
            isActive: true,
            sortOrder: 100,
          },
    );
  },
});
</script>

<template>
  <Drawer class="w-[520px]">
    <Form />
  </Drawer>
</template>
