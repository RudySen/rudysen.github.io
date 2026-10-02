# Integrated local review build

Start from E:/GPT/Website/integrated-site:
python -m http.server 8772 --bind 127.0.0.1

Open http://127.0.0.1:8772/ . Routes: #home, #art, #technical, #art/work, #technical/projects, #technical/contact.

The root index.html owns navigation and loads one same-origin experience at a time. Switching removes the previous view, stopping videos, embedded players, listeners and animation work. Browser Back/Forward restores the requested experience. Views remain separate files for maintainability; one domain and one public entry point.

Content placeholders intentionally remain. Technical Generate is a visual preview until the new reel is supplied; no existing Art reel is substituted. Deployment metadata/noindex and domain packaging remain for the publishing round. GitHub checkout is untouched.

Technical has canvas navigation plus a Read view for accessible, responsive content browsing. Art media retains its first-click sound gate. The new technical reel will need the same real-gesture audio handling when supplied.
