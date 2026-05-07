export default function SkeletonCard() {
  return (
    <div className="flex flex-col bg-[#161618] rounded-[12px] border border-white/5 overflow-hidden animate-pulse">
      {/* TOP: Image Placeholder */}
      <div className="h-40 w-full bg-white/5" />

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-1">
        {/* Tag Placeholder */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-16 h-6 rounded-full bg-white/5" />
          <div className="w-12 h-4 rounded bg-white/5" />
        </div>

        {/* Title Placeholder */}
        <div className="w-3/4 h-6 rounded bg-white/10 mb-3" />
        
        {/* Description Placeholders */}
        <div className="w-full h-4 rounded bg-white/5 mb-2" />
        <div className="w-5/6 h-4 rounded bg-white/5 mb-4" />

        {/* Zeigarnik Effect Progress Bar Placeholder */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <div className="w-20 h-3 rounded bg-white/5" />
            <div className="w-10 h-3 rounded bg-white/5" />
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5" />
        </div>

        {/* FOOTER Placeholder */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-4 rounded bg-white/5" />
            <div className="w-8 h-4 rounded bg-white/5" />
          </div>
          <div className="w-5 h-5 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
