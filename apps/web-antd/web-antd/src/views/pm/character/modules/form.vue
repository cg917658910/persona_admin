<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Alert, Input, Select, Tag } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createCharacter,
  getCharacterDetail,
  updateCharacter,
} from '#/api/pm/character';
import { getThemeOptions, getWorkOptions } from '#/api/pm/shared';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<any>();
const id = ref<string>();
const workOptions = ref<{ label: string; value: string }[]>([]);
const themeOptions = ref<{ label: string; value: string }[]>([]);

const DEFAULT_VALUES = {
  status: 'draft',
  characterTypeCode: 'literary',
  sortOrder: 100,
  homeToday: false,
  featuredHome: false,
  homeSort: 100,
  discoverWeight: 1,
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
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    try {
      const payload = normalizePayload(values);
      await (id.value
        ? updateCharacter(id.value, payload)
        : createCharacter(payload));
      emits('success');
      drawerApi.close();
    } finally {
      drawerApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      id.value = undefined;
      formData.value = undefined;
      await formApi.resetForm();
      return;
    }
    await setupForm();
  },
});

const drawerTitle = computed(() =>
  id.value ? 'Edit Character' : 'Create Character',
);

async function setupForm() {
  await formApi.resetForm();
  await ensureOptions();
  const data = drawerApi.getData<any>();
  id.value = data?.id;
  if (id.value || data?.slug) {
    const detail = await getCharacterDetail(String(id.value || data.slug));
    formData.value = detail;
    await nextTick();
    await formApi.setValues(toFormValues(detail));
    return;
  }

  formData.value = undefined;
  await nextTick();
  await formApi.setValues(DEFAULT_VALUES);
}

async function ensureOptions() {
  if (workOptions.value.length === 0) {
    workOptions.value = await getWorkOptions();
  }
  if (themeOptions.value.length === 0) {
    themeOptions.value = await getThemeOptions();
  }
}

function splitTags(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || '')
    .replaceAll('\uFF0C', ',')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toFormValues(detail: any) {
  return {
    ...DEFAULT_VALUES,
    ...detail,
    dominantEmotions: (detail.dominantEmotions || []).join(', '),
    suppressedEmotions: (detail.suppressedEmotions || []).join(', '),
    valuesTags: (detail.valuesTags || []).join(', '),
    symbolicImages: (detail.symbolicImages || []).join(', '),
    elements: (detail.elements || []).join(', '),
    relationshipProfile: JSON.stringify(
      detail.relationshipProfile || {},
      null,
      2,
    ),
    timeline: (detail.timeline || [])
      .map((item: any) => `${item.title}|${item.summary}`)
      .join('\n'),
  };
}

function normalizePayload(values: any) {
  let relationshipProfile = {};
  try {
    relationshipProfile = values.relationshipProfile
      ? JSON.parse(values.relationshipProfile)
      : {};
  } catch {
    relationshipProfile = {};
  }

  const timeline = String(values.timeline || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split('|');
      return {
        title: title?.trim() || '',
        summary: rest.join('|').trim(),
      };
    });

  return {
    ...values,
    dominantEmotions: splitTags(values.dominantEmotions),
    suppressedEmotions: splitTags(values.suppressedEmotions),
    valuesTags: splitTags(values.valuesTags),
    symbolicImages: splitTags(values.symbolicImages),
    elements: splitTags(values.elements),
    relationshipProfile,
    timeline,
  };
}
</script>

<template>
  <Drawer :title="drawerTitle" class="w-[960px]">
    <Form>
      <template #coverUrl="slotProps">
        <div class="w-full space-y-2">
          <Input
            v-bind="slotProps"
            placeholder="/assets/images/characters/xxx.webp"
          />
          <img
            v-if="slotProps.modelValue"
            :src="slotProps.modelValue"
            class="h-24 rounded border object-cover"
          />
        </div>
      </template>

      <template #workSlugs="slotProps">
        <div class="w-full space-y-2">
          <Select
            v-bind="slotProps"
            mode="multiple"
            :options="workOptions"
            :max-tag-count="4"
            placeholder="Select related works"
          />
          <div class="text-text-secondary text-xs">
            The first work is used as the primary work in current read models.
          </div>
        </div>
      </template>

      <template #themeSlugs="slotProps">
        <div class="w-full space-y-2">
          <Select
            v-bind="slotProps"
            mode="multiple"
            :options="themeOptions"
            :max-tag-count="4"
            placeholder="Select related themes"
          />
          <div class="flex flex-wrap gap-1">
            <Tag v-for="tag in slotProps.modelValue || []" :key="tag">
              {{ tag }}
            </Tag>
          </div>
        </div>
      </template>

      <template #relationshipProfile="slotProps">
        <div class="w-full space-y-2">
          <Input.TextArea
            v-bind="slotProps"
            :auto-size="{ minRows: 4, maxRows: 8 }"
            placeholder="{&quot;love&quot;:&quot;...&quot;,&quot;authority&quot;:&quot;...&quot;}"
          />
          <Alert
            type="info"
            show-icon
            message="Enter valid JSON. It will be stored in relationship_profile."
          />
        </div>
      </template>

      <template #timeline="slotProps">
        <div class="w-full space-y-2">
          <Input.TextArea
            v-bind="slotProps"
            :auto-size="{ minRows: 5, maxRows: 10 }"
            placeholder="Milestone title|Milestone summary"
          />
          <Alert
            type="info"
            show-icon
            message="Use one line per item with the format: title|summary."
          />
        </div>
      </template>
    </Form>
  </Drawer>
</template>
