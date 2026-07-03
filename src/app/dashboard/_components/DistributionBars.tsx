/**
 * DistributionBars — Komponen bar chart horizontal sederhana
 * untuk menampilkan distribusi skill / minat terbanyak.
 */

interface DistributionItem {
  name: string;
  count: number;
  category?: string;
}

interface DistributionBarsProps {
  title: string;
  icon: string;
  items: DistributionItem[];
  barColor?: string;
  emptyText?: string;
}

export default function DistributionBars({
  title,
  icon,
  items,
  barColor = "bg-yellow-400",
  emptyText = "Belum ada data",
}: DistributionBarsProps) {
  const maxCount = items.length > 0 ? Math.max(...items.map((i) => i.count)) : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-500 ml-auto">{items.length} item</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 italic py-4 text-center">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => {
            const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            return (
              <div key={`${item.name}-${idx}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-700 truncate mr-2">{item.name}</span>
                  <span className="text-xs text-gray-500 font-mono shrink-0">{item.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
