// Asset view services removed. Stubs retained for import compatibility.
import { writable } from 'svelte/store';

export const showAssetOverlay = writable(false);
export const showUploadAssetsDialog = writable(false);
export const showUploadAssetsConfirmDialog = writable(false);
export const currentView = writable({ type: 'grid', showInfo: true });
export const defaultView = { type: 'grid', showInfo: true, sort: { key: 'name', order: 'ascending' } };
export const listedAssets = writable([]);
export const assetGroups = writable({});
export const getFolderLabelByCollection = () => '';
