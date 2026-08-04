"use client";

import React from "react";

export type ItemCondition = "new" | "like_new" | "good" | "fair";

interface ConditionBadgeProps {
  condition: ItemCondition | string;
  className?: string;
}

export function ConditionBadge({ condition, className = "" }: ConditionBadgeProps) {
  const normalized = condition.toLowerCase().replace(/\s+/g, "_");

  const config: Record<string, { label: string; bg: string; text: string }> = {
    new: { label: "New", bg: "bg-[#8A9A5B]", text: "text-white" },
    like_new: { label: "Like New", bg: "bg-[#D4A373]", text: "text-white" },
    good: { label: "Good", bg: "bg-[#E9EDC9]", text: "text-[#5C6145]" },
    fair: { label: "Fair", bg: "bg-[#E4E2E1]", text: "text-[#333333]" },
  };

  const current = config[normalized] || {
    label: condition,
    bg: "bg-[#E9EDC9]",
    text: "text-[#333333]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${current.bg} ${current.text} ${className}`}
    >
      {current.label}
    </span>
  );
}
