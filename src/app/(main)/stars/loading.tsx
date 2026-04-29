import { TableSkeleton } from "@/components/ui/Skeleton";

export default function StarsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-2 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mx-auto h-5 w-72 animate-pulse rounded bg-muted" />
      </div>
      <TableSkeleton rows={15} />
    </div>
  );
}
