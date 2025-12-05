import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    title: "7000 Incoming Message",
    items: [
      "5 Partners",
      "3 Data Models"
    ]
  });
}
