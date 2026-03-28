import { requestClient } from '#/api/request';

import { buildPageParams, normalizeDetailResult, normalizePageResult } from './shared';

export namespace PmResourceApi {
  export type ResourceType = 'audio' | 'image';

  export interface ResourceItem {
    id?: number | string;
    createdAt?: string;
    linkedCount?: number;
    linkedModule?: string;
    mimeType?: string;
    name: string;
    size?: number;
    type: ResourceType;
    url: string;
  }
}

const baseUrl = '/admin/resources';

const cache: Record<PmResourceApi.ResourceType, PmResourceApi.ResourceItem[]> = {
  audio: [],
  image: [],
};

function filterItems(
  resourceType: PmResourceApi.ResourceType,
  params: Record<string, any>,
) {
  const keyword = String(params.keyword || '').trim().toLowerCase();
  return cache[resourceType].filter((item) => {
    if (!keyword) {
      return true;
    }
    return [item.name, item.url, item.mimeType]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });
}

export async function getResourcePage(
  resourceType: PmResourceApi.ResourceType,
  params: Record<string, any>,
) {
  const query = buildPageParams(params);
  try {
    const res = await requestClient.get<any>(`${baseUrl}/${resourceType}/page`, {
      params: query,
    });
    return normalizePageResult<PmResourceApi.ResourceItem>(res);
  } catch {
    const items = filterItems(resourceType, query);
    const page = Number(query.page || 1);
    const pageSize = Number(query.pageSize || 10);
    const start = (page - 1) * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      page,
      pageSize,
      total: items.length,
    };
  }
}

export async function createResource(payload: Partial<PmResourceApi.ResourceItem>) {
  const type = (payload.type || 'image') as PmResourceApi.ResourceType;
  try {
    const res = await requestClient.post<any>(`${baseUrl}/${type}`, payload);
    return normalizeDetailResult<PmResourceApi.ResourceItem>(res);
  } catch {
    const item: PmResourceApi.ResourceItem = {
      createdAt: new Date().toISOString(),
      id: Date.now(),
      linkedCount: payload.linkedCount ?? 0,
      linkedModule: payload.linkedModule || '',
      mimeType: payload.mimeType || '',
      name: payload.name || '',
      size: payload.size ?? 0,
      type,
      url: payload.url || '',
    };
    cache[item.type].unshift(item);
    return item;
  }
}

export async function uploadResourceFile(
  resourceType: PmResourceApi.ResourceType,
  file: File,
) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await requestClient.request<any>(`${baseUrl}/${resourceType}/upload`, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return normalizeDetailResult<PmResourceApi.ResourceItem>(res);
  } catch {
    const fallbackItem: PmResourceApi.ResourceItem = {
      createdAt: new Date().toISOString(),
      id: Date.now(),
      mimeType: file.type || (resourceType === 'image' ? 'image/webp' : 'audio/mpeg'),
      name: file.name,
      size: file.size,
      type: resourceType,
      url: `/assets/${resourceType === 'image' ? 'images' : 'audio'}/${file.name}`,
    };
    cache[resourceType].unshift(fallbackItem);
    return fallbackItem;
  }
}

export async function deleteResource(
  resourceType: PmResourceApi.ResourceType,
  id: string,
) {
  try {
    return await requestClient.delete<any>(`${baseUrl}/${resourceType}/${id}`);
  } catch {
    const list = cache[resourceType];
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index >= 0) {
      list.splice(index, 1);
    }
    return { success: true };
  }
}
