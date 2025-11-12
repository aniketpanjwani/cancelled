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
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(
      () => setCopyState("idle"),
      copyState === "success" ? 2500 : 2000,
    );

    return () => window.clearTimeout(timer);
  }, [copyState]);

  useEffect(() => {
    if (!toast.visible) return;
    const timer = window.setTimeout(
      () => setToast((prev) => ({ ...prev, visible: false })),
      2400,
    );

    return () => window.clearTimeout(timer);
  }, [toast.visible]);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
  }, []);

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
      showToast("Link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy Cancel Someone link", error);
      setCopyState("error");
      showToast("Unable to copy link. Try again.");
    }
  }, [showToast]);

  return (
    <div className="flex w-full flex-col items-center gap-8 text-white">
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-start sm:gap-8">
        <Link
          href={PRIMARY_CTA_HREF}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center rounded-[12px] bg-black px-8 py-4 font-display text-2xl uppercase tracking-wide text-white shadow-card transition hover:bg-[#500100] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-[1px] sm:flex-1"
        >
          Appeal Your Cancellation
        </Link>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex w-full items-center justify-center rounded-[12px] bg-white px-6 py-4 font-display text-2xl uppercase tracking-wide text-black transition-colors hover:bg-[#DDDDDD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black active:bg-[#DDDDDD] sm:flex-1"
          aria-label="Copy the Cancel Someone link"
        >
          Cancel Someone
        </button>
      </div>

      <div className="text-center font-display text-2xl uppercase tracking-wide text-white">
        {canceledCount} people canceled
      </div>

      <div className="sr-only" aria-live="polite">
        {toast.visible ? toast.message : `${canceledCount} people canceled`}
      </div>

      {toast.message ? (
        <div
          aria-live="polite"
          className={`pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transform rounded-full border border-white/20 bg-black px-6 py-3 font-display text-base uppercase tracking-wide text-white shadow-card transition-all duration-300 ${
            toast.visible ? "opacity-100 translate-y-0" : "translate-y-4 opacity-0"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
