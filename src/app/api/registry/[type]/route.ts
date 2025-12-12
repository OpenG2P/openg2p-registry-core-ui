import { NextRequest, NextResponse } from "next/server";

// registry mock data
const mockData: Record<string, any> = {
  individuals: {
    items: [
      {
        id: "1234567890",
        name: "Sarah Elizabeth 01",
        label1: "Value1",
        label2: "Log Value 2",
      },
      {
        id: "1234567891",
        name: "Sarah 02",
        label1: "Value1",
        label2: "Log Value 2",
      },
      {
        id: "1234567892",
        name: "Individual Name 03",
        label1: "Value1",
        label2: "Log Value 2",
      },
      {
        id: "1234567893",
        name: "Individual Name 04",
        label1: "Value1",
        label2: "Log Value 2",
      },
      {
        id: "1234567894",
        name: "Individual Name 05",
        label1: "Value1",
        label2: "Log Value 2",
      },
      {
        id: "1234567895",
        name: "Individual Name 06",
        label1: "Value1",
        label2: "Log Value 2",
      },
      {
        id: "1234567896",
        name: "Individual Name 07",
        label1: "Value1",
        label2: "Log Value 2",
      },
    ],
    total: 7,
  },
  families: {
    items: [
      {
        id: "FAM001",
        name: "Family Name 01",
        label1: "Value1",
        label2: "Log Value 2",
      },
      {
        id: "FAM002",
        name: "Family Name 02",
        label1: "Value1",
        label2: "Log Value 2",
      },
      {
        id: "FAM003",
        name: "Family Name 03",
        label1: "Value1",
        label2: "Log Value 2",
      },
    ],
    total: 3,
  },
  crops: {
    items: [
      {
        id: "CROP001",
        name: "Crop Name 01",
        label1: "Value1",
        label2: "Log Value 2",
      },
      {
        id: "CROP002",
        name: "Crop Name 02",
        label1: "Value1",
        label2: "Log Value 2",
      },
      {
        id: "CROP003",
        name: "Crop Name 03",
        label1: "Value1",
        label2: "Log Value 2",
      },
    ],
    total: 3,
  },
  lands: {
    items: [
      {
        id: "LAND001",
        name: "Land Name 01",
        label1: "Value1",
        label2: "Log Value 2",
      },
      {
        id: "LAND002",
        name: "Land Name 02",
        label1: "Value1",
        label2: "Log Value 2",
      },
      {
        id: "LAND003",
        name: "Land Name 03",
        label1: "Value1",
        label2: "Log Value 2",
      },
    ],
    total: 3,
  },
};

const normalizeType = (type: string) => {
  const lower = type.toLowerCase();
  if (lower === "family") return "families";
  if (lower === "individual") return "individuals";
  return lower;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  if (!type) {
    return NextResponse.json({ items: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 0, pageStart: 0, pageEnd: 0 } });
  }
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "7");
  const search = searchParams.get("search") || searchParams.get("q") || "";

  const registryType = normalizeType(type);
  const data = mockData[registryType] || { items: [], total: 0 };

  let filteredItems = data.items;
  if (search) {
    filteredItems = data.items.filter(
      (item: any) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const totalItems = search ? filteredItems.length : data.total;
  const totalPages = Math.ceil(totalItems / limit);

  return NextResponse.json({
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total: totalItems,
      totalPages,
      pageStart: startIndex + 1,
      pageEnd: Math.min(startIndex + paginatedItems.length, totalItems),
    },
  });
}

