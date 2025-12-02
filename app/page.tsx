import { cookies } from "next/headers";
import { Hero } from "@/components/hero";
import { getComputedCanceledCount } from "@/lib/canceled-count";
import { getAllReasons, type Reason } from "@/lib/reasons";

const REASON_COOKIE_NAME = "cancelled_reason_index";

export const dynamic = "force-dynamic";

async function resolveInitialReason(): Promise<Reason | null> {
  const reasons = getAllReasons();
  if (reasons.length === 0) {
    return null;
  }

  const cookieStore = await cookies();
  const storedValue = cookieStore.get(REASON_COOKIE_NAME)?.value;
  let reasonIndex = Number.parseInt(storedValue ?? "", 10);

  const hasValidStoredIndex =
    Number.isInteger(reasonIndex) && reasonIndex >= 0 && reasonIndex < reasons.length;

  if (!hasValidStoredIndex) {
    reasonIndex = Math.floor(Math.random() * reasons.length);
  }

  return reasons[reasonIndex];
}

export default async function Home() {
  const canceledCount = getComputedCanceledCount();
  const initialReason = await resolveInitialReason();

  return (
    <main className="relative min-h-screen">
      <Hero canceledCount={canceledCount} initialReason={initialReason} showNav={false} />
    </main>
  );
}
