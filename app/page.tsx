import { Hero } from "@/components/hero";
import { getComputedCanceledCount } from "@/lib/canceled-count";
import { getRandomReason } from "@/lib/reasons";

export const dynamic = "force-dynamic";

export default function Home() {
  const reason = getRandomReason();
  const canceledCount = getComputedCanceledCount();

  return (
    <main className="relative min-h-screen">
      <Hero reason={reason} canceledCount={canceledCount} showNav={false} />
    </main>
  );
}
