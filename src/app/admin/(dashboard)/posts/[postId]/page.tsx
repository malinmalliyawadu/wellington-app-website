import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deletePostAction } from "../actions";

export default async function AdminPostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const { data: post } = await supabaseAdmin
    .from("posts")
    .select("*, post_media(*)")
    .eq("id", postId)
    .single();

  if (!post) notFound();

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("username, display_name")
    .eq("id", post.user_id)
    .single();

  const { data: place } = await supabaseAdmin
    .from("places")
    .select("name")
    .eq("id", post.place_id)
    .single();

  const media = (post.post_media ?? []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) =>
      a.sort_order - b.sort_order
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/posts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Post Detail</h1>
        </div>
        <form action={deletePostAction}>
          <input type="hidden" name="id" value={post.id} />
          <Button type="submit" variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary">{post.type}</Badge>
            <span className="text-muted-foreground">by</span>
            {profile?.display_name ?? profile?.username ?? "Unknown"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Content</p>
            <p className="mt-1">{post.content || "(empty)"}</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Place</p>
              <p className="mt-1">{place?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Likes</p>
              <p className="mt-1">{post.likes}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="mt-1">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {media.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Media</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {media.map(
                  (m: { id: string; media_url: string; media_type: string }) => (
                    <div
                      key={m.id}
                      className="relative aspect-square overflow-hidden rounded-md border"
                    >
                      {m.media_type === "photo" ? (
                        <Image
                          src={m.media_url}
                          alt="Post media"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={m.media_url}
                          controls
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
