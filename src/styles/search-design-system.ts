// Search Page Design System Standards

export const SEARCH_DESIGN_SYSTEM = {
  // Typography Hierarchy
  TYPOGRAPHY: {
    // Hotel Name/Title
    HOTEL_NAME: 'text-lg font-semibold text-gray-900',
    HOTEL_NAME_SMALL: 'text-base font-semibold text-gray-900',

    // Descriptions
    DESCRIPTION: 'text-sm text-gray-600',
    DESCRIPTION_SMALL: 'text-xs text-gray-600',

    // Prices
    PRICE_PRIMARY: 'text-xl font-bold text-gray-900',
    PRICE_SECONDARY: 'text-lg font-semibold text-gray-900',
    PRICE_SMALL: 'text-sm font-semibold text-gray-900',

    // Labels
    LABEL: 'text-xs font-medium text-gray-700',
    LABEL_MUTED: 'text-xs text-gray-500',

    // Links
    LINK: 'text-xs text-blue-600 hover:text-blue-800',

    // Button Text
    BUTTON_TEXT: 'text-sm font-medium',
    BUTTON_TEXT_SMALL: 'text-xs font-medium',
  },

  // Color Palette
  COLORS: {
    // Backgrounds
    BG_WHITE: 'bg-white',
    BG_GRAY_LIGHT: 'bg-gray-50',
    BG_BLUE_LIGHT: 'bg-blue-50',
    BG_GREEN_LIGHT: 'bg-green-50',
    BG_RED_LIGHT: 'bg-red-50',

    // Text Colors
    TEXT_PRIMARY: 'text-gray-900',
    TEXT_SECONDARY: 'text-gray-600',
    TEXT_MUTED: 'text-gray-500',
    TEXT_BLUE: 'text-blue-600',
    TEXT_GREEN: 'text-green-600',
    TEXT_RED: 'text-red-600',

    // Borders
    BORDER_DEFAULT: 'border-gray-200',
    BORDER_HOVER: 'border-gray-300',
    BORDER_FOCUS: 'border-blue-500',
  },

  // Border Radius Standards
  RADIUS: {
    SMALL: 'rounded-md',      // 6px - badges, small elements
    DEFAULT: 'rounded-lg',    // 8px - cards, buttons
    LARGE: 'rounded-xl',      // 12px - main cards
    FULL: 'rounded-full',     // pills, avatars
  },

  // Spacing Standards
  SPACING: {
    CARD_PADDING: 'p-4',
    CARD_PADDING_SMALL: 'p-3',
    SECTION_GAP: 'gap-4',
    ITEM_GAP: 'gap-2',
    ITEM_GAP_SMALL: 'gap-1',
  },

  // Room Type Icons
  ROOM_ICONS: {
    // Based on room capacity and type
    SINGLE: '👤',      // 1 person
    DOUBLE: '👥',      // 2 people
    FAMILY: '👨‍👩‍👧‍👦',    // Family
    SUITE: '🏨',       // Suite/luxury
    APARTMENT: '🏠',   // Apartment style
  },

  // Bed Type Icons
  BED_ICONS: {
    SINGLE: '🛏️',      // Single bed
    DOUBLE: '🛏️🛏️',    // Double bed
    KING: '👑🛏️',     // King bed
    QUEEN: '♛🛏️',     // Queen bed
  },

  // Shadows
  SHADOWS: {
    SMALL: 'shadow-sm',
    DEFAULT: 'shadow-md',
    LARGE: 'shadow-lg',
    HOVER: 'hover:shadow-lg',
  },

  // Transitions
  TRANSITIONS: {
    DEFAULT: 'transition-all duration-200',
    SLOW: 'transition-all duration-300',
  }
} as const;

// Helper function to get room icon based on capacity
export function getRoomCapacityIcon(adultQty: number, childQty: number = 0): string {
  const total = adultQty + childQty;

  if (total <= 1) return SEARCH_DESIGN_SYSTEM.ROOM_ICONS.SINGLE;
  if (total <= 2) return SEARCH_DESIGN_SYSTEM.ROOM_ICONS.DOUBLE;
  if (total >= 4 || childQty > 0) return SEARCH_DESIGN_SYSTEM.ROOM_ICONS.FAMILY;
  return SEARCH_DESIGN_SYSTEM.ROOM_ICONS.DOUBLE;
}

// Helper function to get bed icon based on bed type
export function getBedTypeIcon(bedTypeName: string): string {
  const name = bedTypeName.toLowerCase();

  if (name.includes('king')) return SEARCH_DESIGN_SYSTEM.BED_ICONS.KING;
  if (name.includes('queen')) return SEARCH_DESIGN_SYSTEM.BED_ICONS.QUEEN;
  if (name.includes('double') || name.includes('2 хүний')) return SEARCH_DESIGN_SYSTEM.BED_ICONS.DOUBLE;
  return SEARCH_DESIGN_SYSTEM.BED_ICONS.SINGLE;
}