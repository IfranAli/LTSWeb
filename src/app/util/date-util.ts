export const dateToString = function (date: Date, separator = '/'): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');

  return y + separator + m + separator + d;
};

export function getCurrentDate(separator = '-'): string {
  return dateToString(new Date(), separator);
}
