/**
 * Format number to compact notation (e.g., 1000 -> 1k, 1000000 -> 1M)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`.replace('.0', '');
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`.replace('.0', '');
  }
  return num.toString();
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Generate slug from title
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
