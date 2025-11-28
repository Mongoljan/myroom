import React from 'react';
import {
  Users,
  Wifi,
  Bath,
  Bed,
  Clock,
  WashingMachine,
  Tv,
  Wind,
  Phone,
  Shield,
  Sparkles,
  Volume2,
  Shirt,
  Droplets,
  TreePine,
  Armchair,
  Monitor,
  Utensils,
  Waves,
  Baby,
  Cigarette,
  Star,
  Home,
  Microwave,
  Refrigerator,
  Coffee,
  Wine,
  UtensilsCrossed,
  Zap,
  Mountain,
  Building2,
  Flower2,
  SprayCan,
  Scissors,
  Heater
} from 'lucide-react';

export class IconMappingService {
  
  // Room facilities icons - all 48 facilities from /api/all-data/
  static getRoomFacilityIcon(facilityId?: number, facilityName?: string): React.ReactNode {
    if (facilityId) {
      const iconMap: { [key: number]: React.ReactNode } = {
        1: <Wind className="w-3 h-3 text-green-600" />, // Air conditioning
        2: <Armchair className="w-3 h-3 text-green-600" />, // Clothes rack
        3: <WashingMachine className="w-3 h-3 text-green-600" />, // Washing machine
        4: <Tv className="w-3 h-3 text-green-600" />, // Flat-screen TV
        5: <Monitor className="w-3 h-3 text-green-600" />, // Desk
        6: <Microwave className="w-3 h-3 text-green-600" />, // Fireplace/Wall oven
        7: <Phone className="w-3 h-3 text-green-600" />, // Socket near the bed
        8: <Heater className="w-3 h-3 text-green-600" />, // Heating
        9: <Bath className="w-3 h-3 text-green-600" />, // Towels
        10: <Volume2 className="w-3 h-3 text-green-600" />, // Soundproofing
  11: <Armchair className="w-3 h-3 text-green-600" />, // Sofa (replaced)
        12: <Armchair className="w-3 h-3 text-green-600" />, // Sitting area
        13: <Cigarette className="w-3 h-3 text-green-600" />, // Smoking room
        14: <Bed className="w-3 h-3 text-green-600" />, // Extra beds available
        15: <Baby className="w-3 h-3 text-green-600" />, // Cribs available
        16: <Cigarette className="w-3 h-3 text-green-600" />, // Non-smoking rooms
        17: <Bath className="w-3 h-3 text-green-600" />, // Bathtub
        18: <TreePine className="w-3 h-3 text-green-600" />, // Garden / Yard
        19: <Bath className="w-3 h-3 text-green-600" />, // Smart toilet
        20: <Monitor className="w-3 h-3 text-green-600" />, // Computer
        21: <Users className="w-3 h-3 text-green-600" />, // Accessible rooms
        22: <Waves className="w-3 h-3 text-green-600" />, // Jacuzzi
        23: <Utensils className="w-3 h-3 text-green-600" />, // Card table
        24: <Waves className="w-3 h-3 text-green-600" />, // Private swimming pool
        25: <Armchair className="w-3 h-3 text-green-600" />, // Wardrobe or closet
        26: <Clock className="w-3 h-3 text-green-600" />, // Wake-up service
        27: <Bath className="w-3 h-3 text-green-600" />, // Towels / Sheets (extra fee)
        28: <Sparkles className="w-3 h-3 text-green-600" />, // Trash cans
        29: <Waves className="w-3 h-3 text-green-600" />, // Pool cover
        30: <Bath className="w-3 h-3 text-green-600" />, // Pool towels
        31: <WashingMachine className="w-3 h-3 text-green-600" />, // Tumble dryer
        32: <Home className="w-3 h-3 text-green-600" />, // Carpeted
        33: <Shirt className="w-3 h-3 text-green-600" />, // Dressing room
        34: <Bed className="w-3 h-3 text-green-600" />, // Extra long beds
        35: <Wind className="w-3 h-3 text-green-600" />, // Fan
        36: <Users className="w-3 h-3 text-green-600" />, // Interconnected rooms
        37: <Shirt className="w-3 h-3 text-green-600" />, // Iron
        38: <Shirt className="w-3 h-3 text-green-600" />, // Ironing facilities
        39: <Bath className="w-3 h-3 text-green-600" />, // Hot tub
        40: <Shield className="w-3 h-3 text-green-600" />, // Mosquito net
        41: <Home className="w-3 h-3 text-green-600" />, // Private entrance
        42: <Home className="w-3 h-3 text-green-600" />, // Tile / Marble floor
        43: <Home className="w-3 h-3 text-green-600" />, // Hardwood floors
        44: <Sparkles className="w-3 h-3 text-green-600" />, // Cleaning products
        45: <Phone className="w-3 h-3 text-green-600" />, // Adapter
        46: <Bed className="w-3 h-3 text-green-600" />, // Feather pillow
        47: <Bed className="w-3 h-3 text-green-600" />, // Non-feather pillow
        48: <Wifi className="w-3 h-3 text-green-600" />, // Wifi
      };
      
      if (iconMap[facilityId]) {
        return iconMap[facilityId];
      }
    }
    
    // Name-based fallback
    if (facilityName) {
      const nameLower = facilityName.toLowerCase();
      if (nameLower.includes('washing') || nameLower.includes('угаалгын машин')) return <WashingMachine className="w-3 h-3 text-green-600" />;
      if (nameLower.includes('tv') || nameLower.includes('телевиз')) return <Tv className="w-3 h-3 text-green-600" />;
      if (nameLower.includes('wifi') || nameLower.includes('интернэт')) return <Wifi className="w-3 h-3 text-green-600" />;
      if (nameLower.includes('air condition') || nameLower.includes('агааржуулагч')) return <Wind className="w-3 h-3 text-green-600" />;
      if (nameLower.includes('desk') || nameLower.includes('ширээ')) return <Monitor className="w-3 h-3 text-green-600" />;
    }
    
    return <Star className="w-3 h-3 text-green-600" />;
  }

  // Bathroom items icons - all 22 items from /api/all-data/
  static getBathroomItemIcon(itemId?: number, itemName?: string): React.ReactNode {
    if (itemId) {
      const iconMap: { [key: number]: React.ReactNode } = {
        1: <Sparkles className="w-3 h-3 text-blue-600" />, // Toilet paper
        2: <Droplets className="w-3 h-3 text-blue-600" />, // Shower
        4: <Wind className="w-3 h-3 text-blue-600" />, // Hairdryer
        5: <Bath className="w-3 h-3 text-blue-600" />, // Bath
        7: <Shirt className="w-3 h-3 text-blue-600" />, // Slippers
        8: <Shirt className="w-3 h-3 text-blue-600" />, // Bathrobe
        9: <Waves className="w-3 h-3 text-blue-600" />, // Spa bath
  14: <Sparkles className="w-3 h-3 text-blue-600" />, // Sauna (generic)
        17: <Bath className="w-3 h-3 text-blue-600" />, // Toilet
        18: <Bath className="w-3 h-3 text-blue-600" />, // Private bathroom
        19: <Users className="w-3 h-3 text-blue-600" />, // Shared bathroom
        20: <Bath className="w-3 h-3 text-blue-600" />, // Additional toilet
        21: <Users className="w-3 h-3 text-blue-600" />, // Shared toilet
        22: <Bath className="w-3 h-3 text-blue-600" />, // Additional bathroom
      };
      
      if (iconMap[itemId]) {
        return iconMap[itemId];
      }
    }
    
    if (itemName) {
      const nameLower = itemName.toLowerCase();
      if (nameLower.includes('shower') || nameLower.includes('шүршүүр')) return <Droplets className="w-3 h-3 text-blue-600" />;
      if (nameLower.includes('bath') || nameLower.includes('ванн')) return <Bath className="w-3 h-3 text-blue-600" />;
      if (nameLower.includes('hairdryer') || nameLower.includes('сэнс')) return <Wind className="w-3 h-3 text-blue-600" />;
    }
    
    return <Bath className="w-3 h-3 text-blue-600" />;
  }

  // Free toiletries icons - all 12 items from /api/all-data/
  static getFreeToiletriesIcon(itemId?: number, itemName?: string): React.ReactNode {
    if (itemId) {
      const iconMap: { [key: number]: React.ReactNode } = {
        3: <Sparkles className="w-3 h-3 text-purple-600" />, // Dental kit
        4: <Sparkles className="w-3 h-3 text-purple-600" />, // Soap
        5: <Droplets className="w-3 h-3 text-purple-600" />, // Shampoo
        6: <Droplets className="w-3 h-3 text-purple-600" />, // Conditioner
        7: <Droplets className="w-3 h-3 text-purple-600" />, // Shower gel
        8: <Scissors className="w-3 h-3 text-purple-600" />, // Comb
        9: <Scissors className="w-3 h-3 text-purple-600" />, // Shaving kit
        10: <Shield className="w-3 h-3 text-purple-600" />, // Shower cap
        11: <Flower2 className="w-3 h-3 text-purple-600" />, // Vanity kit
        12: <SprayCan className="w-3 h-3 text-purple-600" />, // Shower lotion
      };
      
      if (iconMap[itemId]) {
        return iconMap[itemId];
      }
    }
    
    if (itemName) {
      const nameLower = itemName.toLowerCase();
      if (nameLower.includes('soap') || nameLower.includes('саван')) return <Sparkles className="w-3 h-3 text-purple-600" />;
      if (nameLower.includes('shampoo') || nameLower.includes('шампунь')) return <Droplets className="w-3 h-3 text-purple-600" />;
    }
    
    return <Sparkles className="w-3 h-3 text-purple-600" />;
  }

  // Food and drink icons - all 13 items from /api/all-data/
  static getFoodAndDrinkIcon(itemId?: number, itemName?: string): React.ReactNode {
    if (itemId) {
      const iconMap: { [key: number]: React.ReactNode } = {
        3: <Zap className="w-3 h-3 text-orange-600" />, // Electric kettle
        5: <Microwave className="w-3 h-3 text-orange-600" />, // Microwave
        6: <Droplets className="w-3 h-3 text-orange-600" />, // Bottle of water
        7: <Coffee className="w-3 h-3 text-orange-600" />, // Chocolate or Cookies
        8: <TreePine className="w-3 h-3 text-orange-600" />, // Fruits
        9: <Wine className="w-3 h-3 text-orange-600" />, // Wine or Champagne
        10: <Refrigerator className="w-3 h-3 text-orange-600" />, // Minibar
        11: <UtensilsCrossed className="w-3 h-3 text-orange-600" />, // Kitchen
        12: <Refrigerator className="w-3 h-3 text-orange-600" />, // Refrigerator
        13: <Coffee className="w-3 h-3 text-orange-600" />, // Coffee machine
      };
      
      if (iconMap[itemId]) {
        return iconMap[itemId];
      }
    }
    
    if (itemName) {
      const nameLower = itemName.toLowerCase();
      if (nameLower.includes('coffee') || nameLower.includes('кофе')) return <Coffee className="w-3 h-3 text-orange-600" />;
      if (nameLower.includes('kettle') || nameLower.includes('буцалгагч')) return <Zap className="w-3 h-3 text-orange-600" />;
      if (nameLower.includes('water') || nameLower.includes('ус')) return <Droplets className="w-3 h-3 text-orange-600" />;
    }
    
    return <Utensils className="w-3 h-3 text-orange-600" />;
  }

  // Outdoor and view icons - all 7 items from /api/all-data/
  static getOutdoorAndViewIcon(itemId?: number, itemName?: string): React.ReactNode {
    if (itemId) {
      const iconMap: { [key: number]: React.ReactNode } = {
        3: <Home className="w-3 h-3 text-emerald-600" />, // Balcony
        4: <Home className="w-3 h-3 text-emerald-600" />, // Terrace
        6: <Waves className="w-3 h-3 text-emerald-600" />, // Lake view
        7: <Mountain className="w-3 h-3 text-emerald-600" />, // Mountain view
        8: <Waves className="w-3 h-3 text-emerald-600" />, // River view
        9: <Waves className="w-3 h-3 text-emerald-600" />, // Pool view
        10: <Building2 className="w-3 h-3 text-emerald-600" />, // City view
      };
      
      if (iconMap[itemId]) {
        return iconMap[itemId];
      }
    }
    
    if (itemName) {
      const nameLower = itemName.toLowerCase();
      if (nameLower.includes('mountain') || nameLower.includes('уул')) return <Mountain className="w-3 h-3 text-emerald-600" />;
      if (nameLower.includes('city') || nameLower.includes('хот')) return <Building2 className="w-3 h-3 text-emerald-600" />;
      if (nameLower.includes('balcony') || nameLower.includes('тагт')) return <Home className="w-3 h-3 text-emerald-600" />;
  if (nameLower.includes('view') || nameLower.includes('харсан')) return <Home className="w-3 h-3 text-emerald-600" />; // generic view icon
    }
    
  return <Home className="w-3 h-3 text-emerald-600" />;
  }

  // Room types icons - all 8 types from /api/all-data/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getRoomTypeIcon(typeId?: number, typeName?: string): React.ReactNode {
    if (typeId) {
      const iconMap: { [key: number]: React.ReactNode } = {
        6: <Bed className="w-4 h-4 text-indigo-600" />, // Single
        7: <Bed className="w-4 h-4 text-indigo-600" />, // Double
        8: <Bed className="w-4 h-4 text-indigo-600" />, // Twin
        9: <Bed className="w-4 h-4 text-indigo-600" />, // Twin / Double
        10: <Bed className="w-4 h-4 text-indigo-600" />, // Triple
        11: <Users className="w-4 h-4 text-indigo-600" />, // Family
        13: <Home className="w-4 h-4 text-indigo-600" />, // Apartment
  15: <Bed className="w-4 h-4 text-indigo-600" />, // King (generic bed)
      };
      
      if (iconMap[typeId]) {
        return iconMap[typeId];
      }
    }
    
    return <Bed className="w-4 h-4 text-indigo-600" />;
  }

  // Bed types icons - all 9 types from /api/all-data/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getBedTypeIcon(bedTypeId?: number, bedTypeName?: string): React.ReactNode {
    if (bedTypeId) {
      const iconMap: { [key: number]: React.ReactNode } = {
        12: <Bed className="w-4 h-4 text-slate-600" />, // 1 хүний ор
        13: <Bed className="w-4 h-4 text-slate-600" />, // 2 хүний ор
  14: <Bed className="w-4 h-4 text-slate-600" />, // Том ор / King size
        15: <Bed className="w-4 h-4 text-slate-600" />, // Нэмэлт ор
  16: <Armchair className="w-4 h-4 text-slate-600" />, // Буйдан
        17: <Bed className="w-4 h-4 text-slate-600" />, // Single bed (90-130cm)
        18: <Bed className="w-4 h-4 text-slate-600" />, // Double bed (131-150cm)
  19: <Bed className="w-4 h-4 text-slate-600" />, // King bed (151-180cm)
  20: <Bed className="w-4 h-4 text-slate-600" />, // Super king (181-210cm)
      };
      
      if (iconMap[bedTypeId]) {
        return iconMap[bedTypeId];
      }
    }
    
    return <Bed className="w-4 h-4 text-slate-600" />;
  }

  // Room category icons - all 13 categories from /api/all-data/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getRoomCategoryIcon(categoryId?: number, categoryName?: string): React.ReactNode {
    if (categoryId) {
      const iconMap: { [key: number]: React.ReactNode } = {
        3: <Star className="w-4 h-4 text-yellow-600" />, // Standard Room
        5: <Star className="w-4 h-4 text-yellow-600" />, // Superior Room
  6: <Star className="w-4 h-4 text-yellow-600" />, // Deluxe Room
  7: <Star className="w-4 h-4 text-yellow-600" />, // Suite Room
  8: <Star className="w-4 h-4 text-yellow-600" />, // Junior Suite Room
  9: <Home className="w-4 h-4 text-yellow-600" />, // Executive Room
  10: <Star className="w-4 h-4 text-yellow-600" />, // Presidential Room
  11: <Star className="w-4 h-4 text-yellow-600" />, // Penthouse Suite
        12: <Users className="w-4 h-4 text-yellow-600" />, // Family Room
        13: <Users className="w-4 h-4 text-yellow-600" />, // Connecting Rooms
        14: <Users className="w-4 h-4 text-yellow-600" />, // Accessible Room
        15: <Star className="w-4 h-4 text-yellow-600" />, // Comfort Room
      };
      
      if (iconMap[categoryId]) {
        return iconMap[categoryId];
      }
    }
    
    return <Star className="w-4 h-4 text-yellow-600" />;
  }
}