/**
 * nav.js — WD-HAN shared navigation
 * Include on every page: <script src="/assets/js/nav.js"></script>
 *
 * What it does:
 *  1. Injects the full nav HTML (desktop + mobile overlay) into #nav-mount
 *  2. Fetches siteSettings from Sanity → wires social + streaming links
 *  3. Fetches Bandsintown → shows/hides Tour link dynamically
 *  4. Handles mobile burger open/close + keyboard Escape
 *  5. Opens streaming modal on play button click — links to all platforms
 *
 * Each page needs ONE element in its <body> (before this script):
 *   <div id="nav-mount"></div>
 *
 * And the matching CSS variables/classes from the site's shared stylesheet
 * (or inlined — see nav.css for the nav-specific rules).
 */

(function () {

  /* ── Config ── */
  const SANITY_PROJECT = 'oz4mxjaz';
  const SANITY_DATASET = 'production';
  const BIT_ARTIST     = 'wd-han';
  const BIT_APP_ID     = 'wdhan-website';

  /* ── Helpers ── */
  function sanityUrl(q) {
    return `https://${SANITY_PROJECT}.apicdn.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${encodeURIComponent(q)}`;
  }

  /* Work out path depth so relative links resolve correctly.
     /music.html        → depth 0 → root = '/'
     /release/index.html → depth 1 → root = '../'        */
  const depth = (window.location.pathname.match(/\//g) || []).length - 1;
  const root  = depth > 0 ? '../'.repeat(depth) : '/';

  /* Active-link detection — highlight current page in nav */
  function isActive(href) {
    const path = window.location.pathname.replace(/\/index\.html$/, '/');
    const target = href.replace(/^\//, '').replace(/\/index\.html$/, '/');
    return path.endsWith(target) || path === '/' + target;
  }

  /* SVG logo paths (shared between nav and footer instances) */
  const LOGO_PATHS = `
    <g>
      <path d="M175.919,182.501 C184.816,181.582 190.177,176.624 196.674,163.107 L206.221,143.586 C210.982,132.818 214.134,124.234 217.242,113.452 C224.768,86.799 230.381,75.392 246.422,52.998 C253.945,42.311 257.798,31.636 256.973,23.647 C255.38,8.212 243.454,-0.651 226.203,1.129 C215.671,2.216 209.132,13.536 208.627,31.756 C207.413,78.68 187.206,138.942 172.134,140.498 C164.507,141.285 158.385,135.31 156.961,121.509 C155.949,111.703 158.581,99.87 164.282,87.536 C172.439,70.544 178.561,48.073 177.605,38.812 C176.949,32.457 175.354,27.666 169.206,24.997 C163.84,22.798 160.484,24.062 156.532,26.672 C150.007,31.016 145.202,39.587 141.736,52.241 C138.973,62.803 137.592,74.324 136.332,83.447 C130.907,119.794 121.723,139.277 109.557,140.533 C104.472,141.058 101.825,136.743 100.756,126.392 C98.713,106.599 104.028,86.965 117.652,64.27 C124.573,53.095 128.314,41.33 127.471,33.159 C126.065,19.54 115.629,10.89 102.374,12.258 C84.578,14.095 77.41,33.554 81.196,70.235 C82.545,83.309 83.625,97.329 81.725,110.922 L76.74,142.635 C76.132,145.635 76.031,148.214 76.274,150.575 C77.83,165.647 92.31,177.916 106.655,176.436 C110.832,176.005 115.31,173.157 125.255,164.606 C130.29,160.049 133.44,156.787 136.728,156.631 C140.397,156.62 143.859,159.933 148.553,168.074 C154.981,178.789 164.297,183.7 175.919,182.501 z"/>
      <path d="M247.679,168.304 C252.037,167.854 265.075,160.819 277.926,151.968 C288.891,144.413 301.109,136.545 305.969,133.842 C330.555,119.559 367.131,82.75 363.757,50.064 C362.183,34.81 347.809,21.796 336.81,13.021 C329.197,6.832 309.782,1.863 293.802,3.512 C286.72,4.243 279.331,5.556 274.522,6.97 C270.602,8.109 262.869,9.641 257.966,10.147 C246.163,11.365 242.054,16.01 243.141,26.542 C243.572,30.719 244.967,35.346 247.214,39.335 C249.336,43.888 250.675,47.971 251.05,51.603 C251.312,54.145 251.193,56.543 250.71,58.979 C244.541,89.896 247.462,77.299 239.421,107.859 C237.754,114.822 234.841,123.932 232.641,129.297 C229.816,137.48 229.458,139.352 229.814,142.803 C231.051,154.787 240.96,168.997 247.679,168.304 z M275.328,123.24 C266.793,124.121 261.184,119.561 260.303,111.026 C256.892,77.977 284.163,39.926 313.581,36.89 C322.66,35.953 327.086,39.717 328.06,49.16 C330.703,74.764 304.563,120.222 275.328,123.24 z"/>
    </g>
    <g>
      <path d="M47.157,369.063 C58.597,367.883 62.688,357.734 60.476,336.306 C59.295,324.866 59.366,318.436 60.802,307.46 C63.744,284.399 65.554,282.377 87.163,280.147 C98.967,278.929 99.68,280.507 98.876,290.5 C97.615,299.623 94.114,306.591 91,315.538 C88.118,323.176 87.008,328.429 87.439,332.606 C88.264,340.596 98.574,349.809 106.019,349.04 C114.554,348.159 118.037,341.01 116.631,327.391 C114.082,302.695 119.611,276.247 127.601,275.423 C128.691,275.31 129.981,275.361 131.452,275.392 C132.742,275.443 133.831,275.33 135.103,275.199 C147.087,273.962 155.097,267.997 154.347,260.733 C153.673,254.196 149.084,250.632 140.963,250.186 C139.473,249.972 137.075,249.853 134.821,249.351 C132.185,248.706 130.801,247.748 130.67,246.476 C130.351,243.389 134.148,232.17 138.91,221.401 C151.056,196.84 154.064,188.638 153.464,182.827 C152.639,174.838 142.204,166.188 134.395,166.994 C131.671,167.275 128.659,168.32 126.505,170.561 C123.68,173.422 122.095,177.623 121.33,182.657 C117.022,210.263 112.251,235.164 111.085,239.872 C109.706,246.071 106.631,250.059 101.534,252.236 C96.944,253.995 91.114,254.413 84.759,255.069 C77.858,255.781 75.166,254.591 74.772,250.777 C74.229,245.511 78.445,234.799 85.981,222.459 C91.781,212.868 94.495,203.595 93.67,195.606 C92.508,184.347 81.703,173.9 72.261,174.875 C59.913,176.149 52.67,194.882 55.144,218.852 C55.912,226.297 57.507,236.41 55.845,245.207 C54.133,255.293 47.758,261.09 37.226,262.177 C22.517,263.695 8.352,270.479 5.427,275.92 C3.115,280.196 2.136,292.043 6.988,292.826 C13.731,294.149 32.01,289.877 41.428,286.886 C43.569,286.298 44.571,287.112 44.683,288.202 C44.815,289.473 42.758,299.779 36.092,316.984 C30.435,331.515 26.976,340.681 27.726,347.945 C28.738,357.751 39.893,369.813 47.157,369.063 z"/>
      <path d="M148.184,350.378 C154.702,349.521 161.462,333.224 161.984,325.829 L164.568,304.641 C166.6,292.319 171.975,280.386 177.555,275.772 C180.129,274.039 185.846,272.531 193.654,271.725 L205.057,270.181 C209.778,269.694 210.999,270.852 211.881,274.065 C212.782,277.459 213.357,281.253 213.844,285.975 C214.632,293.601 213.903,304.321 214.315,308.316 C215.496,319.756 225.649,331.004 234.002,330.142 C241.447,329.373 250.737,314.467 249.762,305.024 C249.462,302.119 246.683,296.533 243.472,292.093 C241.92,289.5 238.365,285.279 238.008,281.829 C236.753,269.663 242.02,263.797 252.734,262.691 C264.719,261.454 275.441,251.538 274.522,242.641 C274.166,239.19 271.618,237.618 267.078,238.087 C265.807,238.218 264.192,238.568 260.816,239.651 C257.097,240.952 252.776,241.765 248.6,242.196 C241.699,242.908 240.497,241.931 239.823,235.394 C239.448,231.762 239.505,226.985 240.19,219.39 C241.576,209.704 239.993,203.26 240.896,196.01 C242.125,188.358 244.444,180.595 243.619,172.605 C242.532,162.073 230.612,155.044 217.356,156.413 C214.088,156.75 209.967,157.726 204.907,160.267 C197.581,163.959 187.128,172.93 188.046,181.827 C190.539,205.979 170.41,251 156.61,252.425 L147.205,253.762 C107.224,259.357 91.902,256.717 80.555,264.128 C69.207,271.539 81.769,291.898 89.759,291.074 C92.12,290.83 95.37,290.311 100.95,285.698 C109.066,278.987 133.399,276.476 147.713,276.467 C151.564,276.436 152.277,278.014 151.18,281.614 C148.843,289.197 138.627,304.015 134.294,306.481 C126.046,311.921 121.26,320.673 122.103,328.844 C122.947,337.016 136.944,351.721 148.184,350.378 z M210.084,245.988 C201.55,246.869 195.639,244.726 195.208,240.549 C194.346,232.196 204.719,215.343 211.075,214.687 C214.162,214.368 216.165,215.997 217.103,219.754 C218.148,222.766 218.379,226.78 218.735,230.23 C219.747,240.035 216.803,245.294 210.084,245.988 z"/>
      <path d="M263.988,334.388 C269.617,333.807 274.083,327.29 277.367,314.655 C279.987,304.474 280.985,292.809 281.8,286.485 C285.213,257.32 295.452,226.716 301.989,226.042 C307.8,225.442 312.256,233.057 315.559,249.05 C318.142,261.629 319.077,276.031 319.715,282.205 C322.695,311.078 328.04,318.417 344.928,316.674 C356.005,315.531 364.404,306.222 364.726,293.342 C365.358,269.236 375.537,225.608 387.088,202.393 C395.245,185.401 397.169,179.147 396.288,170.612 C394.995,158.082 381.56,148.825 370.107,151.658 C360.432,153.942 356.348,160.603 356.415,170.139 L356.522,192.518 C356.169,229.993 350.652,260.109 343.933,260.803 C338.667,261.346 333.911,250.826 329.921,229.949 C326.925,213.374 325.414,195.178 324.833,189.549 C322.284,164.853 314.335,155.396 297.447,157.139 C280.741,158.863 272.146,175.166 274.695,199.862 C275.688,209.486 275.354,218.697 273.831,225.277 C270.641,238.82 259.902,266.356 251.289,282.477 L242.099,300.126 C239.412,306.093 238.553,310.219 238.946,314.032 C240.09,325.109 252.911,335.531 263.988,334.388 z"/>
    </g>`;

  const LOGO_SVG = (height, extraStyle) =>
    `<svg viewBox="0 0 400 370" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="height:${height};width:auto;fill:currentColor;${extraStyle||''}">${LOGO_PATHS}</svg>`;

  /* ── Nav links definition (single source of truth) ── */
  const NAV_LINKS = [
    { label: 'The Band', href: `${root}about.html` },
    { label: 'Music',    href: `${root}music.html` },
    { label: 'Videos',  href: `${root}videos.html` },
    { label: 'Tour',    href: `${root}shows.html`, id: 'nav-tour-link', hidden: true },
    { label: 'Merch',   href: 'https://wd-han.myshopify.com' },
  ];

  /* ── Platform definitions for the streaming modal ── */
  /*
   * followUrl: direct link to follow/subscribe action on that platform.
   *   - YouTube Music: sub_confirmation=1 triggers subscribe prompt
   *   - Tidal / Deezer: platform picks up the artist page as a follow target
   *   - Spotify: no dedicated follow URL — set to null, falls back to main url
   *   - Apple Music / Amazon: no follow URL — set to null, follow btn hidden
   *
   * To add your Tidal or Deezer artist IDs later, replace the placeholder
   * strings in followUrl below with the correct URLs.
   */
  const PLATFORMS = [
    {
      key:       'spotify',
      label:     'Spotify',
      color:     '#1DB954',
      followUrl: null,  // Spotify has no direct follow link — main link used
      canFollow: false, // hide follow btn; Spotify's artist page handles it
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.469-5.304-1.8-8.785-.986a.623.623 0 01-.277-1.215c3.809-.87 7.076-.496 9.712 1.137a.624.624 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257C14.1 12.307 10.539 11.88 7.2 12.84a.778.778 0 01-.453-1.489c3.795-1.153 7.707-.595 10.806 1.28a.778.778 0 01.256 1.071zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.543-1.79c3.532-1.073 9.404-.866 13.115 1.337a.934.934 0 01-1.109 1.498z"/></svg>`,
    },
    {
      key:       'appleMusic',
      label:     'Apple Music',
      color:     '#FC3C44',
      followUrl: null,
      canFollow: false,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.769-.75c-.69-.15-1.39-.2-2.09-.2H6.289c-.7 0-1.4.05-2.09.2a5.022 5.022 0 00-1.77.75C1.31 1.624.563 2.624.244 3.934a9.23 9.23 0 00-.24 2.19C0 6.75 0 7.5 0 8.25v7.5c0 .75 0 1.5.004 2.126a9.23 9.23 0 00.24 2.19c.317 1.31 1.062 2.31 2.18 3.043a5.022 5.022 0 001.769.75c.69.15 1.39.2 2.09.2h11.433c.7 0 1.4-.05 2.09-.2a5.022 5.022 0 001.77-.75c1.118-.734 1.863-1.734 2.18-3.043a9.23 9.23 0 00.24-2.19c.004-.626.004-1.376.004-2.126v-7.5c0-.75 0-1.5-.012-2.126zM8.073 16.915V8.205l8 4.355-8 4.355z"/></svg>`,
    },
    {
      key:       'youtubeMusic',
      label:     'YouTube Music',
      color:     '#FF0000',
      followUrl: 'https://www.youtube.com/@wdhanband?sub_confirmation=1',
      canFollow: true,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z"/></svg>`,
    },
    {
      key:       'amazonMusic',
      label:     'Amazon Music',
      color:     '#25D1DA',
      followUrl: null,
      canFollow: false,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.699-3.182v.685zm3.186 7.705a.661.661 0 01-.75.074c-1.052-.874-1.238-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.098v-.41c0-.753.06-1.642-.383-2.294-.385-.579-1.124-.818-1.775-.818-1.206 0-2.277.618-2.54 1.897-.054.285-.261.567-.547.582l-3.065-.33c-.259-.057-.548-.266-.472-.662C5.97 2.368 9.04 1 12.06 1c1.644 0 3.791.438 5.089 1.685 1.644 1.538 1.487 3.594 1.487 5.831v5.279c0 1.588.659 2.286 1.279 3.145.216.305.263.668-.01.894-.693.578-1.927 1.655-2.607 2.258l-.154-.097zm3.21 1.681c-1.504.5-3.073.874-4.717.874-2.144 0-4.051-.58-5.622-1.557-.201-.123-.425.1-.248.275 1.497 1.753 3.503 2.808 5.87 2.808 1.994 0 4.32-.754 5.854-2.302.321-.32.122-.703-.137-.598z"/></svg>`,
    },
    {
      key:       'tidal',
      label:     'Tidal',
      color:     '#000000',
      followUrl: 'https://tidal.com/artist/41078195/follow',
      canFollow: true,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004L20.02 11.996l-4.004 4.004-4.004-4.004-4.004 4.004-4.004-4.004L0 16.004l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004 4.004 4.004L24 16.004l-4.004-4.004 4.004-4.004z"/></svg>`,
    },
    {
      key:       'deezer',
      label:     'Deezer',
      color:     '#EF5466',
      followUrl: 'https://www.deezer.com/artist/3797251',
      canFollow: true,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.944 17.773h3.944v2.25h-3.944zm-5.372 0h3.944v2.25H13.57zm-5.37 0h3.944v2.25H8.2zm-5.317 0H6.83v2.25H2.883zM13.57 14.036h3.944v2.25H13.57zm-5.37 0h3.944v2.25H8.2zm-5.317 0H6.83v2.25H2.883zm16.06-3.738h3.944v2.25h-3.944zm-5.373 0h3.944v2.25H13.57zm-5.37 0h3.944v2.25H8.2zm-5.317 0H6.83v2.25H2.883zm16.06-3.737h3.944v2.25h-3.944zm-5.373 0h3.944v2.25H13.57zm-5.37 0h3.944v2.25H8.2zM18.944 2.824h3.944v2.25h-3.944zm-5.374 0h3.944v2.25H13.57z"/></svg>`,
    },
  ];

  /* ── Streaming modal ── */
  function buildStreamingModal() {
    const existing = document.getElementById('streaming-modal-overlay');
    if (existing) return; // already injected

    const style = document.createElement('style');
    style.textContent = `
      #streaming-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,.72);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        opacity: 0;
        visibility: hidden;
        transition: opacity .25s ease, visibility .25s ease;
      }
      #streaming-modal-overlay.open {
        opacity: 1;
        visibility: visible;
      }
      #streaming-modal {
        position: relative;
        width: min(420px, calc(100vw - 32px));
        background: #0e0e10;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 20px;
        overflow: hidden;
        transform: translateY(18px) scale(.97);
        transition: transform .3s cubic-bezier(.22,1,.36,1);
        box-shadow: 0 32px 80px rgba(0,0,0,.6);
      }
      #streaming-modal-overlay.open #streaming-modal {
        transform: translateY(0) scale(1);
      }
      #streaming-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 20px 16px;
        border-bottom: 1px solid rgba(255,255,255,.06);
      }
      #streaming-modal-header h2 {
        font-size: 13px;
        font-weight: 600;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: rgba(255,255,255,.45);
        margin: 0;
      }
      #streaming-modal-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(255,255,255,.07);
        border: none;
        cursor: pointer;
        color: rgba(255,255,255,.6);
        transition: background .15s, color .15s;
        padding: 0;
      }
      #streaming-modal-close:hover {
        background: rgba(255,255,255,.14);
        color: #fff;
      }
      #streaming-modal-body {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      /* ── Platform row ── */
      .stream-row {
        display: flex;
        align-items: center;
        gap: 8px;
        border-radius: 12px;
        overflow: hidden;
      }
      .stream-main {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
        background: rgba(255,255,255,.04);
        border-radius: 12px;
        text-decoration: none;
        color: #fff;
        transition: background .15s, transform .12s;
        min-width: 0;
        border: 1px solid rgba(255,255,255,.06);
      }
      .stream-main:hover {
        background: rgba(255,255,255,.09);
        transform: translateX(2px);
      }
      .stream-main:active {
        transform: translateX(0) scale(.98);
      }
      .stream-icon {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .stream-icon svg {
        width: 20px;
        height: 20px;
      }
      .stream-label {
        font-size: 15px;
        font-weight: 500;
        letter-spacing: .01em;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .stream-arrow {
        flex-shrink: 0;
        width: 16px;
        height: 16px;
        opacity: .3;
        transition: opacity .15s, transform .15s;
      }
      .stream-main:hover .stream-arrow {
        opacity: .7;
        transform: translateX(2px);
      }

      /* ── Follow button ── */
      .stream-follow {
        flex-shrink: 0;
        width: 64px;
        height: 64px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        text-decoration: none;
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(255,255,255,.06);
        color: rgba(255,255,255,.6);
        font-size: 9px;
        font-weight: 700;
        letter-spacing: .07em;
        text-transform: uppercase;
        transition: background .15s, color .15s, border-color .15s, transform .12s;
        cursor: pointer;
      }
      .stream-follow:hover {
        color: #fff;
        transform: scale(1.06);
      }
      .stream-follow:active {
        transform: scale(.97);
      }
      .stream-follow svg {
        width: 18px;
        height: 18px;
      }
      .stream-follow-label {
        line-height: 1;
      }

      /* Footer nudge */
      #streaming-modal-footer {
        padding: 10px 20px 18px;
        text-align: center;
        font-size: 11px;
        color: rgba(255,255,255,.22);
        letter-spacing: .04em;
      }
    `;
    document.head.appendChild(style);

    // Build row HTML — filled in later once we have URLs from Sanity
    const overlay = document.createElement('div');
    overlay.id = 'streaming-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Listen on streaming platforms');

    overlay.innerHTML = `
      <div id="streaming-modal">
        <div id="streaming-modal-header">
          <h2>Listen on</h2>
          <button id="streaming-modal-close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="width:14px;height:14px">
              <line x1="6" y1="6" x2="18" y2="18"/>
              <line x1="18" y1="6" x2="6" y2="18"/>
            </svg>
          </button>
        </div>
        <div id="streaming-modal-body">
          <!-- rows injected by populateStreamingModal() -->
        </div>
        <div id="streaming-modal-footer">Follow us to never miss a release</div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close behaviours
    const closeModal = () => overlay.classList.remove('open');

    document.getElementById('streaming-modal-close').addEventListener('click', closeModal);

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function populateStreamingModal(socials) {
    const body = document.getElementById('streaming-modal-body');
    if (!body) return;

    // Follow icon SVG (generic "add person" / "+" style)
    const followIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`;

    const arrowSVG = `<svg class="stream-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

    let html = '';

    PLATFORMS.forEach(p => {
      const url = socials[p.key];
      if (!url) return; // skip platforms with no URL in Sanity

      const followUrl = p.canFollow && p.followUrl ? p.followUrl : null;

      // Follow button: uses platform color on hover via inline style trick
      const followBtn = followUrl
        ? `<a class="stream-follow" href="${followUrl}" target="_blank" rel="noopener"
             style="--follow-color:${p.color}"
             aria-label="Follow WD-HAN on ${p.label}"
             onmouseover="this.style.background='${p.color}22';this.style.borderColor='${p.color}55';this.style.color='${p.color}'"
             onmouseout="this.style.background='';this.style.borderColor='';this.style.color=''">
             ${followIconSVG}
             <span class="stream-follow-label">Follow</span>
           </a>`
        : '';

      html += `
        <div class="stream-row">
          <a class="stream-main" href="${url}" target="_blank" rel="noopener" aria-label="Listen on ${p.label}">
            <span class="stream-icon" style="background:${p.color}22;color:${p.color}">
              ${p.icon}
            </span>
            <span class="stream-label">${p.label}</span>
            ${arrowSVG}
          </a>
          ${followBtn}
        </div>`;
    });

    body.innerHTML = html || '<p style="color:rgba(255,255,255,.4);padding:12px;font-size:14px">No streaming links configured yet.</p>';
  }

  /* ── Inject nav HTML ── */
  function buildNav() {
    const mount = document.getElementById('nav-mount');
    if (!mount) return;

    const desktopLinks = NAV_LINKS.map(l => {
      const active = isActive(l.href) ? ' class="active"' : '';
      const ext    = l.external ? ' target="_blank" rel="noopener"' : '';
      const id     = l.id ? ` id="${l.id}"` : '';
      const style  = l.hidden ? ' style="display:none"' : '';
      return `<a href="${l.href}"${id}${active}${ext}${style}>${l.label}</a>`;
    }).join('\n      ');

    const mobileLinks = NAV_LINKS.map(l => {
      const ext   = l.external ? ' target="_blank" rel="noopener"' : '';
      const id    = l.id ? ` id="${l.id}-mobile"` : '';
      const style = l.hidden ? ' style="display:none"' : '';
      return `<a href="${l.href}"${id}${ext}${style}>${l.label}</a>`;
    }).join('\n  ');

    mount.innerHTML = `
<!-- ── Desktop nav ── -->
<nav class="nav" id="nav-bar">
  <a href="${root}" class="nav-logo" aria-label="WD-HAN home">
    ${LOGO_SVG('36px', 'filter:drop-shadow(0 2px 12px rgba(0,0,0,.4));transition:fill .2s var(--ease,ease);')}
  </a>

  <div class="nav-center">
    ${desktopLinks}
  </div>

  <button class="nav-cta" id="nav-spotify-cta" aria-label="Listen on streaming platforms">
    <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;margin-left:2px"><path d="M6 4.5v15l13-7.5z"/></svg>
  </button>

  <button class="nav-burger" id="nav-burger-btn" aria-label="Open menu">
    <svg viewBox="0 0 22 22" style="width:22px;height:22px;stroke:currentColor;stroke-width:2;stroke-linecap:round;fill:none">
      <line x1="2" y1="5" x2="20" y2="5"/>
      <line x1="2" y1="11" x2="20" y2="11"/>
      <line x1="2" y1="17" x2="20" y2="17"/>
    </svg>
  </button>
</nav>

<!-- ── Mobile nav overlay ── -->
<nav class="nav-mobile" id="nav-mobile" aria-label="Mobile navigation">
  <button class="nav-mobile-close" id="nav-mobile-close" aria-label="Close menu">
    <svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;stroke-width:2;stroke-linecap:round;fill:none">
      <line x1="6" y1="6" x2="18" y2="18"/>
      <line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  </button>
  ${mobileLinks}
</nav>`;
  }

  /* ── Sanity: site settings → social + streaming links ── */
  async function initSiteSettings() {
    const q = `*[_type == "siteSettings"][0] { socials }`;
    try {
      const res = await fetch(sanityUrl(q));
      const { result } = await res.json();
      const s = result?.socials || {};

      // Build + populate the streaming modal
      buildStreamingModal();
      populateStreamingModal(s);

      // Wire the nav play button to open the modal
      const cta = document.getElementById('nav-spotify-cta');
      if (cta) {
        cta.addEventListener('click', () => {
          const overlay = document.getElementById('streaming-modal-overlay');
          if (overlay) overlay.classList.add('open');
        });
      }

      function wire(id, url) {
        if (!url) return;
        const el = document.getElementById(id);
        if (!el) return;
        el.href = url;
        el.style.display = '';
      }

      // Footer listen cluster (present on homepage only; safe to no-op elsewhere)
      wire('listen-spotify',  s.spotify);
      wire('listen-apple',    s.appleMusic);
      wire('listen-ytmusic',  s.youtubeMusic);
      wire('listen-tidal',    s.tidal);

      // Footer social cluster
      wire('social-instagram', s.instagram);
      wire('social-youtube',   s.youtube);
      wire('social-tiktok',    s.tiktok);
      wire('social-facebook',  s.facebook);

    } catch(e) {
      console.warn('[nav.js] Site settings fetch failed', e);

      // Even on fetch failure, inject the modal so button isn't dead
      buildStreamingModal();
      populateStreamingModal({});

      const cta = document.getElementById('nav-spotify-cta');
      if (cta) {
        cta.addEventListener('click', () => {
          const overlay = document.getElementById('streaming-modal-overlay');
          if (overlay) overlay.classList.add('open');
        });
      }
    }
  }

  /* ── Bandsintown: show Tour link only when upcoming events exist ── */
  async function initTourNav() {
    try {
      const res = await fetch('https://admin-api.wdhan.com/bandsintown', {
        headers: { Accept: 'application/json' }
      });
      const events = await res.json();
      if (Array.isArray(events) && events.length > 0) {
        const desktop = document.getElementById('nav-tour-link');
        const mobile  = document.getElementById('nav-tour-link-mobile');
        if (desktop) desktop.style.display = '';
        if (mobile)  mobile.style.display  = '';
      }
    } catch(e) {
      console.warn('[nav.js] Bandsintown fetch failed — Tour link stays hidden', e);
    }
  }

  /* ── Mobile burger ── */
  function initMobileNav() {
    const burger      = document.getElementById('nav-burger-btn');
    const mobileNav   = document.getElementById('nav-mobile');
    const mobileClose = document.getElementById('nav-mobile-close');
    if (!burger || !mobileNav) return;

    burger.addEventListener('click',      () => mobileNav.classList.add('open'));
    mobileClose?.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileNav.classList.remove('open'))
    );

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') mobileNav.classList.remove('open');
    });
  }

  /* ── Scroll background ── */
  function initScrollBg() {
    const nav = document.getElementById("nav-bar");
    if (!nav) return;
    const toggle = () => nav.classList.toggle("scrolled", window.scrollY > 30);
    window.addEventListener("scroll", toggle, { passive: true });
    toggle(); // run once on load in case page is already scrolled
  }

  /* ── Init ── */
  function init() {
    buildNav();
    initScrollBg();
    initMobileNav();
    initSiteSettings();
    initTourNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
