export const removeExtraSlashes = (path: string) => {
  return path.replace(/\/{2,}/g, '/').replace(/\\{2,}/g, '\\');
};
