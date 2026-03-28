import { requestClient } from '#/api/request';

import { buildPageParams, normalizeDetailResult, normalizePageResult } from './shared';

export namespace PmDictApi {
  export type DictKey =
    | 'characterTypes'
    | 'workTypes'
    | 'creatorTypes'
    | 'regions'
    | 'culturalRegions'
    | 'motivations'
    | 'themeCategories';

  export interface DictItem {
    id?: number | string;
    code: string;
    dictKey?: DictKey;
    isActive?: boolean;
    name: string;
    sortOrder?: number;
  }
}

export const dictLabels: Record<PmDictApi.DictKey, string> = {
  characterTypes: '人物类型',
  creatorTypes: '创作者类型',
  culturalRegions: '文化区域',
  motivations: '驱动力',
  regions: '地区',
  themeCategories: '主题分类',
  workTypes: '作品类型',
};

const fallbackCache: Record<PmDictApi.DictKey, PmDictApi.DictItem[]> = {
  characterTypes: [],
  creatorTypes: [],
  culturalRegions: [],
  motivations: [],
  regions: [],
  themeCategories: [],
  workTypes: [],
};

const baseUrl = '/admin/dicts';

export async function getDictPage(
  dictKey: PmDictApi.DictKey,
  params: Record<string, any>,
) {
  const query = buildPageParams(params);
  try {
    const res = await requestClient.get<any>(`${baseUrl}/${dictKey}/page`, {
      params: query,
    });
    return normalizePageResult<PmDictApi.DictItem>(res);
  } catch {
    const keyword = String(query.keyword || '').trim().toLowerCase();
    const items = fallbackCache[dictKey].filter((item) => {
      if (!keyword) {
        return true;
      }
      return [item.code, item.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
    const page = Number(query.page || 1);
    const pageSize = Number(query.pageSize || 10);
    const start = (page - 1) * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      total: items.length,
      page,
      pageSize,
    };
  }
}

export async function getDictItems(dictKey: PmDictApi.DictKey) {
  const page = await getDictPage(dictKey, { page: 1, pageSize: 300 });
  return page.items;
}

export async function getDictDetail(dictKey: PmDictApi.DictKey, id: string) {
  try {
    const res = await requestClient.get<any>(`${baseUrl}/${dictKey}/${id}`);
    return normalizeDetailResult<PmDictApi.DictItem>(res);
  } catch {
    return (
      fallbackCache[dictKey].find(
        (item) => String(item.id) === String(id) || item.code === id,
      ) || {
        code: '',
        dictKey,
        isActive: true,
        name: '',
        sortOrder: 100,
      }
    );
  }
}

export async function createDictItem(
  dictKey: PmDictApi.DictKey,
  payload: Partial<PmDictApi.DictItem>,
) {
  try {
    const res = await requestClient.post<any>(`${baseUrl}/${dictKey}`, payload);
    return normalizeDetailResult<PmDictApi.DictItem>(res);
  } catch {
    const item: PmDictApi.DictItem = {
      code: payload.code || `${dictKey}-${Date.now()}`,
      dictKey,
      id: payload.id ?? Date.now(),
      isActive: payload.isActive ?? true,
      name: payload.name || payload.code || '',
      sortOrder: payload.sortOrder ?? 100,
    };
    fallbackCache[dictKey].unshift(item);
    return item;
  }
}

export async function updateDictItem(
  dictKey: PmDictApi.DictKey,
  id: string,
  payload: Partial<PmDictApi.DictItem>,
) {
  try {
    const res = await requestClient.request<any>(`${baseUrl}/${dictKey}/${id}`, {
      method: 'PATCH',
      data: payload,
    });
    return normalizeDetailResult<PmDictApi.DictItem>(res);
  } catch {
    const index = fallbackCache[dictKey].findIndex(
      (item) => String(item.id) === String(id) || item.code === id,
    );
    if (index >= 0) {
      const current = fallbackCache[dictKey][index]!;
      fallbackCache[dictKey][index] = {
        ...current,
        ...payload,
        code: payload.code ?? current.code,
        name: payload.name ?? current.name,
      };
      return fallbackCache[dictKey][index]!;
    }
    return await createDictItem(dictKey, payload);
  }
}

export async function deleteDictItem(dictKey: PmDictApi.DictKey, id: string) {
  try {
    return await requestClient.delete<any>(`${baseUrl}/${dictKey}/${id}`);
  } catch {
    const index = fallbackCache[dictKey].findIndex(
      (item) => String(item.id) === String(id) || item.code === id,
    );
    if (index >= 0) {
      fallbackCache[dictKey][index] = {
        ...fallbackCache[dictKey][index]!,
        isActive: false,
      };
    }
    return { success: true };
  }
}
