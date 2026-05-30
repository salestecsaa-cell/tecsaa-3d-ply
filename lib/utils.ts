export function formatPrice(price: number | null | undefined): string {
  if (!price) return "Price on request";
  if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(1)}Cr`;
  if (price >= 100_000) return `₹${(price / 100_000).toFixed(1)}L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
