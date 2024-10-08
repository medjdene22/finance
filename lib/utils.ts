import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountToMili(amount: number) {
  return Math.round(amount*1000)
}

export function convertAmountFromMili(amount: number) {
  return Math.round(amount/1000)
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 2,
  }).format(value)
}