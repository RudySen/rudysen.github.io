# Local integration verification

Completed in the Codex Chromium preview:
- Opening screen → Art and Technical buttons.
- Persistent Home / Art / Technical switching.
- Browser Back and Forward across experience routes.
- Direct #technical/projects route, project dialog and Escape dismissal.
- Technical Read view, project navigation and contact shortcut.
- 375px CSS viewport: no horizontal overflow in shell, Art or Technical reading view.
- 1440px CSS viewport: entrance assets loaded, captions clear of sketch/button, heading clear of graph nodes; Technical has no horizontal overflow.
- Art WATCH REEL started the local video with audio (readyState 4, no media error).
- Switching away removed the Art iframe; only the Technical iframe remained.
- Technical Generate still runs the placeholder sequence; replacement media is pending.
- JavaScript syntax checks passed for shell, bridge, entrance, Technical and project data.
- Local HTML/CSS file references checked; the only scanner exception was an encoded in-SVG fragment, not a missing file.

Accessibility implementation: named navigation/frame, current-route indication, existing keyboard graph movement, project dialog Escape support, Read view, focus styles, reduced-motion CSS. Reduced-motion OS setting and screen-reader behavior were not directly exercised in this pass.

Still needs physical-device / cross-browser verification: iOS Safari, Android touch/pinch, Firefox, and real mobile network playback. Desktop viewport emulation does not prove those behaviors.

Pending content: Technical demoreel and project images/videos/links. Current Art content is preserved.

2026-10-02 media update: Four supplied YouTube IDs connected and modal URLs verified; Muse embedded player loaded. H3 screenshot and video-coming-soon message verified. Krea removed, scanning placeholders and Other work note added. Art reel fallback verified playing with audio (readyState 4); closing the modal clears media. Full YouTube playback was not tested. Technical reel and Pixel-Society media remain pending.
