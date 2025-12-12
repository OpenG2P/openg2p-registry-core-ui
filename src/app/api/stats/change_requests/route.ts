import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    title: "1900 Change Requests",
    items: [
      "700 Approved",
      "1900 Pending"
    ]
  });
}
