export function getCustomDate(date: Date) {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  return `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
}