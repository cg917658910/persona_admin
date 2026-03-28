import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace PmSharedApi {
  export interface SimpleOption {
    label: string;
    value: string;
  }

  export interface WorkOptionItem {
    slug: string;
    title?: string;
  }

  export interface ThemeOptionItem {
    slug: string;
    name?: string;
    subjectType?: 'character' | 'relation';
  }

  export interface CharacterOptionItem {
    slug: string;
    name?: string;
  }

  export interface RelationOptionItem {
    slug: string;
    name?: string;
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
): PmSharedApi.SimpleOption[] {
  return (items || []).map((item) => ({
    label: String(item[labelKey] || item.slug),
    value: item.slug,
  }));
}

async function getPageItems<T>(
  url: string,
  params: Record<string, any> = {},
): Promise<T[]> {
  const res = await requestClient.get<any>(url, {
    params: {
      page: 1,
      pageSize: 100,
      ...params,
    },
  });
  return normalizePageResult<T>(res).items;
}

export async function queryWorkOptions(keyword = '') {
  try {
    const items = await getPageItems<PmSharedApi.WorkOptionItem>(
      '/admin/works/page',
      { keyword },
    );
    return toOptionList(items, 'title');
  } catch {
    return [
      { label: '红楼梦', value: 'dream-of-the-red-chamber' },
      { label: '西游记', value: 'journey-to-the-west' },
    ];
  }
}

export async function getWorkOptions() {
  return await queryWorkOptions();
}

export async function queryThemeOptions(
  subjectType: 'character' | 'relation' = 'character',
  keyword = '',
) {
  try {
    const items = await getPageItems<PmSharedApi.ThemeOptionItem>(
      '/admin/themes/page',
      { keyword, subjectType },
    );
    return toOptionList(items, 'name');
  } catch {
    return subjectType === 'relation'
      ? [{ label: '镜像关系', value: 'mirror-relations' }]
      : [
          { label: '悲剧人格', value: 'tragic' },
          { label: '反叛者', value: 'rebels' },
        ];
  }
}

export async function getThemeOptions(
  subjectType: 'character' | 'relation' = 'character',
) {
  return await queryThemeOptions(subjectType);
}

export async function queryCharacterOptions(keyword = '') {
  try {
    const items = await getPageItems<PmSharedApi.CharacterOptionItem>(
      '/admin/characters/page',
      { keyword },
    );
    return toOptionList(items, 'name');
  } catch {
    return [
      { label: '林黛玉', value: 'lin-daiyu' },
      { label: '孙悟空', value: 'sun-wu-kong' },
      { label: '贾宝玉', value: 'jia-baoyu' },
    ];
  }
}

export async function getCharacterOptions() {
  return await queryCharacterOptions();
}

export async function queryRelationOptions(keyword = '') {
  try {
    const items = await getPageItems<PmSharedApi.RelationOptionItem>(
      '/admin/relations/page',
      { keyword },
    );
    return toOptionList(items, 'name');
  } catch {
    return [
      {
        label: '林黛玉 × 贾宝玉',
        value: 'lin-daiyu-jia-baoyu-dream-of-the-red-chamber',
      },
    ];
  }
}

export async function getRelationOptions() {
  return await queryRelationOptions();
}
