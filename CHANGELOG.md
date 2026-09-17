# v2.0.0
## 17-09-2026

1. [](#new)
   * Upgraded [mermaid](https://github.com/mermaid-js/mermaid) to v12.0.0 (from v11.17.2). Adds UML use case diagrams and per-diagram-type appearance configuration.
   * Added a `look` setting. `classic` (the default) pins `layout: dagre`, `theme: default` and `look: classic`, so diagrams render exactly as they did on Mermaid v11. `neo` leaves Mermaid 12's own defaults in place.
1. [](#improved)
   * Mermaid's defaults changed in v12 — ELK layout, the `neo` look and the `redux-color` theme. Pinning them behind `look: classic` keeps an upgrade from silently redrawing every existing diagram.

**Breaking:** Mermaid 12 targets ES2024 and requires Safari 17.4 or newer; older browsers need a polyfill or the v1.7.x line. The bundled `js/mermaid.min.js` grows from 3.5 MB to 5.6 MB because Mermaid 12 inlines the ELK layout engine into its single-file build. Set `look: neo` to adopt the new appearance.

# v1.7.0
## 17-09-2026

1. [](#improved)
   * Upgraded [mermaid](https://github.com/mermaid-js/mermaid) to v11.17.2 (from v11.12.3). Rendering, configuration and the plugin API are unchanged — this is the last release on the Mermaid v11 line.

# v1.6.2
## 15-06-2026

1. [](#bugfix)
   * Fixed mojibake for multi-byte UTF-8 characters (em dash, arrows, accented letters) in diagrams — the base64 `data-source` is now decoded as UTF-8 instead of Latin-1 (`atob` alone returns a Latin-1 byte string).

# v1.6.1
## 22-03-2026

1. [](#new)
   * Added configurable `js_group` setting for theme compatibility (defaults to `bottom` for themes like Helios).
1. [](#improved)
   * Updated admin panel with usage instructions, section grouping, and improved help text.
   * Updated README for accuracy with Mermaid v11 and current fork.

# v1.6.0
## 11-03-2026

1. [](#new)
   * Added lightbox feature — click any diagram to open a fullscreen overlay with zoom, pan, copy-to-clipboard, and open-in-new-tab functionality.

# v1.5.0
## 12-02-2026

1. [](#new)
   * Upgraded [mermaid](https://github.com/mermaid-js/mermaid) to v11.12.3.
   * Removed legacy v7/v8 CSS overrides (mermaid.css) no longer applicable to v10+.
   * Updated mermaid initialization to use v10+ API (removed deprecated ganttConfig).
   * Added support for standard Markdown fenced code blocks (` ```mermaid `).

# v1.4.0
## 02-03-2024

1. [](#new)
   * Upgraded [mermaid](https://github.com/mermaid-js/mermaid) to v10.8.0, which (among many other things) adds Gitgaph diagrams.

# v1.3.0
## 30-03-2022

1. [](#new)
   * Upgraded [mermaid](https://github.com/mermaid-js/mermaid) to v8.14.0. (Credit: https://github.com/mojerro)

# v1.2.0
## 14-05-2021

1. [](#new)
   * Upgraded [mermaid](https://github.com/mermaid-js/mermaid) to v8.10.1.

# v1.1.0
## 18-12-2019

1. [](#new)
   * Upgraded [mermaid](https://github.com/mermaid-js/mermaid) to v8.4, which adds pie charts and state diagrams.

# v1.0.1
## 02-07-2019

1. [](#improved)
    * Small corrections to README.md

# v1.0.0
## 02-07-2019

1. [](#new)
    * Converted Aurélien Wolz's Diagram Plugin into the present work.
    * Removed the Flow and Sequence diagram generators.
