# Current motion direction

The earlier proposed avatar playground, interactive peel, and breakdown features were declined. Do not implement them.

Implemented at the user's request:
- Section entry and exit use perspective, depth translation, tilt, and layered shadows, reversible with native scrolling. Stable wrappers retain document geometry while their panels move.
- The actual hero character moves into the right margin and travels downward with page progress; reversing scroll brings it back into the hero. Below 600 px it remains attached to its hero position.
- RUDY and SEN separate and rotate along different depth planes as the hero leaves, returning as the page scrolls up.
- No motion toggle. System reduced-motion retains the static character and disables the new transforms.
- Character video pauses when the document is hidden or the film dialog is open. A small smoothing loop stops after reaching each scroll pose.

Before this experiment the complete previous site was saved to versions/V3-design-locked outside the publishing folder.
