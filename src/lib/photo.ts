export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const ACCEPTED_PHOTO_TYPES = Object.keys(EXTENSION_BY_TYPE).join(",");

type PhotoInfo = { type: string; size: number };

/** Returns an error message, or null when the photo can be uploaded. */
export function validatePhoto({ type, size }: PhotoInfo): string | null {
  if (!(type in EXTENSION_BY_TYPE)) {
    return "Photos must be JPG, PNG, WebP or GIF.";
  }
  if (size > MAX_PHOTO_BYTES) {
    return "Photos can be at most 5 MB.";
  }
  return null;
}

/** A unique storage path, so two uploads never overwrite each other. */
export function buildPhotoPath(type: string, id: string): string {
  return `${id}.${EXTENSION_BY_TYPE[type]}`;
}
