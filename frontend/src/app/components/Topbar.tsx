"use client";

import { useState } from "react";

interface TopbarProps {
  onSearch?: (term: string) => void;
  placeholder?: string;
}

export default function Topbar({ onSearch, placeholder }: TopbarProps) {
  const [term, setTerm] = useState("");

  const handleChange = (value: string) => {
    setTerm(value);
    onSearch?.(value);
  };

  return (
    <header className="sticky top-0 z-20 bg-[#f3f6fb]/80 backdrop-blur px-4 md:px-6 py-3 flex items-center gap-3">
      <div className="flex-1 flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
        <span className="text-gray-400 text-lg">🔍</span>
        <input
          value={term}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder ?? "Search inventory, orders, people"}
          className="w-full bg-transparent focus:outline-none text-sm text-gray-800"
        />
      </div>
      <button className="hidden sm:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-blue-700 transition">
        + Quick Add
      </button>
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
        M
      </div>
    </header>
  );
}
