import { supabaseAdmin } from "@/lib/supabase-admin";
import { PostsTable } from "@/components/admin/posts/PostsTable";

export default async function AdminPostsPage() {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("id, content, type, likes, created_at, user_id, place_id")
    .order("created_at", { ascending: false })
    .limit(200);

  // Fetch usernames and place names in batch
  const userIds = [...new Set((data ?? []).map((p) => p.user_id))];
  const placeIds = [...new Set((data ?? []).map((p) => p.place_id))];

  const [{ data: profiles }, { data: places }] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("id, username")
      .in("id", userIds.length > 0 ? userIds : [""]),
    supabaseAdmin
      .from("places")
      .select("id, name")
      .in("id", placeIds.length > 0 ? placeIds : [""]),
  ]);

  const userMap = new Map(
    (profiles ?? []).map((p) => [p.id, p.username as string])
  );
  const placeMap = new Map(
    (places ?? []).map((p) => [p.id, p.name as string])
  );

  const posts = (data ?? []).map((row) => ({
    id: row.id as string,
    content: row.content as string,
    type: row.type as string,
    likes: row.likes as number,
    createdAt: row.created_at as string,
    username: userMap.get(row.user_id) ?? undefined,
    placeName: placeMap.get(row.place_id) ?? undefined,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Posts</h1>
      <PostsTable posts={posts} />
    </div>
  );
}
