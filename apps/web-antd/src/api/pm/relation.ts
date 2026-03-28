import { requestClient } from '#/api/request';
import { buildPageParams, normalizeDetailResult, normalizePageResult } from './shared';

export namespace PmRelationApi {
  export interface RelationItem {
    id?: string;
    slug: string;
    name: string;
    subtitle?: string;
    summary?: string;
    oneLineDefinition?: string;
    coverUrl?: string;
    status?: string;
    sortOrder?: number;
    relationTypeCode?: string;
    relationTypeName?: string;
    workSlug?: string;
    workName?: string;
    sourceCharacterSlug?: string;
    sourceCharacterName?: string;
    targetCharacterSlug?: string;
    targetCharacterName?: string;
    coreDynamic?: string;
    coreTension?: string;
    emotionalTone?: string;
    emotionalTemperature?: string;
    connectionTrigger?: string;
    sustainingMechanism?: string;
    relationConflict?: string;
    relationArc?: string;
    fateImpact?: string;
    powerStructure?: string;
    dependencyPattern?: string;
    sourcePerspective?: string;
    sourceDesireInRelation?: string;
    sourceFearInRelation?: string;
    sourceUnsaid?: string;
    targetPerspective?: string;
    targetDesireInRelation?: string;
    targetFearInRelation?: string;
    targetUnsaid?: string;
    phenomenology?: Record<string, string>;
    symbolicImages?: string[];
    themeTags?: string[];
    relationPalette?: Array<{ name?: string; hex: string }>;
    relationKeywords?: string[];
    tensionTags?: string[];
    coverPrompt?: string;
    songPrompt?: string;
    primarySongSlug?: string;
    themeSlugs?: string[];
    events?: any[];
    songs?: any[];
    links?: any[];
    [key: string]: any;
  }
}

const baseUrl = '/admin/relations';

export async function getRelationPage(params: Record<string, any>) {
  const query = buildPageParams(params);
  const res = await requestClient.get<any>(`${baseUrl}/page`, { params: query });
  return normalizePageResult<PmRelationApi.RelationItem>(res);
}

export async function getRelationDetail(id: string) {
  const res = await requestClient.get<any>(`${baseUrl}/${id}`);
  return normalizeDetailResult<PmRelationApi.RelationItem>(res);
}

export async function createRelation(payload: Record<string, any>) {
  const res = await requestClient.post<any>(baseUrl, payload);
  return normalizeDetailResult<PmRelationApi.RelationItem>(res);
}

export async function updateRelation(id: string, payload: Record<string, any>) {
  const res = await requestClient.request<any>(`${baseUrl}/${id}`, {
    method: 'PATCH',
    data: payload,
  });
  return normalizeDetailResult<PmRelationApi.RelationItem>(res);
}

export async function deleteRelation(id: string) {
  return await requestClient.delete<any>(`${baseUrl}/${id}`);
}
