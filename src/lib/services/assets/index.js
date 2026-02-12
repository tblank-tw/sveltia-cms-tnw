// Asset services removed. Stubs retained for import compatibility.
import { writable } from 'svelte/store';

/** @type {import('svelte/store').Writable<any[]>} */
export const allAssets = writable([]);
/** @type {import('svelte/store').Writable<any[]>} */
export const selectedAssets = writable([]);
/** @type {import('svelte/store').Writable<undefined>} */
export const focusedAsset = writable();
/** @type {import('svelte/store').Writable<undefined>} */
export const overlaidAsset = writable();
/** @type {import('svelte/store').Writable<{folder: undefined, files: any[]}>} */
export const uploadingAssets = writable({ folder: undefined, files: [] });
/** @type {import('svelte/store').Writable<undefined>} */
export const editingAsset = writable();
/** @type {import('svelte/store').Writable<undefined>} */
export const renamingAsset = writable();
/** @type {import('svelte/store').Writable<{processing: false, undersizedFiles: any[], oversizedFiles: any[], transformedFileMap: WeakMap<object, unknown>}>} */
export const processedAssets = writable({
  processing: false,
  undersizedFiles: [],
  oversizedFiles: [],
  transformedFileMap: new WeakMap(),
});
export const getAssetByPath = () => undefined;
export const getAssetByRelativePath = () => undefined;
export const getAssetByAbsolutePath = () => undefined;
export const getAssetByRelativePathAndCollection = () => undefined;
export const isRelativePath = (path) => !/^[/@]/.test(path);
export const getAssetsByFolder = () => [];
export const getAssetsByDirName = () => [];
