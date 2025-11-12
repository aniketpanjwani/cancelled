"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface CTAClusterProps {
  canceledCount: string;
}

const PRIMARY_CTA_HREF = "https://canceledco.com";
const SECONDARY_CTA_HREF = "https://canceled.canceledco.com";

export function CTACluster({ canceledCount }: CTAClusterProps) {
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(
      () => setCopyState("idle"),
      copyState === "success" ? 2500 : 2000,
    );

    return () => window.clearTimeout(timer);
  }, [copyState]);

  const handleCopy = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(SECONDARY_CTA_HREF);
      } else if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = SECONDARY_CTA_HREF;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopyState("success");
    } catch (error) {
      console.error("Failed to copy Cancel Someone link", error);
      setCopyState("error");
    }
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-8 text-white">
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-start sm:gap-8">
        <Link
          href={PRIMARY_CTA_HREF}
          target="_blank"
          rel="noreferrer"
          className="rounded-[12px] bg-black px-8 py-4 font-display text-2xl uppercase tracking-wide text-white shadow-card transition hover:bg-black/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-[1px]"
        >
          Appeal Your Cancellation
        </Link>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-[12px] bg-white px-6 py-4 font-display text-xl uppercase tracking-wide text-black transition-colors hover:bg-[#DDDDDD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black active:bg-[#DDDDDD]"
          aria-label="Copy the Cancel Someone link"
        >
          {copyState === "success"
            ? "Copied"
            : copyState === "error"
              ? "Try Again"
              : "Cancel Someone"}
        </button>
      </div>

      <div className="flex flex-col items-center text-center text-sm uppercase tracking-[0.2em] text-white/70">
        <span className="font-display text-lg text-white">{canceledCount}</span>
        <span>people canceled</span>
      </div>

      <div className="sr-only" aria-live="polite">
        {copyState === "success"
          ? "Link copied. Cancel someone URL is ready to share."
          : copyState === "error"
            ? "Unable to copy the Cancel Someone link."
            : `${canceledCount} people canceled`}
      </div>
    </div>
  );
}
