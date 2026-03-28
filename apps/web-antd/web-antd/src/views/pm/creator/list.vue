<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmCreatorApi } from '#/api/pm/creator';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteCreator, getCreatorPage } from '#/api/pm/creator';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

type ActionClickParams<T> = { code: string; row: T };

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
          await getCreatorPage({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          }),
      },
    },
    rowConfig: { keyField: 'id' },
    toolbarConfig: { custom: true, export: false, refresh: true, search: true, zoom: true },
  } as VxeTableGridOptions<PmCreatorApi.CreatorItem>,
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

function onActionClick(e: ActionClickParams<PmCreatorApi.CreatorItem>) {
  if (e.code === 'edit') {
    formDrawerApi.setData({ record: e.row }).open();
    return;
  }
  onDelete(e.row);
}

function onDelete(row: PmCreatorApi.CreatorItem) {
  confirm(`Delete ${row.name}?`, 'Delete Creator')
    .then(async () => {
      await deleteCreator(String(row.id || row.slug));
      message.success(`Deleted ${row.name}`);
      onRefresh();
    })
    .catch(() => undefined);
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({}).open();
}
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid table-title="创作者管理">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新建创作者
        </Button>
      </template>
    </Grid>
  </Page>
</template>
