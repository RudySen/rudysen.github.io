# Selected work gallery

Replaces the crumpling tiles with a fixed-height gallery of photographic prints. Each category remembers its current slide. Use arrows, numbered-position dots, keyboard arrows/Home/End, horizontal mouse drag, or touch swipe. Vertical touch scrolling remains native. A drag cannot launch the player; clicking a neighbouring print centres it, and clicking the centred print opens the existing inline player.

Add works as articles under .project-grid with the existing data-category and button metadata. All category slides share one grid cell, so adding work does not add rows. The categories are SHORTS (8), 3D | VFX (5), and Other Works (4), in the supplied September 30 order. The numbered thumbnail strip follows the active slide and scrolls horizontally on narrow screens. Cover images crop to the 16:9 preview; the hosted video player retains its own aspect ratio.

Gallery CSS/JS lives in assets/css/gallery.css and assets/js/gallery.js. Reduced-motion preferences remove gallery transitions. The former atlas is no longer loaded by JavaScript; paper-motion.js now only handles hero pointer drift and the motion preference.

Verified locally: desktop next/previous/drag, category empty state, remembered selection, phone-width layout and thumbnail navigation without horizontal overflow, drag click suppression, inline player open/close. Physical touch-device testing remains for the next phone review.

The demo reel embeds U0FBKLA8bCE with muted autoplay and a single-video loop. Browser autoplay policies can still restrict playback. Gallery players load only when selected. Thumbnails are served by YouTube.

## Native reel update
The front reel now uses assets/video/rudy-sen-reel.mp4: 97,969,159 bytes, H.264 1920x1080 at 24000/1001 fps, two-pass slow encode at 9.65 Mbps, original AAC audio copied, faststart enabled. Original source is untouched. Full-frame SSIM against the source: 0.990831. The video loads on focus, loops, pauses/mutes offscreen, and uses custom sound/pause controls. Browser sound autoplay restrictions still apply. Gallery videos remain on YouTube. Verified native playback, manual pause/resume, sound enable, and offscreen pause/mute locally.
