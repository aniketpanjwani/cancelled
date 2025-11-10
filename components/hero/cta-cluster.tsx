import Link from "next/link";

interface CTAClusterProps {
  canceledCount: string;
}

export function CTACluster({ canceledCount }: CTAClusterProps) {
  return (
    <div className="flex w-full flex-col items-center gap-8 text-white sm:flex-row sm:justify-start">
      <Link
        href="https://tiktok.com"
        target="_blank"
        rel="noreferrer"
        className="rounded-[12px] bg-black px-8 py-4 font-display text-2xl uppercase tracking-wide text-white shadow-card transition hover:bg-black/90"
      >
        Appeal Your Cancellation
      </Link>

      <div className="flex items-center gap-6 text-white">
        <span className="hidden h-16 w-px bg-white/50 sm:block" aria-hidden />
        <div className="flex flex-col items-center text-sm uppercase tracking-[0.2em] text-white/70">
          <span className="font-display text-lg text-white">
            {canceledCount}
          </span>
          <span>people canceled</span>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {canceledCount} people canceled
      </div>
    </div>
  );
}
