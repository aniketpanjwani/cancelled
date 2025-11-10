import Image from "next/image";

type LogoVariant = "black" | "blackOutline" | "white";

const LOGO_MAP: Record<LogoVariant, { src: string; width: number; height: number; alt: string }> = {
  black: {
    src: "/assets/logo/logo-textured-black-wordmark.png",
    width: 700,
    height: 332,
    alt: "Canceled Co logo black wordmark",
  },
  blackOutline: {
    src: "/assets/logo/logo-textured-black-white-outline.png",
    width: 700,
    height: 325,
    alt: "Canceled Co logo black wordmark with white outline",
  },
  white: {
    src: "/assets/logo/logo-textured-white.png",
    width: 700,
    height: 331,
    alt: "Canceled Co logo white",
  },
};

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
}

export function Logo({ variant = "black", className = "", priority = false }: LogoProps) {
  const data = LOGO_MAP[variant];

  return (
    <Image
      src={data.src}
      alt={data.alt}
      width={data.width}
      height={data.height}
      priority={priority}
      className={`h-auto w-full ${className}`.trim()}
    />
  );
}
