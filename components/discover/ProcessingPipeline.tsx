import { Check } from "lucide-react";
import type { PipelineStage } from "@/lib/discoveryPipeline";

interface ProcessingPipelineProps {
  stages: PipelineStage[];
  activeIndex: number;
  completedCount: number;
}

/**
 * Staged AI thinking sequence for the discovery loading screen.
 */
export function ProcessingPipeline({ stages, activeIndex, completedCount }: ProcessingPipelineProps) {
  return (
    <ol
      aria-label="AI discovery progress"
      className="relative z-10 mt-6 space-y-2 rounded-xl border border-white/[0.06] bg-[#121212]/80 p-4 backdrop-blur-sm sm:p-5"
    >
      {stages.map((stage, index) => {
        const complete = index < completedCount;
        const active = index === activeIndex && !complete && completedCount < stages.length;
        const visible = index <= activeIndex || index < completedCount;

        if (!visible) {
          return null;
        }

        return (
          <li
            key={stage.id}
            className="flex items-start gap-3 motion-reduce:animate-none animate-fade-in"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center"
            >
              {complete ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15">
                  <Check className="h-3.5 w-3.5 text-accent" />
                </span>
              ) : active ? (
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span className="absolute h-5 w-5 animate-ping rounded-full bg-accent/20 motion-reduce:animate-none" />
                  <span className="relative h-2 w-2 rounded-full bg-accent" />
                </span>
              ) : (
                <span className="h-2 w-2 rounded-full border border-white/20" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-medium ${
                  complete || active ? "text-white" : "text-white/40"
                }`}
              >
                {complete ? stage.label : active ? stage.message : stage.label}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
