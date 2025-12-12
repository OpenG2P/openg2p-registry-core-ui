import { NextRequest, NextResponse } from "next/server";

const normalizeType = (type: string) => {
  const lower = type.toLowerCase();
  if (lower === "family") return "families";
  if (lower === "individual") return "individuals";
  return lower;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;

  if (!type || !id) {
    return NextResponse.json({ error: "Invalid route parameters" }, { status: 400 });
  }

  const registryType = normalizeType(type);
  const typeData: Record<string, any> = {};

  const detail = typeData[id];
  // currently for all types of registry and for 
  // it's particualar record serving same details will change later
  if (!detail) {
    return NextResponse.json({
      id,
      name: "Sarah Elizabeth 01",
      personalDetails: {
        name: "Sarah Elizabeth 01",
        id,
        dob: "01 Jan 1980",
        phone: "00000 00000",
        mailId: "example@gmail.com",
        village: "Village Name",
        zone: "Central Zone",
        area: "Area Name",
      },
      tabs: ["Tab 01", "Tab 02", "Tab 03"],
    });
  }

  return NextResponse.json(detail);
}
