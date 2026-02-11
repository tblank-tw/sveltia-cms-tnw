<script>
  import { Menu } from '@sveltia/ui';
  import { _ } from 'svelte-i18n';

  import ShortcutsMenuItem from '$lib/components/help/shortcuts-menu-item.svelte';

  /**
   * @typedef {object} Props
   * @property {import('@sveltia/ui').MenuButton} [menuButton] Menu button.
   */

  /** @type {Props} */
  let {
    /* eslint-disable prefer-const */
    menuButton,
    /* eslint-enable prefer-const */
  } = $props();
</script>

<Menu aria-label={$_('help')}>
  <ShortcutsMenuItem {menuButton} />
</Menu>
