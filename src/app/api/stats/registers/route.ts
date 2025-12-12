import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    title: "5 Registers",
    items: [
      "3000 Families",
      "7000 Individuals",
      "847 Crops",
      "1950 Lands"
    ]
  });
}
