export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-5 flex items-center justify-between md:mb-8">
        <div>
          <div className="mb-2 h-3 w-24 rounded-full bg-surface-2" />
          <div className="h-7 w-40 rounded-full bg-surface-2" />
        </div>
        <div className="h-10 w-10 shrink-0 rounded-full bg-surface-2 md:hidden" />
      </div>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
        <div className="h-24 rounded-card bg-surface" />
        <div className="h-24 rounded-card bg-surface" />
        <div className="h-24 rounded-card bg-surface" />
        <div className="h-24 rounded-card bg-surface" />
      </div>
    </div>
  );
}
