import { Hero } from "@/components/hero";
import { getComputedCanceledCount } from "@/lib/canceled-count";

export default function Home() {
  const canceledCount = getComputedCanceledCount();

  return (
    <main className="relative min-h-screen">
      <Hero canceledCount={canceledCount} showNav={false} />
    </main>
  );
}
