"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  badge?: string;
  trend?: string;
  accent?: "blue" | "green" | "amber" | "rose";
}

const accentMap = {
  blue: "text-blue-700 bg-blue-50",
  green: "text-emerald-700 bg-emerald-50",
  amber: "text-amber-700 bg-amber-50",
  rose: "text-rose-700 bg-rose-50",
};

export default function StatCard({
  label,
  value,
  badge,
  trend,
  accent = "blue",
}: StatCardProps) {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        {badge && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${accentMap[accent]}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {trend && <p className="text-xs text-emerald-600 font-semibold">{trend}</p>}
    </div>
  );
}
