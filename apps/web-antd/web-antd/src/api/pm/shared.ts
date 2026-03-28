import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace PmSharedApi {
  export interface SimpleOption {
    label: string;
    value: string;
  }

  export interface WorkOptionItem {
    slug: string;
    title: string;
  }

  export interface ThemeOptionItem {
    slug: string;
    name: string;
  }

  export interface CharacterOptionItem {
    slug: string;
    name: string;
  }

  export interface PageResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  }
}

export function normalizePageResult<T>(res: any): PmSharedApi.PageResult<T> {
  const data = res?.data ?? res ?? {};
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data.items)
      ? data.items
      : [];
  return {
    items,
    total: Number(data.total ?? items.length ?? 0),
    page: Number(data.page ?? 1),
    pageSize: Number(data.pageSize ?? 10),
  };
}

export function normalizeDetailResult<T>(res: any): T {
  return (res?.data ?? res ?? {}) as T;
}

export function buildPageParams(params: Recordable<any>) {
  return {
    page: Number(params?.page || 1),
    pageSize: Number(params?.pageSize || 10),
    keyword: params?.keyword || '',
    ...params,
  };
}

function toOptionList<T extends { slug: string }>(
  items: T[],
  labelKey: keyof T,
) {
  return (items || []).map((item) => ({
    label: String(item[labelKey] || item.slug),
    value: item.slug,
  }));
}

async function getWorkOptions() {
  try {
    const data = await requestClient.get<any>('/works');
    const list = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : Array.isArray(data?.list)
          ? data.list
          : [];
    return toOptionList(list as PmSharedApi.WorkOptionItem[], 'title');
  } catch {
    return [
      { label: '红楼梦', value: 'dream-of-the-red-chamber' },
      { label: '西游记', value: 'journey-to-the-west' },
      { label: '三国语境', value: 'records-of-the-three-kingdoms' },
    ];
  }
}

async function getThemeOptions() {
  try {
    const data = await requestClient.get<any>('/themes');
    const list = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : Array.isArray(data?.list)
          ? data.list
          : [];
    return toOptionList(list as PmSharedApi.ThemeOptionItem[], 'name');
  } catch {
    return [
      { label: '悲剧人格', value: 'tragic' },
      { label: '反叛者', value: 'rebels' },
      { label: '守护者', value: 'guardians' },
    ];
  }
}

async function getCharacterOptions() {
  try {
    const data = await requestClient.get<any>('/admin/characters');
    const list = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.list)
            ? data.list
            : [];
    return toOptionList(list as PmSharedApi.CharacterOptionItem[], 'name');
  } catch {
    return [
      { label: '林黛玉', value: 'lin-daiyu' },
      { label: '孙悟空', value: 'sun-wu-kong' },
      { label: '曹操', value: 'cao-cao' },
    ];
  }
}

export { getCharacterOptions, getThemeOptions, getWorkOptions };
