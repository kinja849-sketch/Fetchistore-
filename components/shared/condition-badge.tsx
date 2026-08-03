import React from "react";

export type Condition = "new" | "like_new" | "good" | "fair";

interface ConditionBadgeProps {
  condition: Condition;
}

const conditionMap: Record<Condition, { label: string; className: string }> = {
  new: { label: "New", className: "bg-green-500 text-white" },
  like_new: { label: "Like New", className: "bg-blue-500 text-white" },
  good: { label: "Good", className: "bg-amber-500 text-white" },
  fair: { label: "Fair", className: "bg-gray-500 text-white" },
};

export function ConditionBadge({ condition }: ConditionBadgeProps) {
  const config = conditionMap[condition];

  if (!config) return null;

  return (
    <span
      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
}
