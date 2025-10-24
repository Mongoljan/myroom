// Mongolian Cyrillic to Latin transliteration mappings
const cyrillicToLatin: Record<string, string> = {
  'а': 'a', 'А': 'A',
  'б': 'b', 'Б': 'B',
  'в': 'v', 'В': 'V',
  'г': 'g', 'Г': 'G',
  'д': 'd', 'Д': 'D',
  'е': 'e', 'Е': 'E',
  'ё': 'yo', 'Ё': 'Yo',
  'ж': 'j', 'Ж': 'J',
  'з': 'z', 'З': 'Z',
  'и': 'i', 'И': 'I',
  'й': 'i', 'Й': 'I',
  'к': 'k', 'К': 'K',
  'л': 'l', 'Л': 'L',
  'м': 'm', 'М': 'M',
  'н': 'n', 'Н': 'N',
  'о': 'o', 'О': 'O',
  'ө': 'o', 'Ө': 'O',
  'п': 'p', 'П': 'P',
  'р': 'r', 'Р': 'R',
  'с': 's', 'С': 'S',
  'т': 't', 'Т': 'T',
  'у': 'u', 'У': 'U',
  'ү': 'u', 'Ү': 'U',
  'ф': 'f', 'Ф': 'F',
  'х': 'h', 'Х': 'H',
  'ц': 'ts', 'Ц': 'Ts',
  'ч': 'ch', 'Ч': 'Ch',
  'ш': 'sh', 'Ш': 'Sh',
  'щ': 'shch', 'Щ': 'Shch',
  'ъ': '', 'Ъ': '',
  'ы': 'y', 'Ы': 'Y',
  'ь': '', 'Ь': '',
  'э': 'e', 'Э': 'E',
  'ю': 'yu', 'Ю': 'Yu',
  'я': 'ya', 'Я': 'Ya'
};

// Latin to Mongolian Cyrillic transliteration mappings
const latinToCyrillic: Record<string, string[]> = {
  'a': ['а', 'А'], 'A': ['а', 'А'],
  'b': ['б', 'Б'], 'B': ['б', 'Б'],
  'v': ['в', 'В'], 'V': ['в', 'В'],
  'g': ['г', 'Г'], 'G': ['г', 'Г'],
  'd': ['д', 'Д'], 'D': ['д', 'Д'],
  'e': ['е', 'э', 'Е', 'Э'], 'E': ['е', 'э', 'Е', 'Э'],
  'yo': ['ё', 'Ё'], 'Yo': ['ё', 'Ё'],
  'j': ['ж', 'Ж'], 'J': ['ж', 'Ж'],
  'z': ['з', 'З'], 'Z': ['з', 'З'],
  'i': ['и', 'й', 'И', 'Й'], 'I': ['и', 'й', 'И', 'Й'],
  'k': ['к', 'К'], 'K': ['к', 'К'],
  'l': ['л', 'Л'], 'L': ['л', 'Л'],
  'm': ['м', 'М'], 'M': ['м', 'М'],
  'n': ['н', 'Н'], 'N': ['н', 'Н'],
  'o': ['о', 'ө', 'О', 'Ө'], 'O': ['о', 'ө', 'О', 'Ө'],
  'p': ['п', 'П'], 'P': ['п', 'П'],
  'r': ['р', 'Р'], 'R': ['р', 'Р'],
  's': ['с', 'С'], 'S': ['с', 'С'],
  't': ['т', 'Т'], 'T': ['т', 'Т'],
  'u': ['у', 'ү', 'У', 'Ү'], 'U': ['у', 'ү', 'У', 'Ү'],
  'f': ['ф', 'Ф'], 'F': ['ф', 'Ф'],
  'h': ['х', 'Х'], 'H': ['х', 'Х'],
  'ts': ['ц', 'Ц'], 'Ts': ['ц', 'Ц'],
  'ch': ['ч', 'Ч'], 'Ch': ['ч', 'Ч'],
  'sh': ['ш', 'Ш'], 'Sh': ['ш', 'Ш'],
  'shch': ['щ', 'Щ'], 'Shch': ['щ', 'Щ'],
  'y': ['ы', 'Ы'], 'Y': ['ы', 'Ы'],
  'yu': ['ю', 'Ю'], 'Yu': ['ю', 'Ю'],
  'ya': ['я', 'Я'], 'Ya': ['я', 'Я']
};

/**
 * Convert Cyrillic text to Latin
 */
export function cyrillicToLatinTransliteration(text: string): string {
  return text.split('').map(char => cyrillicToLatin[char] || char).join('');
}

/**
 * Convert Latin text to Cyrillic (returns first match)
 */
export function latinToCyrillicTransliteration(text: string): string {
  let result = text;
  
  // Handle multi-character combinations first (longer matches first)
  const sortedKeys = Object.keys(latinToCyrillic).sort((a, b) => b.length - a.length);
  
  for (const latin of sortedKeys) {
    const cyrillic = latinToCyrillic[latin];
    if (cyrillic && cyrillic.length > 0) {
      const regex = new RegExp(latin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      result = result.replace(regex, cyrillic[0]);
    }
  }
  
  return result;
}

/**
 * Check if text contains Cyrillic characters
 */
export function hasCyrillic(text: string): boolean {
  return /[\u0400-\u04FF]/.test(text);
}

/**
 * Check if text contains Latin characters
 */
export function hasLatin(text: string): boolean {
  return /[a-zA-Z]/.test(text);
}

/**
 * Generate search variations of a query for better matching
 * Returns array of possible transliterations
 */
export function generateSearchVariations(query: string): string[] {
  const variations: string[] = [query.toLowerCase()];
  
  if (hasCyrillic(query)) {
    // If input is Cyrillic, add Latin transliteration
    const latinVersion = cyrillicToLatinTransliteration(query);
    variations.push(latinVersion.toLowerCase());
  }
  
  if (hasLatin(query)) {
    // If input is Latin, add Cyrillic transliteration
    const cyrillicVersion = latinToCyrillicTransliteration(query);
    variations.push(cyrillicVersion.toLowerCase());
  }
  
  return [...new Set(variations)]; // Remove duplicates
}

/**
 * Enhanced search matching that considers transliteration
 */
export function matchesWithTransliteration(searchText: string, targetText: string): boolean {
  const searchVariations = generateSearchVariations(searchText);
  const targetLower = targetText.toLowerCase();
  
  return searchVariations.some(variation => 
    targetLower.includes(variation) || 
    targetLower.includes(variation.replace(/\s+/g, '')) // Match without spaces too
  );
}

/**
 * Score search relevance with transliteration support
 * Enhanced to handle partial matches for hotel names
 */
export function getSearchScore(searchText: string, targetText: string): number {
  const searchVariations = generateSearchVariations(searchText);
  const targetLower = targetText.toLowerCase();
  let bestScore = 0;

  for (const variation of searchVariations) {
    const variationLower = variation.toLowerCase();

    if (targetLower === variationLower) {
      bestScore = Math.max(bestScore, 100); // Exact match
    } else if (targetLower.startsWith(variationLower)) {
      bestScore = Math.max(bestScore, 90); // Starts with
    } else if (targetLower.includes(variationLower)) {
      bestScore = Math.max(bestScore, 70); // Contains
    } else {
      // Check word boundaries
      const words = targetLower.split(/\s+/);
      for (const word of words) {
        if (word.startsWith(variationLower)) {
          bestScore = Math.max(bestScore, 60); // Word starts with
        } else if (word.includes(variationLower)) {
          bestScore = Math.max(bestScore, 40); // Word contains
        }
      }
    }

    // NEW: Also check if target (when transliterated) contains the search query
    // This helps match Cyrillic hotel names when searching with Latin
    if (hasCyrillic(targetText)) {
      const targetTransliterated = cyrillicToLatinTransliteration(targetText).toLowerCase();

      if (targetTransliterated === variationLower) {
        bestScore = Math.max(bestScore, 100);
      } else if (targetTransliterated.startsWith(variationLower)) {
        bestScore = Math.max(bestScore, 90);
      } else if (targetTransliterated.includes(variationLower)) {
        bestScore = Math.max(bestScore, 70);
      } else {
        // Check word boundaries in transliterated target
        const transliteratedWords = targetTransliterated.split(/\s+/);
        for (const word of transliteratedWords) {
          if (word.startsWith(variationLower)) {
            bestScore = Math.max(bestScore, 60);
          } else if (word.includes(variationLower)) {
            bestScore = Math.max(bestScore, 40);
          }
        }
      }
    }
  }

  return bestScore;
}