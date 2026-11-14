# Garden Frame Specification

Static React site: interactive garden/gate models, editable lumber lists, browser-local draft saving, and print/PDF export.

Requires Node.js >=22.13. Run npm ci, then npm run dev.
Build: npm run build. Preview: npm run preview.

## Publish

Create a GitHub repository named garden-repair and push this project to main.
In Settings > Pages, select GitHub Actions as the publishing source.
The included workflow deploys on each push to main.

Expected URL: https://ejohnwood.github.io/garden-repair/
Relative asset paths support other repository names and custom domains too.

Browser drafts from the old chatgpt.site domain do not transfer automatically.
The existing models retain their third-party CDN scripts.
The original site folder is unchanged.
