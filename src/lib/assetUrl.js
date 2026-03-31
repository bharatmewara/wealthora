export function assetUrl(value) {
  if (!value) return value;
  if (typeof value !== 'string') return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('data:')) return value;

  const base = import.meta.env.VITE_API_BASE_URL || '';
  if (!base) return value;

  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return value.startsWith('/') ? `${normalizedBase}${value}` : `${normalizedBase}/${value}`;
}

