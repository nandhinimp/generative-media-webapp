export function ImageSkeleton() {
  return (
    <div className="h-96 animate-pulse rounded-2xl border border-white/6 bg-gradient-to-br from-white/5 to-white/2">
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
        <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white/40 animate-spin" />
      </div>
    </div>
  );
}

export function LoadingGallery() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-6 py-12">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-white/20 border-t-white/40 animate-spin" />
          <span className="text-lg font-medium text-zinc-300">Loading images...</span>
        </div>
        <p className="text-sm text-zinc-500">Please wait a moment</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ImageSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
