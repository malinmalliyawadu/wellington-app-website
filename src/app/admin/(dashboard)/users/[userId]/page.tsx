import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { mapProfile } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!data) notFound();

  const user = mapProfile(data);

  const [{ count: postCount }, { count: guideCount }] = await Promise.all([
    supabaseAdmin
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabaseAdmin
      .from("guides")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">User Detail</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="text-lg">
                {user.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl">{user.displayName}</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.bio && (
            <div>
              <p className="text-sm text-muted-foreground">Bio</p>
              <p className="mt-1">{user.bio}</p>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Posts</p>
              <p className="mt-1 text-2xl font-bold">{postCount ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Guides</p>
              <p className="mt-1 text-2xl font-bold">{guideCount ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
