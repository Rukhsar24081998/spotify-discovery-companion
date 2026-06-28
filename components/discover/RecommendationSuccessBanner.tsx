import { Check } from "lucide-react";

interface RecommendationSuccessBannerProps {
  count: number;
}

/**
 * Subtle success strip shown before recommendation cards.
 */
export function RecommendationSuccessBanner({ count }: RecommendationSuccessBannerProps) {
  const label =
    count === 1
      ? "1 recommendation generated successfully"
      : `${count} recommendations generated successfully`;

  return (
    <div
      role="status"
      className="flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/10 px-3.5 py-2 text-sm font-medium text-accent"
    >
      <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
