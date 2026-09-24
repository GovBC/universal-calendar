# Global dates calendar — data review, 2026-09-11

## Country scope

The country selector contains 195 states: the 193 United Nations member states plus the State of Palestine and the Holy See, the two non-member observer states. Arabic names are rendered with `Intl.DisplayNames`, with explicit Arabic overrides for Saudi Arabia, Palestine and Vatican City. Saudi Arabia remains the default country and the saved choice is restored locally on the same device.

The global selector is deliberately separate from crop-data coverage. Only Saudi Arabia currently has a connected source-backed cultivar dataset. Selecting another country shows a country-specific empty state rather than reusing Saudi cultivars or inventing dates. Future national datasets can attach to the same country code without changing the interface.

- UN member states: https://www.un.org/en/about-us/member-states
- UN non-member observer states: https://www.un.org/en/about-us/non-member-states

## Saudi Arabia dataset

This is a source-backed catalogue of names, not an assertion that all current Saudi cultivars have been identified. Never replace missing dates with inferred start/peak/end months.

The Ministry reports more than 404 Saudi cultivars. This edition contains 248 names, 93 fruit profiles and 10 cultivars with explicitly stated calendar months. Names in different regions may refer to different local material; several local or historical spellings remain separate. These numbers are not a count of genetically distinct cultivars.

## Sources and provenance

- NCPD, **Date Varieties in Saudi Arabia**, third edition (2024). The PDF is linked from the official service page: https://ncpd.gov.sa/ar/services/80a0a624-55b1-4ced-8ae1-99725937c42c . Regional lists: PDF pages 34–42 (printed 32–40). Fruit descriptions: PDF pages 49–212. Page numbers in `dates-data.js` are PDF page numbers, not printed numbers.
- Ministry of Agriculture, **The Famous Date Varieties in the Kingdom of Saudi Arabia**, digitized prior edition: https://iraqi-datepalms.net/المكتبة/كتب-النخيل/اصناف-التمور-المشهورة-بالسعودية/ . Legible entries from PDF pages 24, 25 and 27 (printed 34, 36 and 37) supplement the modern guide. The available scan duplicates printed page 36 and omits page 35. Ambiguous names were not reconstructed. `historicalOnly` does not prove that a name is no longer grown; it means that only an old list is present in this dataset.
- MEWA Madinah report: https://www.mewa.gov.sa/ar/MediaCenter/News/Pages/News12362020.aspx . More than 404 cultivars nationally, named examples and a general regional June–November harvest window.
- MEWA Riyadh report: https://www.mewa.gov.sa/ar/MediaCenter/News/Pages/News12522020.aspx . General regional window: August 1–end November.
- SPA, Buraidah report (2020): https://www.spa.gov.sa/2119465 . The historical Sukkari peak is explicitly labelled by year and place; it is never an annual forecast.

Each cultivar retains source references, PDF page numbers and the region to which a citation applies. All detailed traits and timing are attributed to their specific pages. General regional windows are stored separately from cultivar observations.

## Decisions about ambiguous evidence

- No start, peak, or end boundary is inferred from “early”, “midseason”, “late”, or a named maturity month. These boundaries remain null.
- Ripening-stage observations are discrete source statements; the UI does not fill the months between bisr and tamr as a harvest interval.
- Only the Arabic descriptions are used where the guide's English text disagrees; the relevant records state substantive disagreements. Barhi's Arabic text says August, whereas the English adds September. The UI discloses that discrepancy.
- Some source labels have obvious issues (duplicate stages or non-colour wording). Ambiguous duplicate rows are omitted, ambiguous colour text is retained in `colorUnclear`, and the user sees an uncertainty label. Hilali's truncated Arabic stage label is supported by the English “Bisr” on the same page.
- Physical size is qualitative and source-specific. The catalogue does not invent fruit weights, sugar percentages, health benefits or exact daily harvest forecasts.
- Neither publication years nor historic market reports are used to claim live 2026 crop monitoring.

## Integration

`dates-data.js` loads before `dates-calendar.js`. The pane uses its own scoped stylesheet and is included in the service worker's asset list. Only the shared calendar controller handles the datesHarvest tab; the fishing controller is restricted to its two supported tabs. The date-converter introduction lives inside the original date pane.

The first internal view contains 12 prominent cultivars selected for broad commercial or regional presence in the cited sources: Sukkari, Khalas, Ajwa, Sagae, Barhi, Sefri, Khodry, Safawi, Shaishee, Ruthana, Meneifi and Nabtat Seif. This is a navigation choice rather than a quality ranking. The full 248-name catalogue, its filters, coverage statement and complete detail cards live in the separate directory view.

The deployment source is prepared in an isolated worktree. Android files are outside this change.
