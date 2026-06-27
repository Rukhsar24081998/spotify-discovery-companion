import { Check } from "lucide-react";
import type { PipelineStage } from "@/lib/discoveryPipeline";

interface ProcessingPipelineProps {
  stages: PipelineStage[];
  activeIndex: number;
  completedCount: number;
}

/**
 * Seven-stage pipeline list for the AI processing screen.
 */
export function ProcessingPipeline({ stages, activeIndex, completedCount }: ProcessingPipelineProps) {
  return (
    <ol className="relative z-10 mt-8 space-y-3 rounded-xl border border-white/[0.06] bg-[#121212]/80 p-5 backdrop-blur-sm">
      {stages.map((stage, index) => {
        const complete = index < completedCount;
        const active = index === activeIndex && !complete && completedCount < stages.length;

        return (
          <li key={stage.id} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center"
            >
              {complete ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15">
                  <Check className="h-4 w-4 text-accent" />
                </span>
              ) : active ? (
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <span className="absolute h-6 w-6 animate-ping rounded-full bg-accent/20 motion-reduce:animate-none" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
              ) : (
                <span className="h-2.5 w-2.5 rounded-full border border-white/20" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-medium ${
                  complete || active ? "text-white" : "text-white/40"
                }`}
              >
                {stage.label}
              </p>
              {active && (
                <p className="mt-0.5 text-xs text-white/50 motion-reduce:transition-none animate-fade-in">
                  {stage.message}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
