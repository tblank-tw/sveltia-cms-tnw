// Asset kinds — kept functional (no dependency on other asset modules).
import { isTextFileType } from '@sveltia/utils/file';
import { isURL } from '@sveltia/utils/string';
import mime from 'mime';

export const MEDIA_KINDS = ['image', 'video', 'audio'];
export const ASSET_KINDS = [...MEDIA_KINDS, 'document', 'other'];
export const DOC_EXTENSION_REGEX = /\.(?:csv|docx?|odp|ods|odt|pdf|pptx?|rtf|xlsx?)$/i;
export const isMediaKind = (kind) => MEDIA_KINDS.includes(kind);

export const canPreviewAsset = (asset) => {
  const type = mime.getType(asset.path);
  return isMediaKind(asset.kind) || type === 'application/pdf' || (!!type && isTextFileType(type));
};

export const getMediaKind = async (source) => {
  let mimeType = '';
  if (typeof source === 'string') {
    if (source.startsWith('blob:')) {
      try {
        mimeType = (await (await fetch(source)).blob()).type;
      } catch {
        //
      }
    } else {
      if (isURL(source)) {
        const { hostname, pathname } = new URL(source);
        if (hostname.startsWith('images.')) return 'image';
        source = pathname;
      }
      mimeType = mime.getType(source) ?? '';
    }
  } else if (source instanceof Blob) {
    mimeType = source.type;
  }
  if (!mimeType) return undefined;
  const [type, subType] = mimeType.split('/');
  if (isMediaKind(type) && !subType.startsWith('x-')) return type;
  return undefined;
};

export const canEditAsset = (asset) => {
  const type = mime.getType(asset.path);
  return !!type && isTextFileType(type);
};

export const getAssetKind = (name) =>
  mime.getType(name)?.match(/^(?<type>image|audio|video)\//)?.groups?.type ??
  (DOC_EXTENSION_REGEX.test(name) ? 'document' : 'other');
