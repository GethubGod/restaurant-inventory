"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface ShellProps {
  title: string;
  subtitle?: string;
  onSearch?: (term: string) => void;
  children: ReactNode;
}

export default function Shell({ title, subtitle, onSearch, children }: ShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2f8] to-[#dce7ff] text-gray-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar onSearch={onSearch} />
        <div className="px-4 md:px-8 py-6 space-y-6">
          <div>
            <p className="text-sm text-gray-500">Dashboard</p>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
