import { Logo } from "@/components/logo";

type Appearance = "dark" | "light";

interface SiteNavProps {
  appearance?: Appearance;
  className?: string;
}

export function SiteNav({ appearance = "dark", className = "" }: SiteNavProps) {
  const isDark = appearance === "dark";
  const logoVariant = isDark ? "white" : "black";
  const textColor = isDark ? "text-white" : "text-black";
  const bgColor = isDark ? "bg-black/90" : "bg-white/95";
  const buttonClass = isDark
    ? "border-white/30 text-white"
    : "border-black/40 text-black";

  return (
    <header
      className={`flex w-full items-center justify-between px-6 py-4 sm:px-12 ${bgColor} ${textColor} ${className}`.trim()}
    >
      <div className="w-40 sm:w-48">
        <Logo variant={logoVariant} priority={isDark} className="w-full" />
      </div>
      <button
        type="button"
        className={`rounded-full border px-4 py-2 text-[0.65rem] font-display uppercase tracking-[0.35em] transition hover:border-accent-bright ${buttonClass}`.trim()}
        aria-label="Open menu"
      >
        Menu
      </button>
    </header>
  );
}
