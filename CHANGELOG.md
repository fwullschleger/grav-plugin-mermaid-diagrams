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
