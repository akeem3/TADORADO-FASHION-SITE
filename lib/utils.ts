import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  // Handle both number and string inputs (Prisma Decimal comes as string)
  const numPrice =
    typeof price === "string" ? parseFloat(price) : Number(price);
  if (isNaN(numPrice) || numPrice === 0) return "0";

  return numPrice.toLocaleString("en-US");
}
