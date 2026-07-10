const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com';

export function resolveImageSrc(src?: string | null): string | null {
  if (!src) return null;

  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  if (!cloudName) {
    return src;
  }

  const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER?.trim();
  const normalizedPath = src.startsWith('/') ? src.slice(1) : src;
  const folderPath = folder ? `${folder.replace(/^\/+|\/+$/g, '')}/` : '';

  return `${CLOUDINARY_BASE_URL}/${cloudName}/image/upload/f_auto,q_auto/${folderPath}${normalizedPath}`;
}
