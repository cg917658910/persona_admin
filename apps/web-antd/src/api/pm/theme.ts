import { requestClient } from '#/api/request';

import {
    createTheme as createThemeMock,
    deleteTheme as deleteThemeMock,
    getTheme as getThemeMock,
    getThemes,
    updateTheme as updateThemeMock,
} from './content';
import { buildPageParams, normalizeDetailResult, normalizePageResult } from './shared';

export namespace PmThemeApi {
  export interface ThemeItem {
    id?: number | string;
    slug: string;
    name: string;
    code?: string;
    category?: string;
    summary?: string;
    coverUrl?: string;
    status?: string;
    sortOrder?: number;
    characterSlugs?: string[];
    relationSlugs?: string[];
    subjectType?: 'character' | 'relation';
    [key: string]: any;
  }
}

const baseUrl = '/admin/themes';

function filterItems(items: PmThemeApi.ThemeItem[], params: Record<string, any>) {
  const keyword = String(params.keyword || '').trim().toLowerCase();
  return items.filter((item) => {
    if (params.category && item.category !== params.category) {
      return false;
    }
    if (params.status && item.status !== params.status) {
      return false;
    }
    if (params.subjectType && item.subjectType !== params.subjectType) {
      return false;
    }
    if (!keyword) {
      return true;
    }
    return [item.name, item.slug, item.code, item.summary]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });
}

export async function getThemePage(params: Record<string, any>) {
  const query = buildPageParams(params);
  try {
    const res = await requestClient.get<any>(`${baseUrl}/page`, { params: query });
    return normalizePageResult<PmThemeApi.ThemeItem>(res);
  } catch {
    const items = filterItems((await getThemes()) as PmThemeApi.ThemeItem[], query);
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

export async function getThemeDetail(id: string) {
  try {
    const res = await requestClient.get<any>(`${baseUrl}/${id}`);
    return normalizeDetailResult<PmThemeApi.ThemeItem>(res);
  } catch {
    return (await getThemeMock(id)) as PmThemeApi.ThemeItem;
  }
}

export async function createTheme(payload: Record<string, any>) {
  try {
    const res = await requestClient.post<any>(baseUrl, payload);
    return normalizeDetailResult<PmThemeApi.ThemeItem>(res);
  } catch {
    return (await createThemeMock(payload)) as PmThemeApi.ThemeItem;
  }
}

export async function updateTheme(id: string, payload: Record<string, any>) {
  try {
    const res = await requestClient.request<any>(`${baseUrl}/${id}`, {
      method: 'PATCH',
      data: payload,
    });
    return normalizeDetailResult<PmThemeApi.ThemeItem>(res);
  } catch {
    return (await updateThemeMock(id, payload)) as PmThemeApi.ThemeItem;
  }
}

export async function deleteTheme(id: string) {
  try {
    return await requestClient.delete<any>(`${baseUrl}/${id}`);
  } catch {
    return await deleteThemeMock(id);
  }
}
