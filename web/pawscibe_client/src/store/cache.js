// src/utils/localStorageUtils.js

export const setWithExpiry = (key, value, ttl) => {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = key => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    console.log('mannnnn');
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

export const clearAllWithPrefix = prefix => {
  if (prefix === 'all') localStorage.clear();
  else
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
};
