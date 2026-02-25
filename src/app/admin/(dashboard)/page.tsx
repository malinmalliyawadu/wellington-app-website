import { supabaseAdmin } from "@/lib/supabase-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mountain,
  MapPin,
  Calendar,
  FileText,
  Users,
  BookOpen,
  Flag,
} from "lucide-react";

async function getCount(table: string) {
  const { count } = await supabaseAdmin
    .from(table)
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

async function getPendingReportsCount() {
  const { count } = await supabaseAdmin
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const [trails, places, events, posts, users, guides, pendingReports] =
    await Promise.all([
      getCount("trails"),
      getCount("places"),
      getCount("events"),
      getCount("posts"),
      getCount("profiles"),
      getCount("guides"),
      getPendingReportsCount(),
    ]);

  const stats = [
    { label: "Trails", value: trails, icon: Mountain },
    { label: "Places", value: places, icon: MapPin },
    { label: "Events", value: events, icon: Calendar },
    { label: "Posts", value: posts, icon: FileText },
    { label: "Users", value: users, icon: Users },
    { label: "Guides", value: guides, icon: BookOpen },
    { label: "Pending Reports", value: pendingReports, icon: Flag },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
