import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    title: "1800 Outgoing Message",
    items: [
      "7 Topics",
      "8 Data Models"
    ]
  });
}
