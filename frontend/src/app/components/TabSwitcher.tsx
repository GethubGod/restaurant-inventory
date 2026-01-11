"use client";

interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export default function TabSwitcher({ tabs, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
