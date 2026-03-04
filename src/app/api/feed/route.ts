import { NextRequest, NextResponse } from "next/server";
import { fetchFeedPage } from "@/lib/queries";
import { PAGE_SIZE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const offset = Number(params.get("offset") ?? 0);
  const pageSize = Number(params.get("pageSize") ?? PAGE_SIZE);

  const result = await fetchFeedPage(offset, pageSize);
  return NextResponse.json(result);
}
