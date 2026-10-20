# Validation and integration notes

This addition contains research documentation, catalog records, image assets and reproducible illustration/export scripts. It does not change client, server, Academy routes, database policies or application dependencies.

## Checks performed

- Catalog JSON parses; all new record UUIDs and cross-references were checked.
- The twelve cell paths resolve to 800 x 800 RGBA PNGs with transparent pixels.
- Ten museum reference images resolve; the rights-unresolved kudurru photograph is excluded.
- The 14-page PDF was generated with ReportLab, rendered with Poppler and visually reviewed. Object dates, source links and rights notes are retained.
- The cell-layer ZIP contains all twelve PNGs and a registry.
- The existing Rosetta Stone schema and Primitive Cell Studio were read before preparing the separate crosswalk.
- Candidate studio cells are not promoted into canonical concepts, and no lesson counts or grade results are invented.

## Build commands

```bash
python3 src/render_cells.py
python3 src/render_maps.py
python3 src/build_atlas.py
```

The scripts use Pillow, ReportLab and the DejaVu Sans fonts. PDF rendering was checked using `pdftoppm -r 100 -png`.

`npm run check` and `npm run build` were not run: application source, configuration and dependencies are unchanged. The equivalent checks for this documentation and data addition are JSON/reference validation, image validation, successful artifact generation and PDF visual review. The Academy's behavior has not been exercised by these artifact checks.

## Integration limits

The existing application's database connection uses Neon/Drizzle. The separate Supabase visual records are a research destination; they do not imply runtime wiring. The broader studio-cell usage is linked to the existing narrower repeat-region concept, with no redefinition. Further app import, learner observations, corpus-scale cultural comparisons and circulation measurements remain distinct work.
