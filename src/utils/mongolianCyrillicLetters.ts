/** Mongolian Cyrillic alphabet (35 letters) used in citizen registration prefixes */
export const MONGOLIAN_CYRILLIC_LETTERS = [
  'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'Ө',
  'П', 'Р', 'С', 'Т', 'У', 'Ү', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я',
] as const;

export function isMongolianCyrillicLetter(value: string): boolean {
  return MONGOLIAN_CYRILLIC_LETTERS.includes(value as (typeof MONGOLIAN_CYRILLIC_LETTERS)[number]);
}
