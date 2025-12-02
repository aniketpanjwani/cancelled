import Image from "next/image";
import { CTACluster } from "./cta-cluster";
import { GlitchStamp } from "./glitch-stamp";
import { ReasonTypewriter } from "./reason-typewriter";
import type { Reason } from "@/lib/reasons";

const HERO_BG_SRC = "/assets/hero/ragebait-hero.png";

interface HeroProps {
  canceledCount: string;
  initialReason: Reason | null;
  showNav?: boolean;
}

export function Hero({ canceledCount, initialReason }: HeroProps) {
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

      {/* <div className="absolute inset-x-0 top-0">
        <SiteNav appearance="dark" />
      </div> */}

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col gap-12 px-6 py-24 sm:px-12 lg:grid lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col items-center gap-10 text-center text-black lg:items-center">
          <p className="font-display text-4xl uppercase tracking-[0.35em] text-black">
            You’ve been
          </p>
          <GlitchStamp />
        </div>

        <div className="flex flex-col items-center gap-10">
          <ReasonTypewriter initialReason={initialReason} />
          <CTACluster canceledCount={canceledCount} />
        </div>
      </div>
    </section>
  );
}
