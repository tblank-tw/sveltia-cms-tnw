<script>
  import { Icon, Menu, MenuButton, MenuItem } from '@sveltia/ui';
  import { _ } from 'svelte-i18n';

  import { goto } from '$lib/services/app/navigation';
  import { getValidCollections } from '$lib/services/contents/collection';
  import { getEntriesByCollection } from '$lib/services/contents/collection/entries';

  /**
   * @import { EntryCollection } from '$lib/types/public';
   */

  const entryCollections = $derived(
    /** @type {EntryCollection[]} */ (getValidCollections({ visible: true, type: 'entry' })),
  );
</script>

<MenuButton
  variant="ghost"
  iconic
  popupPosition="bottom-right"
  aria-label={$_('create_entry')}
>
  {#snippet endIcon()}
    <Icon name="add" />
  {/snippet}
  {#snippet popup()}
    <Menu aria-label={$_('create_entry')}>
      {#each entryCollections as collection (collection.name)}
        {@const {
          name,
          label,
          label_singular: labelSingular,
          create = true,
          limit = Infinity,
        } = collection}
        <MenuItem
          label={labelSingular || label || name}
          disabled={!create || getEntriesByCollection(name).length >= limit}
          onclick={() => {
            goto(`/collections/${name}/new`, { transitionType: 'forwards' });
          }}
        />
      {/each}
    </Menu>
  {/snippet}
</MenuButton>
