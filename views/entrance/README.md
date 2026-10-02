# Entrance prototype

Standalone exploration of the approved Art / Technical entrance. The existing portfolio-site and GitHub checkout are untouched.

Run from this directory: `python -m http.server 8770 --bind 127.0.0.1`
Open http://127.0.0.1:8770/ . It can also be opened directly via index.html.

Both buttons preview an entrance transition, with Back and Escape to return. They intentionally do not open finished portfolio interiors yet.

Implementation: responsive HTML/CSS, pointer parallax for photo layers, SVG connections attached to node ports, moving cable pulses, keyboard focus and reduced-motion support. No third-party runtime or remote asset requests.

Assets: car, kitchen and Scribe frames copied from the existing portfolio; Anton font and its license copied from the existing site. New entrance paper generated with OpenAI imagegen using the approved opening-screen mockup as material reference. Original PNG masters are retained; WebP derivatives are used at runtime (~1 MB combined for three main textures/images, versus ~8 MB PNG originals). No generated project imagery is used.

The technical graph is decorative on this entrance screen. The future technical interior will implement canvas navigation separately.
