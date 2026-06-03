/**
 * nav.js — WD-HAN shared navigation
 * Include on every page: <script src="/assets/js/nav.js"></script>
 *
 * What it does:
 *  1. Injects the full nav HTML (desktop + mobile overlay) into #nav-mount
 *  2. Fetches siteSettings from Sanity → wires social + streaming links
 *  3. Fetches Bandsintown → shows/hides Tour link dynamically
 *  4. Handles mobile burger open/close + keyboard Escape
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
    return `https://${SANITY_PROJECT}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${encodeURIComponent(q)}`;
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

  <a class="nav-cta" id="nav-spotify-cta" href="#" target="_blank" rel="noopener" aria-label="Listen on Spotify">
    <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;margin-left:2px"><path d="M6 4.5v15l13-7.5z"/></svg>
  </a>

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

      function wire(id, url) {
        if (!url) return;
        const el = document.getElementById(id);
        if (!el) return;
        el.href = url;
        el.style.display = '';
      }

      // Nav Spotify play button
      if (s.spotify) {
        const cta = document.getElementById('nav-spotify-cta');
        if (cta) cta.href = s.spotify;
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
