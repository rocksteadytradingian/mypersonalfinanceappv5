import { countries } from 'countries-list';

export interface CountryData {
  code: string;
  name: string;
  currency: string;
  emoji: string;
}

export const getCountriesData = (): CountryData[] => {
  return Object.entries(countries)
    .map(([code, data]) => ({
      code,
      name: data.name,
      currency: data.currency,
      emoji: data.emoji,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getCurrencyForCountry = (countryCode: string): string => {
  const country = countries[countryCode as keyof typeof countries];
  return country ? country.currency : 'USD';
};

export const getCountryFromCurrency = (currency: string): string => {
  const countryEntry = Object.entries(countries).find(
    ([_, data]) => data.currency === currency
  );
  return countryEntry ? countryEntry[0] : 'US';
};

export const getCurrencySymbol = (currency: string): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'narrowSymbol',
    })
      .formatToParts(0)
      .find(part => part.type === 'currency')?.value || currency;
  } catch {
    return currency;
  }
};