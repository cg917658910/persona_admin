<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PmSongApi } from '#/api/pm/song';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteSong, getSongPage } from '#/api/pm/song';

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
          await getSongPage({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          }),
      },
    },
    rowConfig: { keyField: 'id' },
    toolbarConfig: { custom: true, export: false, refresh: true, search: true, zoom: true },
  } as VxeTableGridOptions<PmSongApi.SongItem>,
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

function onActionClick(e: ActionClickParams<PmSongApi.SongItem>) {
  if (e.code === 'edit') {
    formDrawerApi.setData(e.row).open();
    return;
  }
  onDelete(e.row);
}

function onDelete(row: PmSongApi.SongItem) {
  confirm(`删除歌曲「${row.title}」？`, '删除歌曲')
    .then(async () => {
      await deleteSong(String(row.id || row.slug));
      message.success(`已删除 ${row.title}`);
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
    <Grid table-title="歌曲管理">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新建歌曲
        </Button>
      </template>
    </Grid>
  </Page>
</template>
