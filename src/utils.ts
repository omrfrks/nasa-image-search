export const currentYear = new Date().getFullYear();

export function generateYearsBetween(startYear = 1900, endYear = currentYear) {
  let years = [];
  for (var i = startYear; i <= endYear; i++) {
    years.push(startYear);
    startYear++;
  }
  return years;
}