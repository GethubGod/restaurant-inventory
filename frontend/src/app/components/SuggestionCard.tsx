"use client";

import { Suggestion } from "../types";

interface Props {
  suggestion: Suggestion;
  onAdd: () => void;
}

export default function SuggestionCard({ suggestion, onAdd }: Props) {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">{suggestion.item}</p>
          <p className="text-xs text-gray-500">Source: {suggestion.source}</p>
        </div>
        <span className="text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-1 rounded-full">
          Suggestion
        </span>
      </div>
      <p className="text-sm text-gray-600">{suggestion.reason}</p>
      <button
        onClick={onAdd}
        className="mt-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
      >
        Add to cart
      </button>
    </div>
  );
}
