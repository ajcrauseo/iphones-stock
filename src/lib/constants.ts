export const IPHONE_MODELS = [
  'iPhone 12',
  'iPhone 12 Pro',
  'iPhone 12 Pro Max',
  'iPhone 13',
  'iPhone 13 Pro',
  'iPhone 13 Pro Max',
  'iPhone 14',
  'iPhone 14 Plus',
  'iPhone 14 Pro',
  'iPhone 14 Pro Max',
  'iPhone 15',
  'iPhone 15 Plus',
  'iPhone 15 Pro',
  'iPhone 15 Pro Max',
  'iPhone 16',
  'iPhone 16 Plus',
  'iPhone 16 Pro',
  'iPhone 16 Pro Max',
  'iPhone 17',
  'iPhone 17 Pro',
  'iPhone 17 Pro Max',
];

export const IPHONE_CAPACITIES = [
  '128GB',
  '256GB',
  '512GB',
  '1TB',
  '2TB',
];

export const IPHONE_CAPACITIES_BY_MODEL: Record<string, string[]> = {
  'iPhone 12': ['128GB', '256GB'],
  'iPhone 12 Pro': ['128GB', '256GB', '512GB'],
  'iPhone 12 Pro Max': ['128GB', '256GB', '512GB'],
  'iPhone 13': ['128GB', '256GB', '512GB'],
  'iPhone 13 Pro': ['128GB', '256GB', '512GB', '1TB'],
  'iPhone 13 Pro Max': ['128GB', '256GB', '512GB', '1TB'],
  'iPhone 14': ['128GB', '256GB', '512GB'],
  'iPhone 14 Plus': ['128GB', '256GB', '512GB'],
  'iPhone 14 Pro': ['128GB', '256GB', '512GB', '1TB'],
  'iPhone 14 Pro Max': ['128GB', '256GB', '512GB', '1TB'],
  'iPhone 15': ['128GB', '256GB', '512GB'],
  'iPhone 15 Plus': ['128GB', '256GB', '512GB'],
  'iPhone 15 Pro': ['128GB', '256GB', '512GB', '1TB'],
  'iPhone 15 Pro Max': ['256GB', '512GB', '1TB'],
  'iPhone 16': ['128GB', '256GB', '512GB'],
  'iPhone 16 Plus': ['128GB', '256GB', '512GB'],
  'iPhone 16 Pro': ['128GB', '256GB', '512GB', '1TB'],
  'iPhone 16 Pro Max': ['256GB', '512GB', '1TB'],
  'iPhone 17': ['256GB', '512GB'],
  'iPhone 17 Pro': ['256GB', '512GB', '1TB'],
  'iPhone 17 Pro Max': ['256GB', '512GB', '1TB', '2TB'],
};

export const IPHONE_COLORS_BY_MODEL: Record<string, string[]> = {
  'iPhone 12': ['Negro', 'Blanco', 'PRODUCT(RED)', 'Azul', 'Verde', 'Púrpura'],
  'iPhone 12 Pro': ['Grafito', 'Plata', 'Oro', 'Azul Pacífico'],
  'iPhone 12 Pro Max': ['Grafito', 'Plata', 'Oro', 'Azul Pacífico'],
  'iPhone 13': ['Medianoche', 'Blanco Estelar', 'PRODUCT(RED)', 'Azul', 'Rosa', 'Verde'],
  'iPhone 13 Pro': ['Grafito', 'Oro', 'Plata', 'Azul Sierra', 'Verde Alpino'],
  'iPhone 13 Pro Max': ['Grafito', 'Oro', 'Plata', 'Azul Sierra', 'Verde Alpino'],
  'iPhone 14': ['Medianoche', 'Blanco Estelar', 'PRODUCT(RED)', 'Azul', 'Púrpura', 'Amarillo'],
  'iPhone 14 Plus': ['Medianoche', 'Blanco Estelar', 'PRODUCT(RED)', 'Azul', 'Púrpura', 'Amarillo'],
  'iPhone 14 Pro': ['Negro Espacial', 'Plata', 'Oro', 'Morado Oscuro'],
  'iPhone 14 Pro Max': ['Negro Espacial', 'Plata', 'Oro', 'Morado Oscuro'],
  'iPhone 15': ['Negro', 'Azul', 'Verde', 'Amarillo', 'Rosa'],
  'iPhone 15 Plus': ['Negro', 'Azul', 'Verde', 'Amarillo', 'Rosa'],
  'iPhone 15 Pro': ['Titanio Negro', 'Titanio Blanco', 'Titanio Azul', 'Titanio Natural'],
  'iPhone 15 Pro Max': ['Titanio Negro', 'Titanio Blanco', 'Titanio Azul', 'Titanio Natural'],
  'iPhone 16': ['Negro', 'Blanco', 'Rosa', 'Teal (Verde Azulado)', 'Ultramarina'],
  'iPhone 16 Plus': ['Negro', 'Blanco', 'Rosa', 'Teal (Verde Azulado)', 'Ultramarina'],
  'iPhone 16 Pro': ['Titanio Negro', 'Titanio Blanco', 'Titanio Natural', 'Titanio Desierto'],
  'iPhone 16 Pro Max': ['Titanio Negro', 'Titanio Blanco', 'Titanio Natural', 'Titanio Desierto'],
  'iPhone 17': ['Lavanda', 'Sage (Verde Sabio)', 'Mist Blue (Azul Niebla)', 'Blanco', 'Negro'],
  'iPhone 17 Pro': ['Silver (Plata)', 'Deep Blue (Azul Profundo)', 'Cosmic Orange (Naranja Cósmico)'],
  'iPhone 17 Pro Max': ['Silver (Plata)', 'Deep Blue (Azul Profundo)', 'Cosmic Orange (Naranja Cósmico)'],
};

// All unique colors for the global filter
export const ALL_IPHONE_COLORS = Array.from(
  new Set(Object.values(IPHONE_COLORS_BY_MODEL).flat())
).sort();

export const COLOR_MAP: Record<string, { bg: string; text: string; border?: string }> = {
  // Generales
  'Negro': { bg: '#1f2937', text: '#ffffff' },
  'Blanco': { bg: '#ffffff', text: '#1f2937', border: '#e5e7eb' },
  'PRODUCT(RED)': { bg: '#dc2626', text: '#ffffff' },
  'Azul': { bg: '#2563eb', text: '#ffffff' },
  'Verde': { bg: '#16a34a', text: '#ffffff' },
  'Púrpura': { bg: '#a855f7', text: '#ffffff' },
  'Amarillo': { bg: '#facc15', text: '#1f2937' },
  'Rosa': { bg: '#fbcfe8', text: '#1f2937' },
  'Plata': { bg: '#e5e7eb', text: '#1f2937' },
  'Oro': { bg: '#fde68a', text: '#1f2937' },
  
  // Pro / Especiales
  'Grafito': { bg: '#4b5563', text: '#ffffff' },
  'Azul Pacífico': { bg: '#0f4c5c', text: '#ffffff' },
  'Medianoche': { bg: '#020617', text: '#ffffff' },
  'Blanco Estelar': { bg: '#f8fafc', text: '#1f2937', border: '#e2e8f0' },
  'Azul Sierra': { bg: '#94a3b8', text: '#ffffff' },
  'Verde Alpino': { bg: '#3f6212', text: '#ffffff' },
  'Negro Espacial': { bg: '#18181b', text: '#ffffff' },
  'Morado Oscuro': { bg: '#4c1d95', text: '#ffffff' },
  
  // Titanio
  'Titanio Negro': { bg: '#27272a', text: '#ffffff' },
  'Titanio Blanco': { bg: '#f4f4f5', text: '#1f2937', border: '#e4e4e7' },
  'Titanio Azul': { bg: '#1e293b', text: '#ffffff' },
  'Titanio Natural': { bg: '#a1a1aa', text: '#ffffff' },
  'Titanio Desierto': { bg: '#d4b483', text: '#1f2937' },
  
  // iPhone 16/17
  'Teal (Verde Azulado)': { bg: '#0d9488', text: '#ffffff' },
  'Ultramarina': { bg: '#4338ca', text: '#ffffff' },
  'Lavanda': { bg: '#ddd6fe', text: '#1f2937' },
  'Sage (Verde Sabio)': { bg: '#86efac', text: '#1f2937' },
  'Mist Blue (Azul Niebla)': { bg: '#bfdbfe', text: '#1f2937' },
  'Silver (Plata)': { bg: '#cbd5e1', text: '#1f2937' },
  'Deep Blue (Azul Profundo)': { bg: '#1e3a8a', text: '#ffffff' },
  'Cosmic Orange (Naranja Cósmico)': { bg: '#ea580c', text: '#ffffff' },
};
