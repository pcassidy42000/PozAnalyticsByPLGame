import { SOURCE_HANDLES, SCOPE_GUARD } from "./config";

const handles = SOURCE_HANDLES.join(", ");

export function makePrompt(workflow, opponent, minute="") {
  const base = SCOPE_GUARD + "\nPriority X accounts: " + handles + "\n";
  const prompts = {
    preview: `${base}
Prepare a PRE-MATCH intelligence brief for Arsenal vs ${opponent}.
Review recent X activity from the listed accounts, then use broader X context only when it materially improves the answer.

Return:
1. WHAT CHANGED
2. LIKELY SETUPS
3. KEY TACTICAL BATTLES
4. BEST ANALYST INSIGHTS with @handles
5. DISAGREEMENTS
6. WHAT TO WATCH in the first 20 minutes

Separate reported information from analysis/speculation. Ignore transfer chatter unless it affects this match. Avoid generic football commentary.`,
    live: `${base}
Do LIVE tactical analysis of Arsenal vs ${opponent}${minute ? " at approximately minute " + minute : ""}.
Prioritize recent in-match posts from the listed accounts.

Return:
1. CURRENT TACTICAL PICTURE
2. WHAT CHANGED FROM THE OPENING PLAN
3. KEY MATCHUP PROBLEMS / ADVANTAGES
4. MANAGER ADJUSTMENTS
5. BEST LIVE OBSERVATIONS with @handles
6. WHAT TO WATCH NEXT

Do not narrate chronologically. Surface what standard commentary is missing.`,
    post: `${base}
Prepare a POST-MATCH analysis of Arsenal vs ${opponent}.
Review post-match analysis and relevant in-match observations from the listed accounts.

Return:
1. WHY THE MATCH WENT THAT WAY
2. TACTICAL TURNING POINTS
3. WHAT THE SCORELINE HID
4. PLAYER/ROLE OBSERVATIONS
5. PRE-MATCH THESIS AUDIT
6. CONSENSUS VS MINORITY VIEW

Avoid generic ratings and narrative recap.`,
    managers: `${base}
Find the most relevant post-match comments from Arsenal's manager and the ${opponent} manager, including press-conference and broadcast remarks circulating on X.

For each manager:
1. REVEALING COMMENTS
2. BOILERPLATE TO IGNORE
3. WHAT IT ADDS
4. TENSION WITH THE EVIDENCE

Distinguish direct reporting from interpretation and identify the source account where possible.`,
    pundits: `${base}
Review pundit, analyst, broadcaster and ex-player reaction on X to Arsenal vs ${opponent}.
Include ONLY material that adds real insight. Exclude generic praise, criticism, mentality talk, hot takes, and studio filler.

Look for structural/tactical explanations, pressing/buildup mechanisms, role detail, useful clip analysis, or credible team context.
For each useful item give SOURCE, INSIGHT, WHY IT MATTERS, and CONFIDENCE.
If there is no real added value, say so rather than padding the report.`
  };
  if (!prompts[workflow]) throw new Error("Unknown workflow");
  return prompts[workflow];
}
