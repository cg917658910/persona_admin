<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmDictApi } from '#/api/pm/dict';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDictItem, dictLabels, getDictPage } from '#/api/pm/dict';

import { DICT_OPTIONS, useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

type ActionClickParams<T> = { code: string; row: T };

const currentDictKey = ref<PmDictApi.DictKey>('characterTypes');

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) =>
          await getDictPage(currentDictKey.value, {
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          }),
      },
    },
    rowConfig: { keyField: 'id' },
    toolbarConfig: { custom: true, export: false, refresh: true, search: true, zoom: true },
  } as VxeTableGridOptions<PmDictApi.DictItem>,
});

function confirm(content: string, title: string) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      content,
      title,
      onOk() {
        resolve(true);
      },
      onCancel() {
        reject(new Error('cancelled'));
      },
    });
  });
}

function onActionClick(e: ActionClickParams<PmDictApi.DictItem>) {
  if (e.code === 'edit') {
    formDrawerApi.setData({ dictKey: currentDictKey.value, record: e.row }).open();
    return;
  }
  onDelete(e.row);
}

function onDelete(row: PmDictApi.DictItem) {
  confirm(`停用字典项「${row.name || row.code}」？`, '停用字典项')
    .then(async () => {
      await deleteDictItem(currentDictKey.value, String(row.id || row.code));
      message.success(`已停用 ${row.name || row.code}`);
      onRefresh();
    })
    .catch(() => undefined);
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({ dictKey: currentDictKey.value }).open();
}

function onTabChange(key: string | number) {
  currentDictKey.value = key as PmDictApi.DictKey;
  onRefresh();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />

    <div class="mb-4">
      <Tabs :active-key="currentDictKey" @change="onTabChange">
        <Tabs.TabPane
          v-for="item in DICT_OPTIONS"
          :key="item.key"
          :tab="item.label"
        />
      </Tabs>
    </div>

    <Grid :table-title="dictLabels[currentDictKey]">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新建字典项
        </Button>
      </template>
    </Grid>
  </Page>
</template>
