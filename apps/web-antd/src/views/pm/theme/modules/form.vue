<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { Alert, Select, Tag } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getCharacterOptions, getRelationOptions } from '#/api/pm/shared';
import { createTheme, getThemeDetail, updateTheme } from '#/api/pm/theme';
import ResourceField from '#/views/pm/components/ResourceField.vue';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const id = ref<string>();
const subjectType = ref<'character' | 'relation'>('character');
const characterOptions = ref<{ label: string; value: string }[]>([]);
const relationOptions = ref<{ label: string; value: string }[]>([]);

const DEFAULT_VALUES = {
  category: 'psychology',
  subjectType: 'character',
  status: 'draft',
  sortOrder: 100,
  characterSlugs: [],
  relationSlugs: [],
};

const [Form, formApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' } },
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
  schema: useFormSchema(),
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const values = await formApi.getValues();
    drawerApi.lock();
    try {
      await (id.value
        ? updateTheme(id.value, normalizePayload(values))
        : createTheme(normalizePayload(values)));
      emits('success');
      drawerApi.close();
    } finally {
      drawerApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      id.value = undefined;
      subjectType.value = 'character';
      await formApi.resetForm();
      return;
    }
    await setupForm();
  },
});

const drawerTitle = computed(() => (id.value ? '编辑主题' : '新建主题'));

async function ensureOptions() {
  if (characterOptions.value.length === 0) {
    characterOptions.value = await getCharacterOptions();
  }
  if (relationOptions.value.length === 0) {
    relationOptions.value = await getRelationOptions();
  }
}

async function setupForm() {
  await formApi.resetForm();
  await ensureOptions();

  const data = drawerApi.getData<any>() || {};
  id.value = data?.id;
  if (id.value || data?.slug) {
    const detail = await getThemeDetail(String(id.value || data.slug));
    subjectType.value = detail.subjectType === 'relation' ? 'relation' : 'character';
    await nextTick();
    await formApi.setValues({
      ...DEFAULT_VALUES,
      ...detail,
      subjectType: subjectType.value,
      characterSlugs: detail.characterSlugs || [],
      relationSlugs: detail.relationSlugs || [],
    });
    return;
  }

  subjectType.value = 'character';
  await nextTick();
  await formApi.setValues({
    ...DEFAULT_VALUES,
    subjectType: data?.subjectType === 'relation' ? 'relation' : 'character',
  });
}

function normalizePayload(values: any) {
  const nextType = values.subjectType === 'relation' ? 'relation' : 'character';
  return {
    ...values,
    subjectType: nextType,
    characterSlugs: nextType === 'character' ? values.characterSlugs || [] : [],
    relationSlugs: nextType === 'relation' ? values.relationSlugs || [] : [],
  };
}
</script>

<template>
  <Drawer :title="drawerTitle" class="w-[980px]">
    <Form>
      <template #subjectType="slotProps">
        <Select
          v-bind="slotProps"
          :options="[
            { label: '人物主题', value: 'character' },
            { label: '关系主题', value: 'relation' },
          ]"
          @update:value="
            (value) => {
              subjectType = value === 'relation' ? 'relation' : 'character';
              slotProps['onUpdate:modelValue']?.(value);
            }
          "
        />
      </template>

      <template #coverUrl="slotProps">
        <ResourceField
          :model-value="slotProps.modelValue"
          accept="image/*"
          placeholder="/assets/images/themes/xxx.webp"
          resource-type="image"
          @update:model-value="slotProps['onUpdate:modelValue']"
        />
      </template>

      <template #characterSlugs="slotProps">
        <div v-if="subjectType === 'character'" class="w-full space-y-2">
          <Select
            v-bind="slotProps"
            mode="multiple"
            :options="characterOptions"
            :max-tag-count="6"
            placeholder="选择人物主题成员"
          />
          <div class="flex flex-wrap gap-1">
            <Tag v-for="slug in slotProps.modelValue || []" :key="slug">{{ slug }}</Tag>
          </div>
        </div>
        <Alert
          v-else
          type="info"
          show-icon
          message="当前是关系主题，人物成员不会写入。"
        />
      </template>

      <template #relationSlugs="slotProps">
        <div v-if="subjectType === 'relation'" class="w-full space-y-2">
          <Select
            v-bind="slotProps"
            mode="multiple"
            :options="relationOptions"
            :max-tag-count="4"
            placeholder="选择关系主题成员"
          />
          <div class="flex flex-wrap gap-1">
            <Tag v-for="slug in slotProps.modelValue || []" :key="slug">{{ slug }}</Tag>
          </div>
        </div>
        <Alert
          v-else
          type="info"
          show-icon
          message="当前是人物主题，关系成员不会写入。"
        />
      </template>
    </Form>
  </Drawer>
</template>
