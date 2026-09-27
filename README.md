# Rudy Sen portfolio

Self-contained static website, prepared September 26, 2026. No build step, package installation, or API keys required. Upload the contents of this folder as the repository root when ready. Nothing has been published.

## Folder layout

- index.html — page content, project cards, social links, and player dialog
- assets/css/ — site styling and motion
- assets/js/ — filtering, on-demand video embeds, reversible paper animation, and scroll depth choreography
- assets/images/brand/ — avatar still and animation
- assets/images/paper/ — editorial texture and unfolding atlas
- assets/images/covers/ — seven locally cached video thumbnails
- assets/downloads/ — public resume PDF
- content/selected-videos.json — inventory of project titles, sources, posters, and embed URLs
- docs/ — asset direction and launch notes
- .nojekyll — serve static assets directly on GitHub Pages

## Preview

From this folder run:

    python -m http.server 8767 --bind 127.0.0.1

Open http://127.0.0.1:8767/. All asset paths are relative, including support for GitHub project subdirectories.

## Editing projects

The page is static and does not fetch the JSON inventory at runtime. Update the matching card in index.html and its inventory entry in content/selected-videos.json together. Each button has data-embed, data-platform, data-title, and an accessible aria-label. Its cover appears in both the --cover-image property and the fallback img.

For YouTube use https://www.youtube.com/embed/VIDEO_ID?autoplay=1&rel=0&playsinline=1 (escape ampersands as &amp; in HTML attributes). The player loads only when clicked. Closing the dialog or pressing Escape removes the iframe and stops playback. Keep original videos outside this repository.

## Before publishing

See docs/LAUNCH-NOTES.md. The project retains noindex,nofollow until publication is approved and content is ready. GitHub repository creation, pushing, Pages configuration, and DNS changes have not been performed. Do not upload the parent workspace: it contains archives and private working material.
