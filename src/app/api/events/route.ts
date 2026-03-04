import { NextRequest, NextResponse } from "next/server";
import { fetchEventsPage } from "@/lib/queries";
import { PAGE_SIZE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const offset = Number(params.get("offset") ?? 0);
  const pageSize = Number(params.get("pageSize") ?? PAGE_SIZE);
  const category = params.get("category") ?? undefined;

  const result = await fetchEventsPage(offset, pageSize, category);
  return NextResponse.json(result);
}
