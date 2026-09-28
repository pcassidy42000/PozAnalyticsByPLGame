# Arsenal Match Intelligence

Hosted Arsenal MEN'S FIRST TEAM match-intelligence site.

## Current MVP workflow

The remote-browser login path has been temporarily removed because X authentication inside a hosted browser proved too brittle.

Current flow:
1. Choose Preview / Live / Post-match / Managers / Pundits.
2. Generate the exact Grok prompt in the site.
3. Open Grok in the user's normal authenticated X session.
4. Paste the generated prompt into Grok.
5. Paste Grok's response back into the site.
6. The response is rendered on the match page.

## Scope
Hard exclude Arsenal Women / Arsenal WFC, even when a social post simply says "Arsenal".
Exclude academy/youth unless directly relevant to the men's first-team match.

## Worked example
Brighton & Hove Albion 3–0 Arsenal
Premier League · 19 Sep 2026 · Amex Stadium
