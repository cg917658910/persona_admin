import { requestClient } from '#/api/request';
import { normalizeDetailResult } from './shared';

export namespace PmImportApi {
  export interface ImportSummary {
    themes?: number;
    creators?: number;
    works?: number;
    characters?: number;
    songs?: number;
    relations?: number;
    relationParticipants?: number;
    relationEvents?: number;
    relationSongs?: number;
    relationThemes?: number;
    relationLinks?: number;
  }

  export interface ImportResult {
    valid: boolean;
    imported: boolean;
    packageVersion?: string;
    summary?: ImportSummary;
    warnings?: string[];
    errors?: string[];
  }
}

export async function validateGeneratedImport(payload: Record<string, any>) {
  const res = await requestClient.post<any>('/admin/imports/validate', payload);
  return normalizeDetailResult<PmImportApi.ImportResult>(res);
}

export async function runGeneratedImport(payload: Record<string, any>) {
  const res = await requestClient.post<any>('/admin/imports/run', payload);
  return normalizeDetailResult<PmImportApi.ImportResult>(res);
}

export async function validateRelationImport(payload: Record<string, any>) {
  const res = await requestClient.post<any>(
    '/admin/relation-imports/validate',
    payload,
  );
  return normalizeDetailResult<PmImportApi.ImportResult>(res);
}

export async function runRelationImport(payload: Record<string, any>) {
  const res = await requestClient.post<any>('/admin/relation-imports/run', payload);
  return normalizeDetailResult<PmImportApi.ImportResult>(res);
}
