import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calucalateNextTransactionDate = (
  date: Date,
  reccuringType: string | null,
): Date => {
  switch (reccuringType) {
    case "DAILY":
      return new Date(date.setDate(date.getDate() + 1));
    case "WEEKLY":
      return new Date(date.setDate(date.getDate() + 7));
    case "MONTHLY":
      return new Date(date.setMonth(date.getMonth() + 1));
    default:
      return date;
  }
};
