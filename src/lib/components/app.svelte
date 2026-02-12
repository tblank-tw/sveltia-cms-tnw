<script>
  import { AppShell } from '@sveltia/ui';
  import mime from 'mime';
  import { onMount } from 'svelte';
  import { isLoading } from 'svelte-i18n';

  import SveltiaLogo from '$lib/assets/sveltia-logo.svg?raw&inline';
  // Font imports — Vite resolves $lib for JS imports (unlike CSS url() in :global blocks)
  import fontLatinUrl from '$lib/assets/fonts/DMSans-Variable-latin.woff2';
  import fontLatinExtUrl from '$lib/assets/fonts/DMSans-Variable-latin-ext.woff2';
  import EntrancePage from '$lib/components/entrance/entrance-page.svelte';
  import BackendStatusIndicator from '$lib/components/global/infobars/backend-status-indicator.svelte';
  import UpdateNotification from '$lib/components/global/infobars/update-notification.svelte';
  import MainRouter from '$lib/components/global/main-router.svelte';
  import { initAppLocale } from '$lib/services/app/i18n';
  import { announcedPageStatus } from '$lib/services/app/navigation';
  import { backend } from '$lib/services/backends';
  import { cmsConfig, DEV_SITE_URL, initCmsConfig } from '$lib/services/config';
  import { dataLoaded } from '$lib/services/contents';
  import { user } from '$lib/services/user';
  import { initUserEnvDetection } from '$lib/services/user/env';

  /**
   * @import { CmsConfig } from '$lib/types/public';
   */

  /**
   * @typedef {object} Props
   * @property {CmsConfig} [config] Configuration specified with manual initialization.
   */

  /** @type {Props} */
  let {
    /* eslint-disable prefer-const */
    config,
    /* eslint-enable prefer-const */
  } = $props();

  // Inject @font-face for DM Sans — must be done via JS because Vite's $lib alias
  // is not resolved in CSS url() within Svelte :global blocks when emitCss: false.
  onMount(() => {
    const style = document.createElement('style');

    style.textContent = `
      @font-face {
        font-family: "DM Sans";
        src: url("${fontLatinExtUrl}") format("woff2");
        font-weight: 100 900;
        font-style: normal;
        font-display: swap;
        unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304,
          U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB,
          U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }
      @font-face {
        font-family: "DM Sans";
        src: url("${fontLatinUrl}") format("woff2");
        font-weight: 100 900;
        font-style: normal;
        font-display: swap;
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
          U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
          U+FEFF, U+FFFD;
      }
    `;
    document.head.appendChild(style);
  });

  onMount(() => {
    initAppLocale();
  });

  onMount(() => {
    initCmsConfig(config);
  });

  onMount(() => {
    initUserEnvDetection();
  });

  // Fix the position of the custom mount element if needed
  // @see https://decapcms.org/docs/custom-mounting/
  // @see https://sveltiacms.app/en/docs/customization#custom-mount-element
  onMount(() => {
    const ncRoot = /** @type {HTMLElement | null} */ (document.querySelector('#nc-root'));

    if (!!ncRoot && window.getComputedStyle(ncRoot).position === 'static') {
      // Wait for the next frame to ensure the element is rendered before calculating its position
      window.requestAnimationFrame(() => {
        const { top, height } = ncRoot.getBoundingClientRect();

        if (height) {
          ncRoot.style.position = 'relative';
        } else {
          // Make sure the CMS UI won’t overlap with a header
          ncRoot.style.position = 'fixed';
          ncRoot.style.inset = `${top}px 0 0 0`;
        }
      });
    }
  });
</script>

<svelte:head>
  <meta name="referrer" content="same-origin" />
  <meta name="robots" content="noindex" />
  {#if $cmsConfig}
    {@const logoURL = $cmsConfig.logo?.src ?? $cmsConfig.logo_url}
    <link
      rel="icon"
      href={logoURL || `data:image/svg+xml;base64,${btoa(SveltiaLogo)}`}
      type={logoURL ? (mime.getType(logoURL) ?? undefined) : 'image/svg+xml'}
    />
  {/if}
  {#if DEV_SITE_URL}
    <link href="{DEV_SITE_URL}/admin/config.yml" type="application/yaml" rel="cms-config-url" />
  {/if}
</svelte:head>

<svelte:body
  onmousedown={(event) => {
    if (/** @type {HTMLElement | null} */ (event.target)?.matches('a')) {
      const link = /** @type {HTMLAnchorElement} */ (event.target);
      const { origin, pathname } = link;

      // Open external links and links to different paths in a new tab
      if (origin !== window.location.origin || pathname !== window.location.pathname) {
        link.target = '_blank';
      }
    }
  }}
/>

<AppShell>
  {#if !$isLoading}
    <div role="none" class="outer">
      <UpdateNotification />
      {#if $backend}
        <BackendStatusIndicator />
      {/if}
      <div role="none" class="main">
        <EntrancePage />
        {#if $user && $dataLoaded}
          <MainRouter />
        {/if}
      </div>
    </div>
  {/if}
  <div role="status">{$announcedPageStatus}</div>
</AppShell>

<style lang="scss">
  // ==========================================================================
  // Trust & Will Brand Palette — SCSS mixins (compile-time, no runtime cost)
  // Accent values differ between light/dark themes. Mixins avoid duplication
  // across the [data-theme] blocks and prefers-color-scheme fallbacks.
  // ==========================================================================
  @mixin tw-light-accents {
    --sui-primary-accent-color: #59acce;
    --sui-primary-accent-color-light: #75bcd6;
    --sui-primary-accent-color-dark: #4495c2;
    --sui-primary-accent-color-text: #2e7a9e; // darkened from brand #3D8BAF for WCAG AA (4.8:1 on white)
    --sui-primary-accent-color-inverted: #1a3040; // dark navy (5.0:1 on #59acce — WCAG AA normal text)
    --sui-primary-accent-color-translucent: rgba(89, 172, 206, 0.4);
    --sui-selected-background-color: #a7d3e5;
  }

  @mixin tw-dark-accents {
    --sui-primary-accent-color: #6dc0de;
    --sui-primary-accent-color-light: #59acce;
    --sui-primary-accent-color-dark: #4a9ec8;
    --sui-primary-accent-color-text: #8dd0ea;
    --sui-primary-accent-color-inverted: #1a3040; // dark navy (6.2:1 on #6dc0de — WCAG AA)
    --sui-primary-accent-color-translucent: rgba(109, 192, 222, 0.4);
    --sui-selected-background-color: #2a6680;
  }

  @view-transition {
    navigation: auto;
  }

  @keyframes slide-out-to-left {
    from {
      transform: translateX(0);
      filter: brightness(1);
    }

    to {
      transform: translateX(-20%);
      filter: brightness(0.5);
    }
  }

  @keyframes slide-out-to-right {
    from {
      transform: translateX(0);
      opacity: 1;
    }

    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @keyframes slide-in-from-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }

    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slide-in-from-left {
    from {
      transform: translateX(-20%);
      filter: brightness(0.5);
    }

    to {
      transform: translateX(0);
      filter: brightness(1);
    }
  }

  // RTL-specific keyframes that mirror the depth effect
  @keyframes slide-out-to-left-rtl {
    from {
      transform: translateX(0);
      opacity: 1;
    }

    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }

  @keyframes slide-out-to-right-rtl {
    from {
      transform: translateX(0);
      filter: brightness(1);
    }

    to {
      transform: translateX(20%);
      filter: brightness(0.5);
    }
  }

  @keyframes slide-in-from-right-rtl {
    from {
      transform: translateX(20%);
      filter: brightness(0.5);
    }

    to {
      transform: translateX(0);
      filter: brightness(1);
    }
  }

  @keyframes slide-in-from-left-rtl {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }

    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  :global {
    /* ===================================================================
     * Trust & Will Brand Theme
     * ===================================================================
     * Brand palette reference:
     *   Primary blue:   #59ACCE  | Hover:     #75BCD6  | Pressed:  #4495C2
     *   Text accent:    #2E7A9E  | Selection: #A7D3E5  | Cream:    #F9E8CB
     *   Inverted text:  #1A3040  | Border:    #D4D3D5  | Text:     #3F3C44
     *   Dark accent:    #6DC0DE  | Dark text: #8DD0EA  | Dark sel: #2A6680
     * Brand font: DM Sans (variable weight, OFL license)
     *
     * Contrast notes (WCAG AA — 4.5:1 normal text, 3:1 large text):
     *   #1A3040 on #59ACCE = 5.0:1 (buttons, checkboxes, sliders — light)
     *   #1A3040 on #6DC0DE = 6.2:1 (same components — dark)
     *   #2E7A9E on #FFFFFF = 4.8:1 (accent text on white — light)
     *   #8DD0EA on dark bg  = 10+:1 (accent text — dark)
     *
     * --sui-primary-accent-color-inverted is set to dark navy (#1A3040)
     * instead of library default white. This affects buttons, checkbox marks,
     * slider thumbs, and switch knobs. Tradeoff: white on #59ACCE was only
     * 2.5:1 (fails AA entirely); dark navy achieves 5.0:1 (passes AA).
     * =================================================================== */

    /* @font-face for DM Sans — injected via JS (onMount) because Vite's $lib alias
     * is not resolved in CSS url() within :global blocks when emitCss: false.
     * See the <script> block for the font injection logic. */

    /* Base overrides — html prefix bumps specificity (0,0,1,1) above @sveltia/ui's
     * :root (0,0,1,0). This ensures our overrides win regardless of <style> injection order. */
    html:root {
      --sui-base-hue: 197; /* T&W blue hue — shifts neutral tones toward brand */
      --sui-font-family-default: "DM Sans", sans-serif;
      --sui-font-weight-normal: 400; /* Default 325 is tuned for Merriweather Sans */
      --sui-font-weight-bold: 700; /* Default 625 is tuned for Merriweather Sans */
    }

    /* Theme accent overrides — html:root[data-theme] (0,0,2,1) beats @sveltia/ui (0,0,2,0).
     * Light/dark values defined in SCSS mixins above to avoid duplication. */
    html:root[data-theme="light"] { @include tw-light-accents; }
    html:root[data-theme="dark"] { @include tw-dark-accents; }

    /* Fallback when data-theme is not yet set (prefers-color-scheme) */
    html:root:not([data-theme]) {
      @media (prefers-color-scheme: light) { @include tw-light-accents; }
      @media (prefers-color-scheme: dark) { @include tw-dark-accents; }
    }

    /* === End Trust & Will Brand Theme === */

    html:active-view-transition-type(forwards) {
      &::view-transition-old(page-root) {
        z-index: 999;
        animation: 100ms ease-in both slide-out-to-left;

        @media (prefers-reduced-motion) {
          animation: none;
        }
      }

      &::view-transition-new(page-root) {
        z-index: 1000;
        animation: 100ms ease-in both slide-in-from-right;

        @media (prefers-reduced-motion) {
          animation: none;
        }
      }

      &:dir(rtl) {
        &::view-transition-old(page-root) {
          animation: 100ms ease-in both slide-out-to-right-rtl;
        }

        &::view-transition-new(page-root) {
          animation: 100ms ease-in both slide-in-from-left-rtl;
        }
      }
    }

    html:active-view-transition-type(backwards) {
      &::view-transition-old(page-root) {
        z-index: 1000;
        animation: 100ms ease-in both slide-out-to-right;

        @media (prefers-reduced-motion) {
          animation: none;
        }
      }

      &::view-transition-new(page-root) {
        z-index: 999;
        animation: 100ms ease-in both slide-in-from-left;

        @media (prefers-reduced-motion) {
          animation: none;
        }
      }

      &:dir(rtl) {
        &::view-transition-old(page-root) {
          animation: 100ms ease-in both slide-out-to-left-rtl;
        }

        &::view-transition-new(page-root) {
          animation: 100ms ease-in both slide-in-from-right-rtl;
        }
      }
    }

    html:active-view-transition-type(unknown) {
      &::view-transition-old(page-root) {
        animation: none;
      }

      &::view-transition-new(page-root) {
        animation: none;
      }
    }

    body:not(:has(#nc-root)) {
      overflow: hidden;
    }

    #nc-root > .sui.app-shell {
      position: absolute;
    }
  }

  .outer {
    display: flex;
    flex-direction: column;
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .main {
    position: relative;
    flex: auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--sui-secondary-background-color);
  }

  [role='status'] {
    position: absolute;
    z-index: -1;
    opacity: 0;
    pointer-events: none;
    -webkit-user-select: none;
    user-select: none;
  }
</style>
