import { NextResponse, type NextRequest } from "next/server";
import reasonsData from "./content/reasons.json";

const REASON_COOKIE_NAME = "cancelled_reason_index";
const REASON_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const reasons = reasonsData.reasons ?? [];

  if (reasons.length === 0) {
    return response;
  }

  const storedValue = request.cookies.get(REASON_COOKIE_NAME)?.value;
  let reasonIndex = Number.parseInt(storedValue ?? "", 10);

  const hasValidStoredIndex =
    Number.isInteger(reasonIndex) && reasonIndex >= 0 && reasonIndex < reasons.length;

  if (hasValidStoredIndex) {
    return response;
  }

  reasonIndex = Math.floor(Math.random() * reasons.length);

  response.cookies.set({
    name: REASON_COOKIE_NAME,
    value: String(reasonIndex),
    maxAge: REASON_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/"],
};
