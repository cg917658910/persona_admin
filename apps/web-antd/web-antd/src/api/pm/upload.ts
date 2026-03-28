import type { PmResourceApi } from './resource';

export async function uploadResource(
  file: File,
  type: PmResourceApi.ResourceType,
) {
  return {
    mimeType: file.type || (type === 'image' ? 'image/webp' : 'audio/mpeg'),
    name: file.name,
    size: file.size,
    url: `/assets/${type === 'image' ? 'images' : 'audio'}/${file.name}`,
  };
}

