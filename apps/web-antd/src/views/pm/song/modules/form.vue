<script lang="ts" setup>
import { nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { Alert, Input, Select, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getCharacterOptions } from '#/api/pm/shared';
import { createSong, getSongDetail, updateSong } from '#/api/pm/song';
import ResourceField from '#/views/pm/components/ResourceField.vue';

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
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const values = await formApi.getValues();
    drawerApi.lock();
    try {
      const payload = normalizePayload(values);
      if (id.value) {
        await updateSong(id.value, payload);
        message.success('歌曲已更新');
      } else {
        await createSong(payload);
        message.success('歌曲已创建');
      }
      emits('success');
      drawerApi.close();
    } catch (error: any) {
      message.error(error?.message || '歌曲保存失败');
    } finally {
      drawerApi.unlock();
    }
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
    characterOptions.value = await getCharacterOptions('id');
  }
  const data = drawerApi.getData<any>() || {};
  id.value = data?.id;
  if (id.value || data?.slug) {
    const detail = await getSongDetail(String(id.value || data.slug));
    await nextTick();
    await (formApi as any).setValues(toFormValues(detail));
  } else {
    await nextTick();
    await (formApi as any).setValues({ status: 'draft' });
  }
}

function splitTags(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return String(value || '')
    .replaceAll('，', ',')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toFormValues(detail: any) {
  return {
    ...detail,
    characterId: String(detail.characterId || drawerApi.getData<any>()?.characterId || ''),
    emotionalCurve: (detail.emotionalCurve || []).join(', '),
    styles: (detail.styles || []).join(', '),
  };
}

function normalizePayload(values: any) {
  return {
    ...values,
    characterId: String(values.characterId || '').trim(),
    emotionalCurve: splitTags(values.emotionalCurve),
    styles: splitTags(values.styles),
  };
}
</script>

<template>
  <Drawer :title="id ? '编辑歌曲' : '新建歌曲'" class="w-[900px]">
    <Form>
      <template #characterId="slotProps">
        <Select
          :value="slotProps.modelValue"
          show-search
          :options="characterOptions"
          placeholder="选择关联人物"
          @update:value="slotProps['onUpdate:modelValue']"
        />
      </template>
      <template #coverUrl="slotProps">
        <ResourceField
          :model-value="slotProps.modelValue"
          accept="image/*"
          placeholder="/assets/images/songs/xxx.webp"
          resource-type="image"
          @update:model-value="slotProps['onUpdate:modelValue']"
        />
      </template>
      <template #audioUrl="slotProps">
        <ResourceField
          :model-value="slotProps.modelValue"
          accept="audio/*"
          placeholder="/assets/audio/xxx.mp3"
          resource-type="audio"
          @update:model-value="slotProps['onUpdate:modelValue']"
        />
      </template>
      <template #styles="slotProps">
        <div class="w-full space-y-2">
          <Input v-bind="slotProps" placeholder="国风, 抒情, 史诗" />
          <Alert type="info" show-icon message="多个风格标签请用逗号分隔。" />
        </div>
      </template>
      <template #emotionalCurve="slotProps">
        <div class="w-full space-y-2">
          <Input v-bind="slotProps" placeholder="压抑, 爆发, 余震" />
          <Alert type="info" show-icon message="情绪变化阶段请用逗号分隔。" />
        </div>
      </template>
      <template #lyrics="slotProps">
        <Input.TextArea
          v-bind="slotProps"
          :auto-size="{ minRows: 6, maxRows: 12 }"
          placeholder="填写歌词正文"
        />
      </template>
      <template #prompt="slotProps">
        <Input.TextArea
          v-bind="slotProps"
          :auto-size="{ minRows: 5, maxRows: 10 }"
          placeholder="填写歌曲生成提示词"
        />
      </template>
    </Form>
  </Drawer>
</template>
