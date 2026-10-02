# Launch notes

## Ready

- Approved collage layout, reel before about, reversible paper covers.
- LinkedIn, Instagram, and X footer links.
- No public motion switch; system reduced-motion preference still respected.
- Resume download bundled with site.
- Drive test removed; seven current projects preserved.
- No remote media files or credentials in repository.

## Content still pending

- Replace four Instagram sources with the user's forthcoming YouTube uploads. Instagram embed did not support in-page playback in our browser test.
- Front-page reel is still a placeholder pending the final reel.
- Review experience wording and final project titles before publication.
- Responsive pass added for phones, tablets, landscape and desktop. Browser viewport checks cover 320–1440 px. Physical iOS/Android playback and text-scaling checks remain before final mobile sign-off.

## Performance follow-up

- Character loop optimized from the 17.7 MB GIF to a 2.95 MB transparent WebM (576x736, 25 fps, 129 frames / 5.16 s). Includes high-quality animated WebP codec fallback and a static reduced-motion/autoplay fallback. Original preserved outside this publishing folder. Full-sequence luminance/chroma SSIM comparison: 0.979; visual texture/transparency checked in browser.
- Video embeds load only after clicking and unload on close.
- Motion updates are driven by scroll and settling frames; reduced-motion disables movement automatically.

## Publishing later

1. Upload the contents of portfolio-site as the GitHub repository root.
2. Complete content and mobile checks, then remove the noindex,nofollow meta tag.
3. Enable GitHub Pages from the intended branch/root and verify its preview URL.
4. Configure rudysen.com only when ready. No CNAME file is included yet.
5. Verify all seven video embeds, social links, resume, focus/keyboard controls, and asset paths on the deployed site.

Existing V1 and V2-approved checkpoints live outside this folder and are unchanged.

## Responsive pass — September 27, 2026

- Bundled Anton (SIL Open Font License included) for the heavy mobile title and desktop font fallback; desktop Impact styling retained.
- Mobile menu with 48 px links, Escape dismissal, and automatic close after navigation.
- Vertical hero, stacked about and work layouts, fluid headings, touch-size filters, and constrained video dialogs including landscape.
- Reversible depth retained at reduced amplitude on narrow viewports; character scales to a margin-sized companion.
- Local source only; no copy to GitHub repository or publication performed.

## Work categories

- SHORTS: the three YouTube films. VFX: the four Instagram studies.
- IMAGES and Other Works have honest empty states until content is added.
- Larger equal-width controls, a two-by-two phone layout, and interruptible directional transitions. System reduced motion switches categories immediately.
