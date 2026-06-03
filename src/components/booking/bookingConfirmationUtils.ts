export function formatConfirmationDate(d: string): string {
  if (!d) return '';
  const date = new Date(d + 'T12:00:00');
  const wk = ['Ня', 'Да', 'Мя', 'Лха', 'Пү', 'Ба', 'Бя'][date.getDay()];
  const ymd = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  return `${ymd}, ${wk}`;
}

export function cutoffDateBeforeCheckIn(checkIn: string, daysBefore: number): string {
  if (!checkIn) return `${daysBefore} хоногийн өмнө`;
  const d = new Date(checkIn + 'T12:00:00');
  d.setDate(d.getDate() - daysBefore);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
