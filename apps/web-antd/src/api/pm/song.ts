import { requestClient } from '#/api/request';

import {
    createSong as createSongMock,
    deleteSong as deleteSongMock,
    getSong as getSongMock,
    getSongs,
    updateSong as updateSongMock,
} from './content';
import { buildPageParams, normalizeDetailResult, normalizePageResult } from './shared';

export namespace PmSongApi {
  export interface SongItem {
    id?: number | string;
    slug: string;
    title: string;
    summary?: string;
    coverUrl?: string;
    audioUrl?: string;
    status?: string;
    characterId?: string;
    characterSlug?: string;
    characterName?: string;
    styles?: string[];
    emotionalCurve?: string[];
    prompt?: string;
    lyrics?: string;
    [key: string]: any;
  }
}

const baseUrl = '/admin/songs';
const useMock = import.meta.env.VITE_PM_ADMIN_USE_MOCK === 'true';

function filterItems(items: PmSongApi.SongItem[], params: Record<string, any>) {
  const keyword = String(params.keyword || '').trim().toLowerCase();
  return items.filter((item) => {
    if (params.status && item.status !== params.status) {
      return false;
    }
    if (!keyword) {
      return true;
    }
    return [item.title, item.slug, item.summary, item.characterName]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });
}

export async function getSongPage(params: Record<string, any>) {
  const query = buildPageParams(params);
  try {
    const res = await requestClient.get<any>(`${baseUrl}/page`, { params: query });
    return normalizePageResult<PmSongApi.SongItem>(res);
  } catch {
    const items = filterItems((await getSongs()) as PmSongApi.SongItem[], query);
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

export async function getSongDetail(id: string) {
  try {
    const res = await requestClient.get<any>(`${baseUrl}/${id}`);
    return normalizeDetailResult<PmSongApi.SongItem>(res);
  } catch {
    return (await getSongMock(id)) as PmSongApi.SongItem;
  }
}

export async function createSong(payload: Record<string, any>) {
  if (useMock) {
    return (await createSongMock(payload)) as PmSongApi.SongItem;
  }
  const res = await requestClient.post<any>(baseUrl, payload);
  return normalizeDetailResult<PmSongApi.SongItem>(res);
}

export async function updateSong(id: string, payload: Record<string, any>) {
  if (useMock) {
    return (await updateSongMock(id, payload)) as PmSongApi.SongItem;
  }
  const res = await requestClient.request<any>(`${baseUrl}/${id}`, {
    method: 'PATCH',
    data: payload,
  });
  return normalizeDetailResult<PmSongApi.SongItem>(res);
}

export async function deleteSong(id: string) {
  if (useMock) {
    return await deleteSongMock(id);
  }
  return await requestClient.delete<any>(`${baseUrl}/${id}`);
}
