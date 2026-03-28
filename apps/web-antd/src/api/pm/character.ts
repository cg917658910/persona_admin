import { requestClient } from '#/api/request';

import {
  createCharacter as createCharacterMock,
  deleteCharacter as deleteCharacterMock,
  getCharacter as getCharacterMock,
  getCharacters,
  updateCharacter as updateCharacterMock,
} from './content';
import {
  buildPageParams,
  normalizeDetailResult,
  normalizePageResult,
} from './shared';

export namespace PmCharacterApi {
  export interface CharacterItem {
    id?: number | string;
    slug: string;
    name: string;
    summary?: string;
    coverUrl?: string;
    status?: string;
    characterTypeCode?: string;
    oneLineDefinition?: string;
    motivationNote?: string;
    sortOrder?: number;
    homeToday?: boolean;
    featuredHome?: boolean;
    homeSort?: number;
    discoverWeight?: number;
    hasSong?: boolean;
    [key: string]: any;
  }
}

const baseUrl = '/admin/characters';

function filterItems(
  items: PmCharacterApi.CharacterItem[],
  params: Record<string, any>,
) {
  const keyword = String(params.keyword || '')
    .trim()
    .toLowerCase();
  return items.filter((item) => {
    if (
      params.characterTypeCode &&
      item.characterTypeCode !== params.characterTypeCode
    ) {
      return false;
    }
    if (params.status && item.status !== params.status) {
      return false;
    }
    if (!keyword) {
      return true;
    }
    return [item.name, item.slug, item.summary, item.oneLineDefinition]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });
}

export async function getCharacterPage(params: Record<string, any>) {
  const query = buildPageParams(params);
  try {
    const res = await requestClient.get<any>(`${baseUrl}/page`, {
      params: query,
    });
    return normalizePageResult<PmCharacterApi.CharacterItem>(res);
  } catch {
    const items = filterItems(
      (await getCharacters()) as PmCharacterApi.CharacterItem[],
      query,
    );
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

export async function getCharacterDetail(id: string) {
  try {
    const res = await requestClient.get<any>(`${baseUrl}/${id}`);
    return normalizeDetailResult<PmCharacterApi.CharacterItem>(res);
  } catch {
    return (await getCharacterMock(id)) as PmCharacterApi.CharacterItem;
  }
}

export async function createCharacter(payload: Record<string, any>) {
  try {
    const res = await requestClient.post<any>(baseUrl, payload);
    return normalizeDetailResult<PmCharacterApi.CharacterItem>(res);
  } catch {
    return (await createCharacterMock(payload)) as PmCharacterApi.CharacterItem;
  }
}

export async function updateCharacter(
  id: string,
  payload: Record<string, any>,
) {
  try {
    const res = await requestClient.request<any>(`${baseUrl}/${id}`, {
      method: 'PATCH',
      data: payload,
    });
    return normalizeDetailResult<PmCharacterApi.CharacterItem>(res);
  } catch {
    return (await updateCharacterMock(
      id,
      payload,
    )) as PmCharacterApi.CharacterItem;
  }
}

export async function deleteCharacter(id: string) {
  try {
    return await requestClient.delete<any>(`${baseUrl}/${id}`);
  } catch {
    return await deleteCharacterMock(id);
  }
}
