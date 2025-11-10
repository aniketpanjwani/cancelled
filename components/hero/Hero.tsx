import Image from "next/image";
import { Reason } from "@/lib/reasons";
import { CTACluster } from "./cta-cluster";
import { GlitchStamp } from "./glitch-stamp";
import { ReasonTypewriter } from "./reason-typewriter";

const HERO_BG_SRC = "/assets/hero/ragebait-hero.png";
const NAV_STRIP_SRC = "/assets/hero/nav-strip.png";

interface HeroProps {
  reason: Reason;
  canceledCount: string;
}

export function Hero({ reason, canceledCount }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-accent text-white">
      <Image
        src={HERO_BG_SRC}
        alt="Textured red wall"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none -z-20 object-cover"
      />

      <div className="absolute left-1/2 top-0 w-[1440px] max-w-[95vw] -translate-x-1/2 opacity-90">
        <Image
          src={NAV_STRIP_SRC}
          alt="Navigation strip"
          width={1496}
          height={112}
          className="h-auto w-full"
          priority
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col gap-12 px-6 py-24 sm:px-12 lg:grid lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col items-center gap-10 text-center text-black lg:items-center">
          <p className="font-display text-4xl uppercase tracking-[0.35em] text-black">
            You’ve been
          </p>
          <GlitchStamp />
        </div>

        <div className="flex flex-col items-center gap-10">
          <ReasonTypewriter reason={reason} />
          <CTACluster canceledCount={canceledCount} />
        </div>
      </div>
    </section>
  );
}
