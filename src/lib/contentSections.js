export function normalizeSectionData(value) {
  if (!value) return {};
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  return typeof value === 'object' && !Array.isArray(value) ? value : {};
}

export function normalizeContentSection(section) {
  if (!section || typeof section !== 'object') return section;
  return {
    ...section,
    data: normalizeSectionData(section.data)
  };
}
