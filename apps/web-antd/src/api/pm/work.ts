import { requestClient } from '#/api/request';

import { getWork, getWorks } from './content';
import { buildPageParams, normalizeDetailResult, normalizePageResult } from './shared';

export namespace PmWorkApi {
  export interface WorkItem {
    id?: number | string;
    slug: string;
    title: string;
    summary?: string;
    coverUrl?: string;
    status?: string;
    workTypeCode?: string;
    creatorSlugs?: string[];
    creatorNames?: string[];
    regionCode?: string;
    culturalRegionCode?: string;
    releaseYear?: number;
    [key: string]: any;
  }
}

const baseUrl = '/admin/works';
let mockCache: PmWorkApi.WorkItem[] | null = null;

async function ensureMockCache() {
  if (!mockCache) {
    mockCache = (await getWorks()) as PmWorkApi.WorkItem[];
  }
  return mockCache;
}

function filterItems(items: PmWorkApi.WorkItem[], params: Record<string, any>) {
  const keyword = String(params.keyword || '').trim().toLowerCase();
  return items.filter((item) => {
    if (params.status && item.status !== params.status) {
      return false;
    }
    if (params.workTypeCode && item.workTypeCode !== params.workTypeCode) {
      return false;
    }
    if (!keyword) {
      return true;
    }
    return [item.title, item.slug, item.summary]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });
}

export async function getWorkPage(params: Record<string, any>) {
  const query = buildPageParams(params);
  try {
    const res = await requestClient.get<any>(`${baseUrl}/page`, { params: query });
    return normalizePageResult<PmWorkApi.WorkItem>(res);
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

export async function getWorkDetail(id: string) {
  try {
    const res = await requestClient.get<any>(`${baseUrl}/${id}`);
    return normalizeDetailResult<PmWorkApi.WorkItem>(res);
  } catch {
    return (await getWork(id)) as PmWorkApi.WorkItem;
  }
}

export async function createWork(payload: Record<string, any>) {
  try {
    const res = await requestClient.post<any>(baseUrl, payload);
    return normalizeDetailResult<PmWorkApi.WorkItem>(res);
  } catch {
    const cache = await ensureMockCache();
    const item = { ...payload, id: Date.now() } as PmWorkApi.WorkItem;
    cache.unshift(item);
    return item;
  }
}

export async function updateWork(id: string, payload: Record<string, any>) {
  try {
    const res = await requestClient.request<any>(`${baseUrl}/${id}`, {
      method: 'PATCH',
      data: payload,
    });
    return normalizeDetailResult<PmWorkApi.WorkItem>(res);
  } catch {
    const cache = await ensureMockCache();
    const index = cache.findIndex((item) => String(item.id) === String(id) || item.slug === id);
    if (index >= 0) {
      cache[index] = {
        ...cache[index],
        ...payload,
        slug: payload.slug ?? cache[index]!.slug ?? String(id),
        title: payload.title ?? cache[index]!.title ?? '',
      };
      return cache[index];
    }
    return {
      ...payload,
      id,
      slug: payload.slug ?? String(id),
      title: payload.title ?? '',
    } as PmWorkApi.WorkItem;
  }
}

export async function deleteWork(id: string) {
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
