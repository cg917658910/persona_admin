<script lang="ts" setup>
import type { PmResourceApi } from '#/api/pm/resource';

import { ref } from 'vue';

import { Button, Input, message } from 'ant-design-vue';

import { uploadResource } from '#/api/pm/upload';

const props = withDefaults(
  defineProps<{
    accept?: string;
    modelValue?: string;
    placeholder?: string;
    resourceType: PmResourceApi.ResourceType;
  }>(),
  {
    accept: '',
    modelValue: '',
    placeholder: '',
  },
);

const emit = defineEmits<{
  uploaded: [url: string];
  'update:modelValue': [value: string];
}>();

const fileInputRef = ref<HTMLInputElement>();
const uploading = ref(false);

function updateValue(value: string) {
  emit('update:modelValue', value);
}

function openPicker() {
  fileInputRef.value?.click();
}

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  target.value = '';
  if (!file) {
    return;
  }

  uploading.value = true;
  try {
    const result = await uploadResource(file, props.resourceType);
    updateValue(result.url);
    emit('uploaded', result.url);
    message.success(`已上传${file.name}`);
  } catch (error: any) {
    message.error(error?.message || '上传失败');
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <div class="w-full space-y-2">
    <div class="flex gap-2">
      <Input
        :model-value="modelValue"
        :placeholder="placeholder"
        @update:value="updateValue"
      />
      <Button :loading="uploading" @click="openPicker">
        上传文件
      </Button>
    </div>

    <input
      ref="fileInputRef"
      :accept="accept"
      class="hidden"
      type="file"
      @change="onFileChange"
    />

    <img
      v-if="resourceType === 'image' && modelValue"
      :src="modelValue"
      class="h-24 rounded border object-cover"
    />

    <audio
      v-else-if="resourceType === 'audio' && modelValue"
      :src="modelValue"
      controls
      class="w-full"
    />
  </div>
</template>
