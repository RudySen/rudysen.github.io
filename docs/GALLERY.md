# Selected work gallery

Replaces the crumpling tiles with a fixed-height gallery of photographic prints. Each category remembers its current slide. Use arrows, numbered-position dots, keyboard arrows/Home/End, horizontal mouse drag, or touch swipe. Vertical touch scrolling remains native. A drag cannot launch the player; clicking a neighbouring print centres it, and clicking the centred print opens the existing inline player.

Add works as articles under .project-grid with the existing data-category and button metadata. All category slides share one grid cell, so adding work does not add rows. IMAGES and Other Works remain empty until content is supplied. Cover images crop to the 16:9 preview; the hosted video player retains its own aspect ratio.

Gallery CSS/JS lives in assets/css/gallery.css and assets/js/gallery.js. Reduced-motion preferences remove gallery transitions. The former atlas is no longer loaded by JavaScript; paper-motion.js now only handles hero pointer drift and the motion preference.

Verified locally: desktop next/previous/drag, category empty state, remembered selection, phone-width layout without horizontal overflow, drag click suppression, inline player open/close. Physical touch-device testing remains for the next phone review.
