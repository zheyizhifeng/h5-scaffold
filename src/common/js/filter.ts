export function format_thousand_sep(n) {
  if (typeof n === "string" || typeof n === "undefined") {
    if (!n) return "";
    n = parseInt(n, 10);
  }
  if (n < 1000) {
    return n;
  } else if (n >= 1000000) {
    return `${(n / 1000000).toFixed(1)}M`;
  } else {
    return `${(n / 1000).toFixed(1)}K`;
  }
}
