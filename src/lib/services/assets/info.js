// Asset info services removed. Stubs retained for import compatibility.

export const getAssetBlob = async () => undefined;
export const getAssetBlobURL = async () => undefined;
export const getAssetThumbnailURL = async () => undefined;
export const getAssetPublicURL = () => undefined;
export const getAssetBaseURL = () => undefined;
export const getMediaFieldURL = async () => undefined;
export const defaultAssetDetails = {
  publicURL: undefined,
  repoBlobURL: undefined,
  dimensions: undefined,
  duration: undefined,
  usedEntries: [],
};
export const getAssetDetails = async () => ({ ...defaultAssetDetails });
