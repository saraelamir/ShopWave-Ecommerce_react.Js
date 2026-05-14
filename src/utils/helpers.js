export const generateId = (prefix = '') =>
  `${prefix}${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const slugify = (text) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const truncate = (str, length = 80) =>
  str.length > length ? `${str.slice(0, length)}...` : str;

export const discountPercent = (original, current) =>
  Math.round(((original - current) / original) * 100);
