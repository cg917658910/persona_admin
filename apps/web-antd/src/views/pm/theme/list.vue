<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmThemeApi } from '#/api/pm/theme';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteTheme, getThemePage } from '#/api/pm/theme';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

type ActionClickParams<T> = { code: string; row: T };

const activeSubjectType = ref<'character' | 'relation'>('character');

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
          await getThemePage({
            page: page.currentPage,
            pageSize: page.pageSize,
            subjectType: activeSubjectType.value,
            ...formValues,
          }),
      },
    },
    rowConfig: { keyField: 'id' },
    toolbarConfig: { custom: true, export: false, refresh: true, search: true, zoom: true },
  } as VxeTableGridOptions<PmThemeApi.ThemeItem>,
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

function onActionClick(e: ActionClickParams<PmThemeApi.ThemeItem>) {
  if (e.code === 'edit') {
    formDrawerApi.setData(e.row).open();
    return;
  }
  onDelete(e.row);
}

function onDelete(row: PmThemeApi.ThemeItem) {
  confirm(`删除主题「${row.name}」？`, '删除主题')
    .then(async () => {
      await deleteTheme(String(row.id || row.slug));
      message.success(`已删除 ${row.name}`);
      onRefresh();
    })
    .catch(() => undefined);
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({ subjectType: activeSubjectType.value }).open();
}

function onTabChange(key: string | number) {
  activeSubjectType.value = key === 'relation' ? 'relation' : 'character';
  onRefresh();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />

    <div class="mb-4">
      <Tabs :active-key="activeSubjectType" @change="onTabChange">
        <Tabs.TabPane key="character" :tab="'\u4eba\u7269\u4e3b\u9898'" />
        <Tabs.TabPane key="relation" :tab="'\u5173\u7cfb\u4e3b\u9898'" />
      </Tabs>
    </div>

    <Grid table-title="主题集管理">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新建主题
        </Button>
      </template>
    </Grid>
  </Page>
</template>
