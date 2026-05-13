import { NextResponse } from "next/server";
import wordlist from "@/data/toeic_wordlist.json";

export async function GET() {
  return NextResponse.json(wordlist);
}
