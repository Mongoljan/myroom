const STORAGE_KEY = 'myroom_profile_extras';

export interface ProfileExtras {
  nationality?: string;
  invoice_individual?: string;
  invoice_business_prefix1?: string;
  invoice_business_prefix2?: string;
  invoice_business_number?: string;
  invoice_business_name?: string;
  invoice_organization?: string;
  invoice_organization_name?: string;
}

type StoredProfileExtras = Record<string, ProfileExtras>;

function readAll(): StoredProfileExtras {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredProfileExtras;
  } catch {
    return {};
  }
}

function writeAll(data: StoredProfileExtras): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota / private mode
  }
}

export function getProfileExtras(userId: number): ProfileExtras | null {
  const all = readAll();
  return all[String(userId)] ?? null;
}

export function saveProfileExtras(userId: number, extras: ProfileExtras): void {
  const all = readAll();
  all[String(userId)] = extras;
  writeAll(all);
}
