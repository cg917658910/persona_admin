<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { Button, Input, Select, Switch, Tag, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getRelationDetail, createRelation, updateRelation } from '#/api/pm/relation';
import {
  getCharacterOptions,
  getRelationOptions,
  getThemeOptions,
  getWorkOptions,
  queryCharacterOptions,
  queryRelationOptions,
  queryWorkOptions,
} from '#/api/pm/shared';
import ResourceField from '#/views/pm/components/ResourceField.vue';

import {
  LINK_TYPE_OPTIONS,
  STATUS_OPTIONS,
  useFormSchema,
} from '../data';

interface RelationPaletteItem {
  hex: string;
  name?: string;
}

interface RelationPhenomenology {
  body?: string;
  gaze?: string;
  language?: string;
  space?: string;
  time?: string;
}

interface RelationEvent {
  colorHex?: string;
  eventQuote?: string;
  fateImpact?: string;
  powerShift?: string;
  sortOrder?: number;
  sourceState?: string;
  stageCode?: string;
  stageNo?: number;
  summary?: string;
  targetState?: string;
  tensionShift?: string;
  title?: string;
}

interface RelationSong {
  audioUrl?: string;
  coverUrl?: string;
  isPrimary?: boolean;
  lyric?: string;
  prompt?: string;
  slug?: string;
  songCoreTheme?: string;
  songEmotionalCurve?: string;
  songStyles?: string[];
  sortOrder?: number;
  status?: string;
  subtitle?: string;
  summary?: string;
  tempoBpm?: number;
  title?: string;
  vocalProfile?: string;
}

interface RelationLink {
  linkTypeCode?: string;
  linkedRelationSlug?: string;
  reason?: string;
  sortOrder?: number;
}

const emits = defineEmits(['success']);

const id = ref<string>();
const characterOptions = ref<{ label: string; value: string }[]>([]);
const workOptions = ref<{ label: string; value: string }[]>([]);
const themeOptions = ref<{ label: string; value: string }[]>([]);
const relationOptions = ref<{ label: string; value: string }[]>([]);

const phenomenology = ref<RelationPhenomenology>(emptyPhenomenology());
const relationPaletteItems = ref<RelationPaletteItem[]>([]);
const eventItems = ref<RelationEvent[]>([]);
const songItems = ref<RelationSong[]>([]);
const linkItems = ref<RelationLink[]>([]);

const DEFAULT_VALUES = {
  relationTypeCode: 'partner',
  sortOrder: 100,
  status: 'draft',
  themeSlugs: [],
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
    const sourceSlug = String(values.sourceCharacterSlug || '').trim();
    const targetSlug = String(values.targetCharacterSlug || '').trim();
    if (sourceSlug && targetSlug && sourceSlug === targetSlug) {
      message.error('人物 1 和人物 2 不能是同一个人物');
      return;
    }

    const duplicateSongSlug = findDuplicate(
      songItems.value.map((item) => String(item.slug || '').trim()).filter(Boolean),
    );
    if (duplicateSongSlug) {
      message.error(`关系歌曲 slug 重复：${duplicateSongSlug}`);
      return;
    }

    const duplicateLinkSlug = findDuplicate(
      linkItems.value
        .map((item) => String(item.linkedRelationSlug || '').trim())
        .filter(Boolean),
    );
    if (duplicateLinkSlug) {
      message.error(`关联关系重复：${duplicateLinkSlug}`);
      return;
    }

    if (
      linkItems.value.some(
        (item) =>
          String(item.linkedRelationSlug || '').trim() === String(values.slug || '').trim(),
      )
    ) {
      message.error('关联关系不能指向自己');
      return;
    }

    drawerApi.lock();
    try {
      const payload = normalizePayload(values);
      await (id.value ? updateRelation(id.value, payload) : createRelation(payload));
      emits('success');
      drawerApi.close();
    } finally {
      drawerApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      id.value = undefined;
      resetStructuredFields();
      await formApi.resetForm();
      return;
    }
    await setupForm();
  },
});

const drawerTitle = computed(() => (id.value ? '编辑关系' : '新建关系'));

function findDuplicate(items: string[]) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item)) {
      return item;
    }
    seen.add(item);
  }
  return '';
}

async function ensureOptions() {
  if (characterOptions.value.length === 0) {
    characterOptions.value = await getCharacterOptions();
  }
  if (workOptions.value.length === 0) {
    workOptions.value = await getWorkOptions();
  }
  if (themeOptions.value.length === 0) {
    themeOptions.value = await getThemeOptions('relation');
  }
  if (relationOptions.value.length === 0) {
    relationOptions.value = await getRelationOptions();
  }
}

async function onCharacterSearch(keyword: string) {
  characterOptions.value = await queryCharacterOptions(keyword);
}

async function onWorkSearch(keyword: string) {
  workOptions.value = await queryWorkOptions(keyword);
}

async function onRelationSearch(keyword: string) {
  relationOptions.value = await queryRelationOptions(keyword);
}

function emptyPhenomenology(): RelationPhenomenology {
  return {
    body: '',
    gaze: '',
    language: '',
    space: '',
    time: '',
  };
}

function newPaletteItem(index = 0): RelationPaletteItem {
  return {
    hex: '',
    name: `色板 ${index + 1}`,
  };
}

function newEventItem(index = 0): RelationEvent {
  return {
    colorHex: '',
    eventQuote: '',
    fateImpact: '',
    powerShift: '',
    sortOrder: index + 1,
    sourceState: '',
    stageCode: '',
    stageNo: index + 1,
    summary: '',
    targetState: '',
    tensionShift: '',
    title: '',
  };
}

function newSongItem(index = 0): RelationSong {
  return {
    audioUrl: '',
    coverUrl: '',
    isPrimary: index === 0,
    lyric: '',
    prompt: '',
    slug: '',
    songCoreTheme: '',
    songEmotionalCurve: '',
    songStyles: [],
    sortOrder: index + 1,
    status: 'draft',
    subtitle: '',
    summary: '',
    tempoBpm: 0,
    title: '',
    vocalProfile: '',
  };
}

function newLinkItem(index = 0): RelationLink {
  return {
    linkTypeCode: 'related',
    linkedRelationSlug: '',
    reason: '',
    sortOrder: index + 1,
  };
}

function resetStructuredFields() {
  phenomenology.value = emptyPhenomenology();
  relationPaletteItems.value = [];
  eventItems.value = [];
  songItems.value = [];
  linkItems.value = [];
}

async function setupForm() {
  await formApi.resetForm();
  resetStructuredFields();
  await ensureOptions();

  const data = drawerApi.getData<any>() || {};
  id.value = data?.id;
  if (id.value || data?.slug) {
    const detail = await getRelationDetail(String(id.value || data.slug));
    relationPaletteItems.value = [...(detail.relationPalette || [])];
    phenomenology.value = detail.phenomenology || emptyPhenomenology();
    eventItems.value = [...(detail.events || [])];
    songItems.value = [...(detail.songs || [])];
    linkItems.value = [...(detail.links || [])];

    await nextTick();
    await formApi.setValues(toFormValues(detail));
    return;
  }

  relationPaletteItems.value = [newPaletteItem()];
  eventItems.value = [newEventItem()];
  songItems.value = [newSongItem()];
  linkItems.value = [];

  await nextTick();
  await formApi.setValues(DEFAULT_VALUES);
}

function splitTags(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
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
    relationKeywords: (detail.relationKeywords || []).join(', '),
    symbolicImages: (detail.symbolicImages || []).join(', '),
    tensionTags: (detail.tensionTags || []).join(', '),
    themeSlugs: detail.themeSlugs || [],
  };
}

function normalizePayload(values: any) {
  const normalizedSongs = songItems.value
    .map((item, index) => ({
      ...item,
      isPrimary: Boolean(item.isPrimary),
      slug: String(item.slug || '').trim(),
      songStyles: splitTags(item.songStyles || []),
      sortOrder: item.sortOrder || index + 1,
      status: item.status || 'draft',
      title: String(item.title || '').trim(),
    }))
    .filter((item) => item.slug && item.title);

  if (normalizedSongs.length > 0 && !normalizedSongs.some((item) => item.isPrimary)) {
    normalizedSongs[0]!.isPrimary = true;
  }

  return {
    ...values,
    events: eventItems.value
      .map((item, index) => ({
        ...item,
        sortOrder: item.sortOrder || index + 1,
        stageNo: item.stageNo || index + 1,
        title: String(item.title || '').trim(),
      }))
      .filter((item) => item.title),
    links: linkItems.value
      .map((item, index) => ({
        ...item,
        linkedRelationSlug: String(item.linkedRelationSlug || '').trim(),
        sortOrder: item.sortOrder || index + 1,
      }))
      .filter((item) => item.linkedRelationSlug),
    phenomenology: {
      body: phenomenology.value.body || '',
      gaze: phenomenology.value.gaze || '',
      language: phenomenology.value.language || '',
      space: phenomenology.value.space || '',
      time: phenomenology.value.time || '',
    },
    relationKeywords: splitTags(values.relationKeywords),
    relationPalette: relationPaletteItems.value
      .map((item) => ({
        hex: String(item.hex || '').trim(),
        name: String(item.name || '').trim(),
      }))
      .filter((item) => item.hex),
    songs: normalizedSongs,
    symbolicImages: splitTags(values.symbolicImages),
    tensionTags: splitTags(values.tensionTags),
    themeSlugs: values.themeSlugs || [],
  };
}

function addPaletteItem() {
  relationPaletteItems.value.push(newPaletteItem(relationPaletteItems.value.length));
}

function addEventItem() {
  eventItems.value.push(newEventItem(eventItems.value.length));
}

function addSongItem() {
  const next = newSongItem(songItems.value.length);
  if (songItems.value.length > 0) {
    next.isPrimary = false;
  }
  songItems.value.push(next);
}

function addLinkItem() {
  linkItems.value.push(newLinkItem(linkItems.value.length));
}

function markPrimarySong(targetIndex: number) {
  songItems.value = songItems.value.map((item, index) => ({
    ...item,
    isPrimary: index === targetIndex,
  }));
}
</script>

<template>
  <Drawer :title="drawerTitle" class="w-[1080px]">
    <Form>
      <template #coverUrl="slotProps">
        <ResourceField
          :model-value="slotProps.modelValue"
          accept="image/*"
          placeholder="/assets/images/relations/xxx.webp"
          resource-type="image"
          @update:model-value="slotProps['onUpdate:modelValue']"
        />
      </template>

      <template #workSlug="slotProps">
        <Select
          v-bind="slotProps"
          :filter-option="false"
          :options="workOptions"
          allow-clear
          placeholder="选择所属作品"
          show-search
          @search="onWorkSearch"
        />
      </template>

      <template #sourceCharacterSlug="slotProps">
        <Select
          v-bind="slotProps"
          :filter-option="false"
          :options="characterOptions"
          allow-clear
          placeholder="选择人物 1"
          show-search
          @search="onCharacterSearch"
        />
      </template>

      <template #targetCharacterSlug="slotProps">
        <Select
          v-bind="slotProps"
          :filter-option="false"
          :options="characterOptions"
          allow-clear
          placeholder="选择人物 2"
          show-search
          @search="onCharacterSearch"
        />
      </template>

      <template #themeSlugs="slotProps">
        <div class="w-full space-y-2">
          <Select
            v-bind="slotProps"
            mode="multiple"
            :max-tag-count="4"
            :options="themeOptions"
            placeholder="选择关系主题"
          />
          <div class="flex flex-wrap gap-1">
            <Tag v-for="slug in slotProps.modelValue || []" :key="slug">{{ slug }}</Tag>
          </div>
        </div>
      </template>

      <template #phenomenology>
        <div class="grid grid-cols-2 gap-3">
          <Input.TextArea
            v-model:value="phenomenology.body"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="身体感受"
          />
          <Input.TextArea
            v-model:value="phenomenology.time"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="时间体验"
          />
          <Input.TextArea
            v-model:value="phenomenology.space"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="空间感"
          />
          <Input.TextArea
            v-model:value="phenomenology.gaze"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="注视"
          />
          <Input.TextArea
            v-model:value="phenomenology.language"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            class="col-span-2"
            placeholder="语言与沉默"
          />
        </div>
      </template>

      <template #relationPalette>
        <div class="space-y-3">
          <div
            v-for="(item, index) in relationPaletteItems"
            :key="`palette-${index}`"
            class="grid grid-cols-[1fr,160px,auto] gap-2"
          >
            <Input v-model:value="item.name" placeholder="色板名称" />
            <Input v-model:value="item.hex" placeholder="#C8A96B" />
            <Button danger @click="relationPaletteItems.splice(index, 1)">删除</Button>
          </div>
          <Button block @click="addPaletteItem">新增色板</Button>
        </div>
      </template>

      <template #events>
        <div class="space-y-4">
          <div
            v-for="(item, index) in eventItems"
            :key="`event-${index}`"
            class="rounded-xl border border-border px-4 py-4"
          >
            <div class="mb-3 grid grid-cols-[120px,160px,1fr,auto] gap-2">
              <Input v-model:value="item.stageNo" placeholder="阶段序号" />
              <Input v-model:value="item.stageCode" placeholder="阶段代码" />
              <Input v-model:value="item.title" placeholder="阶段标题" />
              <Button danger @click="eventItems.splice(index, 1)">删除</Button>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <Input.TextArea
                v-model:value="item.summary"
                :auto-size="{ minRows: 2, maxRows: 4 }"
                placeholder="阶段摘要"
              />
              <Input.TextArea
                v-model:value="item.eventQuote"
                :auto-size="{ minRows: 2, maxRows: 4 }"
                placeholder="阶段引语"
              />
              <Input v-model:value="item.tensionShift" placeholder="张力变化" />
              <Input v-model:value="item.powerShift" placeholder="权力变化" />
              <Input v-model:value="item.fateImpact" placeholder="命运影响" />
              <Input v-model:value="item.colorHex" placeholder="节点颜色 #A88B4A" />
              <Input v-model:value="item.sourceState" placeholder="人物 1 状态" />
              <Input v-model:value="item.targetState" placeholder="人物 2 状态" />
            </div>
          </div>
          <Button block @click="addEventItem">新增阶段</Button>
        </div>
      </template>

      <template #songs>
        <div class="space-y-4">
          <div
            v-for="(item, index) in songItems"
            :key="`song-${index}`"
            class="rounded-xl border border-border px-4 py-4"
          >
            <div class="mb-3 grid grid-cols-[1fr,180px,180px,auto] gap-2">
              <Input v-model:value="item.title" placeholder="歌曲标题" />
              <Input v-model:value="item.slug" placeholder="歌曲 slug" />
              <Select v-model:value="item.status" :options="STATUS_OPTIONS" />
              <Button danger @click="songItems.splice(index, 1)">删除</Button>
            </div>
            <div class="mb-3 grid grid-cols-2 gap-2">
              <Input v-model:value="item.subtitle" placeholder="副标题" />
              <Input v-model:value="item.songCoreTheme" placeholder="歌曲核心主题" />
              <Input v-model:value="item.songEmotionalCurve" placeholder="情绪曲线" />
              <Input
                :model-value="Array.isArray(item.songStyles) ? item.songStyles.join(', ') : ''"
                placeholder="风格标签，逗号分隔"
                @update:value="item.songStyles = splitTags($event)"
              />
              <Input v-model:value="item.vocalProfile" placeholder="人声设定" />
              <Input v-model:value="item.tempoBpm" placeholder="Tempo BPM" />
            </div>
            <div class="mb-3 grid grid-cols-2 gap-3">
              <ResourceField
                :model-value="item.coverUrl"
                accept="image/*"
                placeholder="/assets/images/relations/song-cover.webp"
                resource-type="image"
                @update:model-value="item.coverUrl = $event"
              />
              <ResourceField
                :model-value="item.audioUrl"
                accept="audio/*"
                placeholder="/assets/audio/relationship-song.mp3"
                resource-type="audio"
                @update:model-value="item.audioUrl = $event"
              />
            </div>
            <Input.TextArea
              v-model:value="item.summary"
              :auto-size="{ minRows: 2, maxRows: 4 }"
              class="mb-3"
              placeholder="歌曲简介"
            />
            <Input.TextArea
              v-model:value="item.prompt"
              :auto-size="{ minRows: 2, maxRows: 4 }"
              class="mb-3"
              placeholder="歌曲提示词"
            />
            <Input.TextArea
              v-model:value="item.lyric"
              :auto-size="{ minRows: 3, maxRows: 8 }"
              class="mb-3"
              placeholder="歌词"
            />
            <div class="flex items-center justify-between">
              <Switch
                :checked="item.isPrimary"
                checked-children="主歌"
                un-checked-children="设为主歌"
                @update:checked="() => markPrimarySong(index)"
              />
              <div class="text-text-secondary text-xs">排序：{{ item.sortOrder || index + 1 }}</div>
            </div>
          </div>
          <Button block @click="addSongItem">新增关系之歌</Button>
        </div>
      </template>

      <template #links>
        <div class="space-y-3">
          <div
            v-for="(item, index) in linkItems"
            :key="`link-${index}`"
            class="grid grid-cols-[1fr,180px,1fr,auto] gap-2 rounded-xl border border-border px-4 py-4"
          >
            <Select
              v-model:value="item.linkedRelationSlug"
              :filter-option="false"
              :options="relationOptions"
              allow-clear
              placeholder="选择关联关系"
              show-search
              @search="onRelationSearch"
            />
            <Select v-model:value="item.linkTypeCode" :options="LINK_TYPE_OPTIONS" />
            <Input v-model:value="item.reason" placeholder="推荐理由" />
            <Button danger @click="linkItems.splice(index, 1)">删除</Button>
          </div>
          <Button block @click="addLinkItem">新增关联关系</Button>
        </div>
      </template>
    </Form>
  </Drawer>
</template>
