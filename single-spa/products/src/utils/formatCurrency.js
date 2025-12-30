export function formatCurrency(value, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value ?? 0);
  } catch {
    return `$${Number(value ?? 0).toFixed(2)}`;
  }
}






