export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-2xl p-6 skeleton-shimmer ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/5" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-white/5 rounded-lg w-3/4" />
          <div className="h-4 bg-white/5 rounded-lg w-full" />
          <div className="h-4 bg-white/5 rounded-lg w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-white/5 rounded-lg skeleton-shimmer"
          style={{ 
            width: i === lines - 1 ? '60%' : '100%',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-white/10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 bg-white/5 rounded skeleton-shimmer flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3">
          {Array.from({ length: 4 }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-white/5 rounded skeleton-shimmer flex-1"
              style={{ animationDelay: `${(rowIndex * 4 + colIndex) * 0.05}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard({ className = '' }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-white/5 skeleton-shimmer" />
        ))}
      </div>
      {/* Chart Area */}
      <div className="h-80 rounded-2xl bg-white/5 skeleton-shimmer" />
      {/* Recent Items */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-white/5 skeleton-shimmer" />
        ))}
      </div>
    </div>
  );
}

export default {
  SkeletonCard,
  SkeletonText,
  SkeletonTable,
  SkeletonDashboard
};
