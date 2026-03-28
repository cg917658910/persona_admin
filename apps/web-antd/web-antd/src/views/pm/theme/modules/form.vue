<script lang="ts" setup>
import { nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { Alert, Input, Tag, Transfer } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getCharacterOptions } from '#/api/pm/shared';
import { createTheme, getThemeDetail, updateTheme } from '#/api/pm/theme';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);
const id = ref<string>();
const characterOptions = ref<{ label: string; value: string }[]>([]);

const [Form, formApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' } },
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
  schema: useFormSchema(),
});

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: async () => {
    const values = (await formApi.validate()) as any;
    await (id.value ? updateTheme(id.value, values) : createTheme(values));
    emits('success');
    drawerApi.close();
  },
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      id.value = undefined;
      return;
    }
    await setupForm();
  },
});

async function setupForm() {
  await (formApi as any).resetForm();
  if (characterOptions.value.length === 0) {
    characterOptions.value = await getCharacterOptions();
  }
  const data = drawerApi.getData<any>() || {};
  id.value = data?.id;
  if (id.value || data?.slug) {
    const detail = await getThemeDetail(String(id.value || data.slug));
    await nextTick();
    await (formApi as any).setValues({
      ...detail,
      characterSlugs: detail.characterSlugs || [],
    });
  } else {
    await nextTick();
    await (formApi as any).setValues({
      category: 'psychology',
      characterSlugs: [],
      status: 'draft',
    });
  }
}
</script>

<template>
  <Drawer :title="id ? '编辑主题集' : '新建主题集'" class="w-[980px]">
    <Form>
      <template #coverUrl="slotProps">
        <div class="w-full space-y-2">
          <Input v-bind="slotProps" placeholder="/assets/images/themes/xxx.webp" />
          <img
            v-if="slotProps.modelValue"
            :src="slotProps.modelValue"
            class="h-24 rounded border object-cover"
          />
        </div>
      </template>
      <template #characterSlugs="slotProps">
        <div class="w-full space-y-3">
          <Transfer
            :data-source="
              characterOptions.map((item) => ({
                key: item.value,
                title: item.label,
              }))
            "
            :target-keys="slotProps.modelValue || []"
            :render="(item) => item.title"
            :titles="['候选人物', '已选人物']"
            show-search
            @update:target-keys="slotProps['onUpdate:modelValue']"
          />
          <div class="text-text-secondary text-xs">
            当前已选 {{ (slotProps.modelValue || []).length }} 位人物。
          </div>
          <div class="flex flex-wrap gap-1">
            <Tag v-for="slug in slotProps.modelValue || []" :key="slug">
              {{ slug }}
            </Tag>
          </div>
          <Alert
            type="info"
            show-icon
            message="当前版本会按选择结果写入 characterSlugs。"
          />
        </div>
      </template>
    </Form>
  </Drawer>
</template>
