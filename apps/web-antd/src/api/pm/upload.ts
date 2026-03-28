import type { PmResourceApi } from './resource';

import { uploadResourceFile } from './resource';

export async function uploadResource(
  file: File,
  type: PmResourceApi.ResourceType,
) {
  return await uploadResourceFile(type, file);
}
