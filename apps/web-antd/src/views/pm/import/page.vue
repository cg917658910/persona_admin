<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Button,
  Card,
  Descriptions,
  Input,
  message,
  Tabs,
  Tag,
  Upload,
} from 'ant-design-vue';

import {
  runGeneratedImport,
  runRelationImport,
  validateGeneratedImport,
  validateRelationImport,
} from '#/api/pm/import';

const activeTab = ref<'generated' | 'relation'>('generated');
const rawText = ref('');
const result = ref<any>(null);
const loading = ref(false);
const tabItems = [
  { key: 'generated', label: '人物生成包导入' },
  { key: 'relation', label: '关系包导入' },
] as const;

const uploadProps: UploadProps = {
  accept: '.json',
  beforeUpload(file) {
    file
      .text()
      .then((text) => {
        rawText.value = text;
      })
      .catch(() => {
        message.error('读取文件失败');
      });
    return false;
  },
  maxCount: 1,
};

const requestPayload = computed(() => {
  const parsed = parseJSON();
  if (!parsed) {
    return null;
  }
  return { package: parsed };
});

function parseJSON() {
  try {
    return rawText.value ? JSON.parse(rawText.value) : null;
  } catch {
    return null;
  }
}

async function onValidate() {
  const payload = requestPayload.value;
  if (!payload) {
    message.error('请先输入或上传合法 JSON');
    return;
  }
  loading.value = true;
  try {
    result.value =
      activeTab.value === 'relation'
        ? await validateRelationImport(payload)
        : await validateGeneratedImport(payload);
    message.success('预检查完成');
  } finally {
    loading.value = false;
  }
}

async function onImport() {
  const payload = requestPayload.value;
  if (!payload) {
    message.error('请先输入或上传合法 JSON');
    return;
  }
  loading.value = true;
  try {
    result.value =
      activeTab.value === 'relation'
        ? await runRelationImport(payload)
        : await runGeneratedImport(payload);
    message.success('导入完成');
  } finally {
    loading.value = false;
  }
}

function onTabChange(key: number | string) {
  activeTab.value = key === 'relation' ? 'relation' : 'generated';
  result.value = null;
}
</script>

<template>
  <Page auto-content-height>
    <Tabs :active-key="activeTab" class="mb-4" @change="onTabChange">
      <Tabs.TabPane
        v-for="item in tabItems"
        :key="item.key"
        :tab="item.label"
      />
    </Tabs>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card
        :title="activeTab === 'relation' ? '关系导入 JSON' : '人物生成包 JSON'"
      >
        <div class="space-y-4">
          <Upload v-bind="uploadProps">
            <Button>选择 JSON 文件</Button>
          </Upload>

          <Input.TextArea
            v-model:value="rawText"
            :auto-size="{ minRows: 16, maxRows: 28 }"
            placeholder="粘贴 JSON 内容，或上方选择文件。"
          />

          <div class="flex gap-3">
            <Button :loading="loading" @click="onValidate">预检查</Button>
            <Button type="primary" :loading="loading" @click="onImport">
              正式导入
            </Button>
          </div>
        </div>
      </Card>

      <div class="space-y-4">
        <Alert
          :message="
            activeTab === 'relation'
              ? '关系包会调用 /admin/relation-imports/*，并写入关系主表、关系线、关系歌曲、关系主题和关联关系。'
              : '人物生成包会调用 /admin/imports/*，并写入主题、创作者、作品、人物和歌曲。'
          "
          show-icon
          type="info"
        />

        <Card title="导入结果">
          <template v-if="result">
            <Descriptions :column="1" size="small">
              <Descriptions.Item label="结果">
                <Tag :color="result.valid ? 'green' : 'red'">
                  {{ result.valid ? '通过' : '未通过' }}
                </Tag>
                <Tag v-if="result.imported" color="blue">已导入</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="包版本">
                {{ result.packageVersion || '-' }}
              </Descriptions.Item>
            </Descriptions>

            <div v-if="result.summary" class="mt-4 space-y-2 text-sm">
              <div>主题：{{ result.summary.themes || 0 }}</div>
              <div>创作者：{{ result.summary.creators || 0 }}</div>
              <div>作品：{{ result.summary.works || 0 }}</div>
              <div>人物：{{ result.summary.characters || 0 }}</div>
              <div>歌曲：{{ result.summary.songs || 0 }}</div>
              <div v-if="activeTab === 'relation'">
                关系：{{ result.summary.relations || 0 }}
              </div>
              <div v-if="activeTab === 'relation'">
                关系线：{{ result.summary.relationEvents || 0 }}
              </div>
              <div v-if="activeTab === 'relation'">
                关系歌曲：{{ result.summary.relationSongs || 0 }}
              </div>
            </div>

            <div v-if="result.warnings?.length" class="mt-4">
              <div class="mb-2 font-medium">警告</div>
              <ul class="list-disc pl-5 text-sm text-amber-300">
                <li v-for="item in result.warnings" :key="item">{{ item }}</li>
              </ul>
            </div>

            <div v-if="result.errors?.length" class="mt-4">
              <div class="mb-2 font-medium">错误</div>
              <ul class="list-disc pl-5 text-sm text-red-300">
                <li v-for="item in result.errors" :key="item">{{ item }}</li>
              </ul>
            </div>
          </template>

          <div v-else class="text-text-secondary text-sm">
            先做预检查，再决定是否正式导入。
          </div>
        </Card>
      </div>
    </div>
  </Page>
</template>
