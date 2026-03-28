import { requestClient } from '#/api/request';

import { getCreator, getCreators } from './content';
import { buildPageParams, normalizeDetailResult, normalizePageResult } from './shared';

export namespace PmCreatorApi {
  export interface CreatorItem {
    id?: number | string;
    slug: string;
    name: string;
    summary?: string;
    coverUrl?: string;
    status?: string;
    creatorTypeCode?: string;
    workSlugs?: string[];
    workNames?: string[];
    regionCode?: string;
    culturalRegionCode?: string;
    [key: string]: any;
  }
}

const baseUrl = '/admin/creators';
let mockCache: PmCreatorApi.CreatorItem[] | null = null;

async function ensureMockCache() {
  if (!mockCache) {
    mockCache = (await getCreators()) as PmCreatorApi.CreatorItem[];
  }
  return mockCache;
}

function filterItems(items: PmCreatorApi.CreatorItem[], params: Record<string, any>) {
  const keyword = String(params.keyword || '').trim().toLowerCase();
  return items.filter((item) => {
    if (params.status && item.status !== params.status) {
      return false;
    }
    if (params.creatorTypeCode && item.creatorTypeCode !== params.creatorTypeCode) {
      return false;
    }
    if (!keyword) {
      return true;
    }
    return [item.name, item.slug, item.summary]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });
}

export async function getCreatorPage(params: Record<string, any>) {
  const query = buildPageParams(params);
  try {
    const res = await requestClient.get<any>(`${baseUrl}/page`, { params: query });
    return normalizePageResult<PmCreatorApi.CreatorItem>(res);
  } catch {
    const items = filterItems(await ensureMockCache(), query);
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

export async function getCreatorDetail(id: string) {
  try {
    const res = await requestClient.get<any>(`${baseUrl}/${id}`);
    return normalizeDetailResult<PmCreatorApi.CreatorItem>(res);
  } catch {
    return (await getCreator(id)) as PmCreatorApi.CreatorItem;
  }
}

export async function createCreator(payload: Record<string, any>) {
  try {
    const res = await requestClient.post<any>(baseUrl, payload);
    return normalizeDetailResult<PmCreatorApi.CreatorItem>(res);
  } catch {
    const cache = await ensureMockCache();
    const item = { ...payload, id: Date.now() } as PmCreatorApi.CreatorItem;
    cache.unshift(item);
    return item;
  }
}

export async function updateCreator(id: string, payload: Record<string, any>) {
  try {
    const res = await requestClient.request<any>(`${baseUrl}/${id}`, {
      method: 'PATCH',
      data: payload,
    });
    return normalizeDetailResult<PmCreatorApi.CreatorItem>(res);
  } catch {
    const cache = await ensureMockCache();
    const index = cache.findIndex((item) => String(item.id) === String(id) || item.slug === id);
    if (index >= 0) {
      cache[index] = {
        ...cache[index],
        ...payload,
        name: payload.name ?? cache[index]!.name ?? '',
        slug: payload.slug ?? cache[index]!.slug ?? String(id),
      };
      return cache[index];
    }
    return {
      ...payload,
      id,
      name: payload.name ?? '',
      slug: payload.slug ?? String(id),
    } as PmCreatorApi.CreatorItem;
  }
}

export async function deleteCreator(id: string) {
  try {
    return await requestClient.delete<any>(`${baseUrl}/${id}`);
  } catch {
    const cache = await ensureMockCache();
    const index = cache.findIndex((item) => String(item.id) === String(id) || item.slug === id);
    if (index >= 0) {
      cache.splice(index, 1);
    }
    return { success: true };
  }
}
