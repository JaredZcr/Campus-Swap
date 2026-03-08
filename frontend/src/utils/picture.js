// pictureList can be either:
// 1) a JSON string: ["url1","url2"]
// 2) a single URL string: "http://..."
// 3) a comma-separated string (legacy)

export function getPictureUrls(pictureList) {
  if (!pictureList) return [];

  const trimmed = String(pictureList).trim();

  // JSON array string
  if (trimmed.startsWith('[')) {
    try {
      const arr = JSON.parse(trimmed);
      if (Array.isArray(arr)) {
        return arr.filter(Boolean).map(String);
      }
    } catch {
      // fall through
    }
  }

  // Comma-separated fallback
  if (trimmed.includes(',')) {
    return trimmed
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.replace(/^[\[\]"]+/, '').replace(/[\[\]"]+$/, ''));
  }

  // Single URL
  return [trimmed.replace(/^[\[\]"]+/, '').replace(/[\[\]"]+$/, '')];
}

export function getFirstPictureUrl(pictureList) {
  return getPictureUrls(pictureList)[0] || '';
}
