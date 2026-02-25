"use client";

import { useState } from "react";
import { Flag, Trash2, CheckCircle, XCircle, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  updateReportStatusAction,
  deleteReportAction,
  deleteReportedContentAction,
} from "@/app/admin/(dashboard)/reports/actions";

interface ReportRow {
  id: string;
  reporterUsername: string;
  reportedUsername: string;
  reportedUserId: string;
  contentType: string;
  contentId?: string;
  reason: string;
  details?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "destructive",
  reviewed: "default",
  dismissed: "secondary",
};

const reasonLabels: Record<string, string> = {
  spam: "Spam",
  inappropriate: "Inappropriate",
  harassment: "Harassment",
  other: "Other",
};

export function ReportsTable({ reports }: { reports: ReportRow[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [reviewTarget, setReviewTarget] = useState<ReportRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ReportRow | null>(null);
  const [deleteContentTarget, setDeleteContentTarget] =
    useState<ReportRow | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const filtered = reports.filter((r) => {
    if (
      statusFilter !== "all" &&
      r.status !== statusFilter
    )
      return false;
    if (reasonFilter !== "all" && r.reason !== reasonFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.reporterUsername.toLowerCase().includes(q) ||
        r.reportedUsername.toLowerCase().includes(q) ||
        r.details?.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openReview = (report: ReportRow) => {
    setAdminNotes(report.adminNotes ?? "");
    setReviewTarget(report);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search by username or details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={reasonFilter} onValueChange={setReasonFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All reasons</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
            <SelectItem value="inappropriate">Inappropriate</SelectItem>
            <SelectItem value="harassment">Harassment</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reporter</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>@{report.reporterUsername}</TableCell>
                  <TableCell>@{report.reportedUsername}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.contentType}</Badge>
                  </TableCell>
                  <TableCell>
                    {reasonLabels[report.reason] ?? report.reason}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[report.status] ?? "secondary"}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {report.contentType === "post" && report.contentId && (
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/posts/${report.contentId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {report.contentType === "user" && (
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/admin/users/${report.reportedUserId}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openReview(report)}
                        title="Review"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      {report.contentId &&
                        report.contentType !== "user" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteContentTarget(report)}
                            title="Delete reported content"
                          >
                            <Flag className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(report)}
                        title="Delete report"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Review dialog */}
      <Dialog
        open={!!reviewTarget}
        onOpenChange={(open) => !open && setReviewTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>
              Reported by @{reviewTarget?.reporterUsername} against @
              {reviewTarget?.reportedUsername} for{" "}
              {reviewTarget?.reason}.
              {reviewTarget?.details && (
                <span className="mt-2 block text-sm">
                  Details: {reviewTarget.details}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Admin notes (optional)"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
          />
          <DialogFooter className="gap-2">
            <form action={updateReportStatusAction}>
              <input type="hidden" name="id" value={reviewTarget?.id} />
              <input type="hidden" name="status" value="dismissed" />
              <input type="hidden" name="adminNotes" value={adminNotes} />
              <Button type="submit" variant="outline">
                <XCircle className="mr-2 h-4 w-4" />
                Dismiss
              </Button>
            </form>
            <form action={updateReportStatusAction}>
              <input type="hidden" name="id" value={reviewTarget?.id} />
              <input type="hidden" name="status" value="reviewed" />
              <input type="hidden" name="adminNotes" value={adminNotes} />
              <Button type="submit">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Reviewed
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete report dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this report? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <form action={deleteReportAction}>
              <input type="hidden" name="id" value={deleteTarget?.id} />
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete reported content dialog */}
      <Dialog
        open={!!deleteContentTarget}
        onOpenChange={(open) => !open && setDeleteContentTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reported Content</DialogTitle>
            <DialogDescription>
              This will permanently delete the reported{" "}
              {deleteContentTarget?.contentType} and mark the report as
              reviewed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteContentTarget(null)}
            >
              Cancel
            </Button>
            <form action={deleteReportedContentAction}>
              <input
                type="hidden"
                name="contentType"
                value={deleteContentTarget?.contentType}
              />
              <input
                type="hidden"
                name="contentId"
                value={deleteContentTarget?.contentId}
              />
              <input
                type="hidden"
                name="reportId"
                value={deleteContentTarget?.id}
              />
              <Button type="submit" variant="destructive">
                Delete Content
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
