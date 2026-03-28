import { getDicts } from './content';

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
  workTypes: '作品类型',
};

const cache: Record<PmDictApi.DictKey, PmDictApi.DictItem[]> = {
  characterTypes: [],
  creatorTypes: [],
  culturalRegions: [],
  motivations: [],
  regions: [],
  workTypes: [],
};

let initialized = false;

async function ensureCache() {
  if (initialized) {
    return cache;
  }
  const raw = (await getDicts()) as Record<string, any[]>;
  for (const [key, value] of Object.entries(raw || {})) {
    if (key in cache) {
      cache[key as PmDictApi.DictKey] = (value || []).map((item: any, index) => ({
        code: item.code ?? item.value ?? item.slug ?? `${key}-${index + 1}`,
        id: item.id ?? item.code ?? item.value ?? `${key}-${index + 1}`,
        isActive: item.isActive ?? true,
        name: item.name ?? item.label ?? item.title ?? item.code ?? '',
        sortOrder: item.sortOrder ?? index + 1,
      }));
    }
  }
  initialized = true;
  return cache;
}

export async function getDictItems(dictKey: PmDictApi.DictKey) {
  const data = await ensureCache();
  return [...(data[dictKey] || [])];
}

export async function createDictItem(
  dictKey: PmDictApi.DictKey,
  payload: Partial<PmDictApi.DictItem>,
) {
  const data = await ensureCache();
  const item: PmDictApi.DictItem = {
    code: payload.code || `${dictKey}-${Date.now()}`,
    id: payload.id ?? Date.now(),
    isActive: payload.isActive ?? true,
    name: payload.name || payload.code || '',
    sortOrder: payload.sortOrder ?? 100,
  };
  data[dictKey].unshift(item);
  return item;
}

export async function updateDictItem(
  dictKey: PmDictApi.DictKey,
  id: string,
  payload: Partial<PmDictApi.DictItem>,
) {
  const data = await ensureCache();
  const index = data[dictKey].findIndex(
    (item) => String(item.id) === String(id) || item.code === id,
  );
  if (index >= 0) {
    const current = data[dictKey][index]!;
    data[dictKey][index] = {
      ...current,
      ...payload,
      code: payload.code ?? current.code,
      name: payload.name ?? current.name,
    };
    return data[dictKey][index];
  }
  return createDictItem(dictKey, payload);
}
