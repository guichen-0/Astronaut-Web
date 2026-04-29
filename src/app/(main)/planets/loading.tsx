import { CardSkeleton } from "@/components/ui/Skeleton";

export default function PlanetsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-2 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mx-auto h-5 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
