'use client';

import { useState } from 'react'

interface TabDef {
  key: string
  label: string
}

interface AdminTabsProps {
  tabs: TabDef[]
  active: string
  onChange: (key: string) => void
}

export default function AdminTabs({ tabs, active, onChange }: AdminTabsProps) {
  return (
    <div className="mb-8">
      <div className="flex space-x-1 bg-black/20 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              active === tab.key
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
