const REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/all?fields=name';

interface RestCountryEntry {
  name: {
    common: string;
  };
}

let cachedNames: string[] | null = null;
let fetchPromise: Promise<string[]> | null = null;

function sortCountryNames(names: string[]): string[] {
  const sorted = [...names].sort((a, b) => a.localeCompare(b, 'en'));
  const mongoliaIndex = sorted.indexOf('Mongolia');
  if (mongoliaIndex > 0) {
    sorted.splice(mongoliaIndex, 1);
    sorted.unshift('Mongolia');
  }
  return sorted;
}

export async function fetchCountryNames(): Promise<string[]> {
  if (cachedNames) return cachedNames;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch(REST_COUNTRIES_URL)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch countries');
      return res.json() as Promise<RestCountryEntry[]>;
    })
    .then((data) => {
      const names = sortCountryNames(data.map((entry) => entry.name.common));
      cachedNames = names;
      return names;
    })
    .catch(() => {
      fetchPromise = null;
      return ['Mongolia'];
    });

  return fetchPromise;
}
