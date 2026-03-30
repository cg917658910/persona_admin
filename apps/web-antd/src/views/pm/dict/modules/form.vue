<script lang="ts" setup>
import type { PmDictApi } from '#/api/pm/dict';

import { computed, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import {
  createDictItem,
  dictLabels,
  getDictDetail,
  getDictPage,
  updateDictItem,
} from '#/api/pm/dict';

import {
  motivationCategoryOptions,
  needsCategory,
  needsCoverUrl,
  needsDescription,
  needsParent,
  needsRegionType,
  regionTypeOptions,
} from '../data';

interface DrawerData {
  dictKey?: PmDictApi.DictKey;
  record?: PmDictApi.DictItem;
}

const emit = defineEmits<{ success: [] }>();
const currentDictKey = ref<PmDictApi.DictKey>('characterTypes');
const editingId = ref('');
const loading = ref(false);
const parentFetching = ref(false);
const parentOptions = ref<Array<{ label: string; value: string }>>([]);

const formState = reactive<PmDictApi.DictItem>({
  code: '',
  coverUrl: '',
  category: '',
  description: '',
  dictKey: 'characterTypes',
  isActive: true,
  name: '',
  parentCode: '',
  regionType: '',
  sortOrder: 100,
});

const title = computed(() => {
  const verb = editingId.value ? '编辑' : '新建';
  return `${verb}${dictLabels[currentDictKey.value]}`;
});

function resetFormState() {
  formState.code = '';
  formState.coverUrl = '';
  formState.category = currentDictKey.value === 'motivations' ? 'core' : '';
  formState.description = '';
  formState.dictKey = currentDictKey.value;
  formState.isActive = true;
  formState.name = '';
  formState.parentCode = '';
  formState.regionType = currentDictKey.value === 'regions' ? 'country' : '';
  formState.sortOrder = 100;
}

async function loadParentOptions(keyword = '') {
  if (!needsParent(currentDictKey.value)) {
    parentOptions.value = [];
    return;
  }
  parentFetching.value = true;
  try {
    const page = await getDictPage(currentDictKey.value, {
      keyword,
      page: 1,
      pageSize: 50,
    });
    parentOptions.value = page.items
      .filter((item) => String(item.id || '') !== editingId.value)
      .map((item) => ({
        label: `${item.name} (${item.code})`,
        value: item.code,
      }));
  } finally {
    parentFetching.value = false;
  }
}

async function handleParentSearch(keyword: string) {
  await loadParentOptions(keyword);
}

function validateForm() {
  if (!formState.code.trim()) {
    throw new Error('请输入 code');
  }
  if (!formState.name.trim()) {
    throw new Error('请输入名称');
  }
}

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: async () => {
    try {
      validateForm();
      loading.value = true;
      const payload: Partial<PmDictApi.DictItem> = {
        category: needsCategory(currentDictKey.value) ? formState.category : '',
        code: formState.code.trim(),
        coverUrl: needsCoverUrl(currentDictKey.value) ? formState.coverUrl?.trim() : '',
        description: needsDescription(currentDictKey.value)
          ? formState.description?.trim()
          : '',
        dictKey: currentDictKey.value,
        isActive: formState.isActive ?? true,
        name: formState.name.trim(),
        parentCode: needsParent(currentDictKey.value)
          ? formState.parentCode?.trim()
          : '',
        regionType: needsRegionType(currentDictKey.value)
          ? formState.regionType
          : '',
        sortOrder: formState.sortOrder ?? 100,
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
    } finally {
      loading.value = false;
    }
  },
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      editingId.value = '';
      currentDictKey.value = 'characterTypes';
      resetFormState();
      parentOptions.value = [];
      return;
    }

    const payload = drawerApi.getData<DrawerData>() || {};
    currentDictKey.value = payload.dictKey || 'characterTypes';
    editingId.value = String(payload.record?.id || '');
    resetFormState();
    await loadParentOptions();

    const detail =
      payload.record && payload.record.id
        ? await getDictDetail(currentDictKey.value, String(payload.record.id))
        : payload.record;

    if (detail) {
      formState.code = detail.code || '';
      formState.coverUrl = detail.coverUrl || '';
      formState.category = detail.category || formState.category;
      formState.description = detail.description || '';
      formState.isActive = detail.isActive ?? true;
      formState.name = detail.name || '';
      formState.parentCode = detail.parentCode || '';
      formState.regionType = detail.regionType || formState.regionType;
      formState.sortOrder = detail.sortOrder ?? 100;
    }

    drawerApi.setState({ title: title.value });
  },
});
</script>

<template>
  <Drawer class="w-[620px]">
    <a-form
      :label-col="{ span: 6 }"
      :model="formState"
      :wrapper-col="{ span: 18 }"
      layout="horizontal"
    >
      <a-form-item label="Code" required>
        <a-input v-model:value="formState.code" />
      </a-form-item>

      <a-form-item label="名称" required>
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item v-if="needsCategory(currentDictKey)" label="分类">
        <a-select
          v-model:value="formState.category"
          :options="motivationCategoryOptions"
        />
      </a-form-item>

      <a-form-item v-if="needsRegionType(currentDictKey)" label="地区类型">
        <a-select
          v-model:value="formState.regionType"
          :options="regionTypeOptions"
        />
      </a-form-item>

      <a-form-item v-if="needsParent(currentDictKey)" label="父级">
        <a-select
          v-model:value="formState.parentCode"
          allow-clear
          show-search
          :filter-option="false"
          :loading="parentFetching"
          :options="parentOptions"
          placeholder="输入名称或 code 搜索父级"
          @focus="handleParentSearch('')"
          @search="handleParentSearch"
        />
      </a-form-item>

      <a-form-item v-if="needsDescription(currentDictKey)" label="说明">
        <a-textarea
          v-model:value="formState.description"
          :auto-size="{ minRows: 3, maxRows: 6 }"
        />
      </a-form-item>

      <a-form-item v-if="needsCoverUrl(currentDictKey)" label="封面图地址">
        <a-input v-model:value="formState.coverUrl" />
      </a-form-item>

      <a-form-item label="排序">
        <a-input-number
          v-model:value="formState.sortOrder"
          :min="0"
          class="w-full"
        />
      </a-form-item>

      <a-form-item label="启用">
        <a-switch v-model:checked="formState.isActive" />
      </a-form-item>
    </a-form>
  </Drawer>
</template>
