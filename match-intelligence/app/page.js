"use client";
import { useState } from "react";
import { SOURCE_HANDLES } from "../lib/config";

const FLOWS=["preview","live","post","managers","pundits"];
const LABEL={preview:"Preview",live:"Live",post:"Post-match",managers:"Managers",pundits:"Pundits"};

export default function Page(){
  const [flow,setFlow]=useState("post");
  const [opponent,setOpponent]=useState("Brighton & Hove Albion");
  const [minute,setMinute]=useState("");
  const [output,setOutput]=useState("Worked example: Brighton 3–0 Arsenal, 19 Sep 2026. Run Post-match, Managers or Pundits once the X/Grok browser is connected.");
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState("Men’s first team only");
  const [loginUrl,setLoginUrl]=useState("");

  async function openLogin(){
    setStatus("Starting secure cloud browser…");
    const r=await fetch("/api/login-session",{method:"POST"});
    const j=await r.json();
    if(j.error){setStatus(j.error);return;}
    setLoginUrl(j.liveViewUrl);
    setStatus("Open the live browser and log into X once. Keep the context ID in Vercel.");
  }

  async function run(){
    setBusy(true); setOutput("Grok is researching X…");
    const r=await fetch("/api/run",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({workflow:flow,opponent,minute})});
    const j=await r.json();
    setOutput(j.error ? "Error: "+j.error : j.output);
    setStatus(j.error ? "Run failed" : "Updated "+new Date(j.capturedAt).toLocaleString());
    setBusy(false);
  }

  return <main className="wrap">
    <h2>Arsenal Match Intelligence</h2>
    <div className="muted">Arsenal men’s first team only. Arsenal Women / WFC content is explicitly excluded.</div>
    <section className="hero">
      <h1>Arsenal vs <input value={opponent} onChange={e=>setOpponent(e.target.value)} /></h1>
      <div className="row">
        <button onClick={openLogin}>Open X/Grok login browser</button>
        <button className="primary" onClick={run} disabled={busy}>{busy?"Working…":"Run "+LABEL[flow]}</button>
        {flow==="live" && <input placeholder="Minute" value={minute} onChange={e=>setMinute(e.target.value)} style={{width:120}}/>}
      </div>
      {loginUrl && <p><a href={loginUrl} target="_blank">Open secure Browserbase live session</a></p>}
      <p className="muted">{status}</p>
    </section>

    <div className="tabs">{FLOWS.map(f=><button key={f} className={"tab "+(flow===f?"active":"")} onClick={()=>setFlow(f)}>{LABEL[f]}</button>)}</div>

    <div className="grid">
      <section className="card">
        <h2>{LABEL[flow]}</h2>
        <div className="output">{output}</div>
      </section>
      <aside className="card">
        <h3>Curated X accounts</h3>
        <div>{SOURCE_HANDLES.map(h=><span className="handle" key={h}>{h}</span>)}</div>
        <h3>Worked example</h3>
        <p className="muted">Brighton & Hove Albion 3–0 Arsenal<br/>Premier League · 19 Sep 2026 · Amex Stadium</p>
      </aside>
    </div>
  </main>
}
