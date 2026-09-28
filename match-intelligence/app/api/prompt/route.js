import { NextResponse } from "next/server";
import { makePrompt } from "../../../lib/prompts";

export async function POST(req){
  try{
    const {workflow,opponent,minute}=await req.json();
    if(!workflow||!opponent) return NextResponse.json({error:"workflow and opponent are required"},{status:400});
    return NextResponse.json({prompt:makePrompt(workflow,opponent,minute)});
  }catch(e){
    return NextResponse.json({error:e.message||"Could not generate prompt"},{status:500});
  }
}