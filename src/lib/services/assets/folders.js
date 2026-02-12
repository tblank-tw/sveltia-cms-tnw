// Asset folder services removed. Stubs retained for import compatibility.
import { writable } from 'svelte/store';

/** @type {import('svelte/store').Writable<any[]>} */
export const allAssetFolders = writable([]);
/** @type {import('svelte/store').Writable<undefined>} */
export const globalAssetFolder = writable(undefined);
/** @type {import('svelte/store').Writable<undefined>} */
export const selectedAssetFolder = writable();
/** @type {import('svelte/store').Writable<undefined>} */
export const targetAssetFolder = writable(undefined);
export const getAssetFolder = () => undefined;
export const getAssetFoldersByPath = () => [];
export const canCreateAsset = () => false;
