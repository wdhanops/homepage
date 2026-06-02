// worker.js
// Handles clean URL routing for release shortlink pages.
// Any path like /humanrace that doesn't match a real file
// gets served by /s/index.html with the slug passed as a query param.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Let the asset handler try first
    const assetResponse = await env.ASSETS.fetch(request);

    // If the asset exists (200), serve it as-is
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    // Only handle clean single-segment paths like /humanrace
    // Ignore paths with dots (files) or multiple segments
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 1 && !segments[0].includes('.')) {
      const slug = segments[0];
      const rewrittenUrl = new URL(`/s/index.html`, url.origin);
      rewrittenUrl.search = `?slug=${slug}`;
      const rewrittenRequest = new Request(rewrittenUrl.toString(), request);
      return env.ASSETS.fetch(rewrittenRequest);
    }

    // Otherwise return the 404
    return assetResponse;
  },
};
