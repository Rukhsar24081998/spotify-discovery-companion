import { Sparkles } from "lucide-react";
import type { PipelineStage } from "@/lib/discoveryPipeline";

interface AiAnalyzerPanelProps {
  stages: PipelineStage[];
  activeIndex: number;
  completedCount: number;
  message: string;
}

/**
 * Floating AI analyzer overlay from design-reference/03-ai-processing.png.
 */
export function AiAnalyzerPanel({
  stages,
  activeIndex,
  completedCount,
  message,
}: AiAnalyzerPanelProps) {
  const progressPercent = Math.min(100, ((completedCount + 0.35) / stages.length) * 100);

  return (
    <aside
      aria-live="polite"
      aria-atomic="true"
      className="relative z-20 mb-8 w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#181818] p-5 shadow-[0_0_40px_rgba(29,185,84,0.12),0_12px_40px_rgba(0,0,0,0.45)] lg:absolute lg:right-0 lg:top-0 lg:mb-0 lg:w-[320px]"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          AI Analyzer
        </p>
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-lg bg-[#0f0f0f] p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,185,84,0.12),transparent_70%)]" />
        <div className="relative flex h-24 items-end justify-center gap-1.5">
          {[0.45, 0.7, 1, 0.65, 0.85, 0.55, 0.9, 0.5].map((scale, index) => (
            <span
              key={index}
              className="w-2 origin-bottom rounded-full bg-accent/80 motion-reduce:animate-none animate-ai-wave"
              style={{
                height: `${scale * 100}%`,
                animationDelay: `${index * 0.12}s`,
              }}
            />
          ))}
        </div>
        <Sparkles
          className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-accent motion-reduce:animate-none animate-pulse"
          aria-hidden="true"
        />
      </div>

      <p className="mb-4 text-sm leading-relaxed text-white/65">{message}</p>

      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPercent)}
          aria-label="Discovery pipeline progress"
        />
      </div>

      <div className="flex gap-1">
        {stages.map((stage, index) => {
          const complete = index < completedCount;
          const active = index === activeIndex && !complete;
          return (
            <span
              key={stage.id}
              title={stage.label}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
                complete
                  ? "bg-accent"
                  : active
                    ? "animate-pulse bg-accent/70 motion-reduce:animate-none"
                    : "bg-white/10"
              }`}
            />
          );
        })}
      </div>
    </aside>
  );
}
