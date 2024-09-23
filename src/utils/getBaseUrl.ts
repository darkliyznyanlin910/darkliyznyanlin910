import { env } from "@/env";

export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) {
    if (env.NEXT_PUBLIC_NODE_ENV == "production") {
      return `https://johnnyknl.me`;
    } else {
      return `https://${process.env.VERCEL_URL}`;
    }
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}
