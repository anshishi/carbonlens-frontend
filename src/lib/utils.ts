import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes safely using clsx and tailwind-merge.
 * @param inputs - List of class names, arrays, or objects
 * @returns Combined class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
