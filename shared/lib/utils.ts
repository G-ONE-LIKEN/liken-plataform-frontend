import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCompactAddress(address?: string | null) {
  if (!address) return "Sin conectar";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatCurrency(value?: string | number | null, currency = "USD") {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatPercent(value?: string | number | null) {
  const amount = Number(value ?? 0);
  return `${amount.toFixed(2)}%`;
}

export function formatDate(value?: string | null) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
