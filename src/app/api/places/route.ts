import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapPost, mapProfile } from "@/lib/mappers";

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get("id");
  if (!placeId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { data: postRows } = await supabase
    .from("posts")
    .select("*, post_media(*)")
    .eq("place_id", placeId)
    .order("likes", { ascending: false })
    .limit(12);

  const posts = (postRows ?? []).map(mapPost);

  const userIds = [...new Set(posts.map((p) => p.userId))];
  let users: ReturnType<typeof mapProfile>[] = [];
  if (userIds.length > 0) {
    const { data: userRows } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);
    users = (userRows ?? []).map(mapProfile);
  }

  const publicUserIds = new Set(
    users.filter((u) => u.profileVisibility !== "private").map((u) => u.id)
  );
  const publicPosts = posts.filter((p) => publicUserIds.has(p.userId));
  const publicUsers = users.filter((u) => publicUserIds.has(u.id));

  return NextResponse.json({ posts: publicPosts, users: publicUsers });
}
