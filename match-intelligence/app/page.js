"use client";
import { useState } from "react";
import { SOURCE_HANDLES } from "../lib/config";

const FLOWS=["preview","live","post","managers","pundits"];
const LABEL={preview:"Preview",live:"Live",post:"Post-match",managers:"Managers",pundits:"Pundits"};

export default function Page(){
  const [flow,setFlow]=useState("post");
  const [opponent,setOpponent]=useState("Brighton & Hove Albion");
  const [minute,setMinute]=useState("");
  const [prompt,setPrompt]=useState("");
  const [raw,setRaw]=useState("");
  const [report,setReport]=useState("");
  const [status,setStatus]=useState("Men’s first team only");
  const [busy,setBusy]=useState(false);

  async function generatePrompt(){
    setBusy(true);
    setStatus("Generating Grok prompt…");
    try{
      const r=await fetch("/api/prompt",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({workflow:flow,opponent,minute})});
      const j=await r.json();
      if(j.error) throw new Error(j.error);
      setPrompt(j.prompt);
      setStatus("Prompt ready — copy it into Grok in your normal X session.");
    }catch(e){ setStatus("Error: "+e.message); }
    finally{ setBusy(false); }
  }

  async function copyPrompt(){
    try{
      await navigator.clipboard.writeText(prompt);
      setStatus("Prompt copied. Paste it into Grok in X.");
    }catch{
      setStatus("Clipboard blocked — select the prompt text manually and copy.");
    }
  }

  function useResponse(){
    if(!raw.trim()){
      setStatus("Paste Grok's answer first.");
      return;
    }
    setReport(raw.trim());
    setStatus("Grok response added to the match page.");
  }

  return <main className="wrap">
    <h2>Arsenal Match Intelligence</h2>
    <div className="muted">Arsenal men’s first team only. Arsenal Women / WFC content is explicitly excluded.</div>

    <section className="hero">
      <h1>Arsenal vs <input value={opponent} onChange={e=>setOpponent(e.target.value)} /></h1>
      <div className="row">
        <button className="primary" onClick={generatePrompt} disabled={busy}>{busy?"Working…":"Generate "+LABEL[flow]+" Grok prompt"}</button>
        {flow==="live" && <input placeholder="Minute" value={minute} onChange={e=>setMinute(e.target.value)} style={{width:120}}/>}
      </div>
      <p className="muted">{status}</p>
    </section>

    <div className="tabs">
      {FLOWS.map(f=><button key={f} className={"tab "+(flow===f?"active":"")} onClick={()=>setFlow(f)}>{LABEL[f]}</button>)}
    </div>

    <div className="grid">
      <section>
        <div className="card">
          <h3>1. Grok prompt</h3>
          <p className="muted">Generate this here, then run it in your normal authenticated Grok-in-X session.</p>
          <textarea
            value={prompt}
            onChange={e=>setPrompt(e.target.value)}
            placeholder="Your Grok prompt will appear here."
            style={{width:"100%",minHeight:260,background:"#0f151d",color:"#fff",border:"1px solid #283342",borderRadius:9,padding:12,fontSize:14,lineHeight:1.45}}
          />
          <div className="row" style={{marginTop:10}}>
            <button onClick={copyPrompt} disabled={!prompt}>Copy prompt</button>
            <a href="https://x.com/i/grok" target="_blank" rel="noreferrer"><button>Open Grok in X</button></a>
          </div>
        </div>

        <div className="card" style={{marginTop:14}}>
          <h3>2. Paste Grok response</h3>
          <textarea
            value={raw}
            onChange={e=>setRaw(e.target.value)}
            placeholder="Paste Grok's response here."
            style={{width:"100%",minHeight:260,background:"#0f151d",color:"#fff",border:"1px solid #283342",borderRadius:9,padding:12,fontSize:14,lineHeight:1.45}}
          />
          <div className="row" style={{marginTop:10}}>
            <button className="primary" onClick={useResponse}>Use this response</button>
            <button onClick={()=>setRaw("")}>Clear</button>
          </div>
        </div>

        <div className="card" style={{marginTop:14}}>
          <h2>{LABEL[flow]} report</h2>
          <div className="output">{report || "No Grok response added yet."}</div>
        </div>
      </section>

      <aside className="card">
        <h3>Curated X accounts</h3>
        <div>{SOURCE_HANDLES.map(h=><span className="handle" key={h}>{h}</span>)}</div>
        <h3>Worked example</h3>
        <p className="muted">Brighton & Hove Albion 3–0 Arsenal<br/>Premier League · 19 Sep 2026 · Amex Stadium</p>
        <h3>Temporary workflow</h3>
        <p className="muted">Website builds the exact prompt → you run it in normal Grok/X → paste the answer back here. No remote-login nonsense.</p>
      </aside>
    </div>
  </main>
}