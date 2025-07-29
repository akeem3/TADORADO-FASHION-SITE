const ProductSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm">
    <div className="relative aspect-[3/4] bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
    </div>
  </div>
);

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
