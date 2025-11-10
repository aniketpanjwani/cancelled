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

  return (
    <header
      className={`flex w-full items-center justify-center px-6 py-4 sm:px-12 ${bgColor} ${textColor} ${className}`.trim()}
    >
      <div className="w-28 sm:w-36">
        <Logo variant={logoVariant} priority={isDark} className="mx-auto w-full" />
      </div>
    </header>
  );
}
