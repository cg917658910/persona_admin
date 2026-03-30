import { requestClient } from '#/api/request';

import { buildPageParams, normalizeDetailResult, normalizePageResult } from './shared';

export namespace PmDictApi {
  export type DictKey =
    | 'characterTypes'
    | 'workTypes'
    | 'creatorTypes'
    | 'regions'
    | 'culturalRegions'
    | 'motivations';

  export interface DictItem {
    id?: number | string;
    code: string;
    name: string;
    description?: string;
    category?: string;
    regionType?: string;
    parentCode?: string;
    coverUrl?: string;
    dictKey?: DictKey;
    isActive?: boolean;
    sortOrder?: number;
  }
}

export const dictLabels: Record<PmDictApi.DictKey, string> = {
  characterTypes: '人物类型',
  creatorTypes: '创作者类型',
  culturalRegions: '文化区域',
  motivations: '驱动力',
  regions: '地区',
  workTypes: '作品类型',
};

const fallbackCache: Record<PmDictApi.DictKey, PmDictApi.DictItem[]> = {
  characterTypes: [],
  creatorTypes: [],
  culturalRegions: [],
  motivations: [],
  regions: [],
  workTypes: [],
};

const baseUrl = '/admin/dicts';

function normalizeDictItem(
  dictKey: PmDictApi.DictKey,
  item?: Partial<PmDictApi.DictItem> | null,
): PmDictApi.DictItem {
  return {
    code: item?.code || '',
    coverUrl: item?.coverUrl || '',
    category: item?.category || '',
    description: item?.description || '',
    dictKey,
    id: item?.id,
    isActive: item?.isActive ?? true,
    name: item?.name || '',
    parentCode: item?.parentCode || '',
    regionType: item?.regionType || '',
    sortOrder: item?.sortOrder ?? 100,
  };
}

export async function getDictPage(
  dictKey: PmDictApi.DictKey,
  params: Record<string, any>,
) {
  const query = buildPageParams(params);
  try {
    const res = await requestClient.get<any>(`${baseUrl}/${dictKey}/page`, {
      params: query,
    });
    const page = normalizePageResult<PmDictApi.DictItem>(res);
    return {
      ...page,
      items: page.items.map((item) => normalizeDictItem(dictKey, item)),
    };
  } catch {
    const keyword = String(query.keyword || '').trim().toLowerCase();
    const items = fallbackCache[dictKey].filter((item) => {
      if (!keyword) {
        return true;
      }
      return [
        item.code,
        item.name,
        item.description,
        item.parentCode,
        item.category,
        item.regionType,
      ]
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
    return normalizeDictItem(dictKey, normalizeDetailResult<PmDictApi.DictItem>(res));
  } catch {
    return normalizeDictItem(
      dictKey,
      fallbackCache[dictKey].find(
        (item) => String(item.id) === String(id) || item.code === id,
      ),
    );
  }
}

export async function createDictItem(
  dictKey: PmDictApi.DictKey,
  payload: Partial<PmDictApi.DictItem>,
) {
  try {
    const res = await requestClient.post<any>(`${baseUrl}/${dictKey}`, payload);
    return normalizeDictItem(dictKey, normalizeDetailResult<PmDictApi.DictItem>(res));
  } catch {
    const item = normalizeDictItem(dictKey, {
      ...payload,
      code: payload.code || `${dictKey}-${Date.now()}`,
      id: payload.id ?? Date.now(),
    });
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
    return normalizeDictItem(dictKey, normalizeDetailResult<PmDictApi.DictItem>(res));
  } catch {
    const index = fallbackCache[dictKey].findIndex(
      (item) => String(item.id) === String(id) || item.code === id,
    );
    if (index >= 0) {
      fallbackCache[dictKey][index] = normalizeDictItem(dictKey, {
        ...fallbackCache[dictKey][index],
        ...payload,
      });
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
