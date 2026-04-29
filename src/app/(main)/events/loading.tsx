import { CardSkeleton } from "@/components/ui/Skeleton";

export default function EventsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-2 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mx-auto h-5 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
