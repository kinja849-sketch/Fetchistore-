import React from "react";

export type Condition = "new" | "like_new" | "good" | "fair";

interface ConditionBadgeProps {
  condition: Condition;
}

const conditionMap: Record<Condition, { label: string; className: string }> = {
  new: { label: "New", className: "bg-[#8A9A5B] text-white" },
  like_new: { label: "Like New", className: "bg-[#D4A373] text-white" },
  good: { label: "Good", className: "bg-[#E9EDC9] text-[#5C6145]" },
  fair: { label: "Fair", className: "bg-[#E4E2E1] text-[#333333]" },
};

export function ConditionBadge({ condition }: ConditionBadgeProps) {
  const config = conditionMap[condition];

  if (!config) return null;

  return (
    <span
      className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs ${config.className}`}
    >
      {config.label}
    </span>
  );
}
