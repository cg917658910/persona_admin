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

const cache: Record<PmResourceApi.ResourceType, PmResourceApi.ResourceItem[]> = {
  audio: [],
  image: [],
};

export async function getResourcePage(
  resourceType: PmResourceApi.ResourceType,
  params: Record<string, any>,
) {
  const keyword = String(params.keyword || '').trim().toLowerCase();
  const items = cache[resourceType].filter((item) => {
    if (!keyword) {
      return true;
    }
    return [item.name, item.url, item.mimeType]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });
  const page = Number(params.page || 1);
  const pageSize = Number(params.pageSize || 10);
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
  };
}

export async function createResource(payload: Partial<PmResourceApi.ResourceItem>) {
  const item: PmResourceApi.ResourceItem = {
    createdAt: new Date().toISOString(),
    id: Date.now(),
    linkedCount: payload.linkedCount ?? 0,
    linkedModule: payload.linkedModule || '',
    mimeType: payload.mimeType || '',
    name: payload.name || '',
    size: payload.size ?? 0,
    type: (payload.type || 'image') as PmResourceApi.ResourceType,
    url: payload.url || '',
  };
  cache[item.type].unshift(item);
  return item;
}

export async function deleteResource(
  resourceType: PmResourceApi.ResourceType,
  id: string,
) {
  const list = cache[resourceType];
  const index = list.findIndex((item) => String(item.id) === String(id));
  if (index >= 0) {
    list.splice(index, 1);
  }
  return { success: true };
}

