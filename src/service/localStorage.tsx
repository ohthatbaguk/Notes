function saveToLocalStorage(key: string, values: object) {
  localStorage.setItem(key, JSON.stringify(values));
}

function getFromLocalStorage(key: string) {
  const reference = localStorage.getItem(key);
  if (!reference) return [];
  return JSON.parse(reference);
}

export { saveToLocalStorage, getFromLocalStorage };
