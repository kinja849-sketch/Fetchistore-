/**
 * Fetchistore Regional Currency & Formatting Utilities
 * Automatically maps country codes (e.g. ID, US, NG, GB, JP) to currency codes and symbols.
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  prefix: boolean;
}

export const CURRENCY_MAP: Record<string, CurrencyConfig> = {
  ID: { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", prefix: true },
  US: { code: "USD", symbol: "$", name: "US Dollar", prefix: true },
  NG: { code: "NGN", symbol: "₦", name: "Nigerian Naira", prefix: true },
  GB: { code: "GBP", symbol: "£", name: "British Pound", prefix: true },
  EU: { code: "EUR", symbol: "€", name: "Euro", prefix: true },
  DE: { code: "EUR", symbol: "€", name: "Euro", prefix: true },
  FR: { code: "EUR", symbol: "€", name: "Euro", prefix: true },
  NL: { code: "EUR", symbol: "€", name: "Euro", prefix: true },
  ES: { code: "EUR", symbol: "€", name: "Euro", prefix: true },
  IT: { code: "EUR", symbol: "€", name: "Euro", prefix: true },
  JP: { code: "JPY", symbol: "¥", name: "Japanese Yen", prefix: true },
  CA: { code: "CAD", symbol: "CA$", name: "Canadian Dollar", prefix: true },
  AU: { code: "AUD", symbol: "A$", name: "Australian Dollar", prefix: true },
  IN: { code: "INR", symbol: "₹", name: "Indian Rupee", prefix: true },
  SG: { code: "SGD", symbol: "S$", name: "Singapore Dollar", prefix: true },
  MY: { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", prefix: true },
  PH: { code: "PHP", symbol: "₱", name: "Philippine Peso", prefix: true },
  BR: { code: "BRL", symbol: "R$", name: "Brazilian Real", prefix: true },
  ZA: { code: "ZAR", symbol: "R", name: "South African Rand", prefix: true },
  KE: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", prefix: true },
};

export const DEFAULT_CURRENCY: CurrencyConfig = {
  code: "USD",
  symbol: "$",
  name: "US Dollar",
  prefix: true,
};

/**
 * Gets currency configuration for a given 2-letter ISO country code.
 */
export function getCurrencyForCountry(countryCode?: string | null): CurrencyConfig {
  if (!countryCode) return DEFAULT_CURRENCY;
  const upper = countryCode.toUpperCase().trim();
  return CURRENCY_MAP[upper] || DEFAULT_CURRENCY;
}

/**
 * Formats a numerical price with currency symbol.
 */
export function formatPrice(amount: number, currencyConfig?: CurrencyConfig | string | null): string {
  let config: CurrencyConfig = DEFAULT_CURRENCY;

  if (typeof currencyConfig === "string") {
    config = getCurrencyForCountry(currencyConfig);
  } else if (currencyConfig && typeof currencyConfig === "object") {
    config = currencyConfig;
  }

  const formattedNum = Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: config.code === "IDR" || config.code === "JPY" ? 0 : 2,
    maximumFractionDigits: config.code === "IDR" || config.code === "JPY" ? 0 : 2,
  });

  return config.prefix ? `${config.symbol}${formattedNum}` : `${formattedNum} ${config.symbol}`;
}
