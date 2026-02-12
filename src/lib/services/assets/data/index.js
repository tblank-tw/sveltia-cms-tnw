// Asset data services removed. Stubs retained for import compatibility.
import { writable } from 'svelte/store';

export const assetUpdatesToast = writable({ saved: false, deleted: false, count: 0, published: false });
