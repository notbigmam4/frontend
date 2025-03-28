export async function getMoneroPrice() {
    const options = {
        method: 'GET',
        headers: {'X-API-KEY': 'hfnxl3iLutIJnTq2NDOZAD/gL+5YREqQzHLZ2Bl+Cnw='}
      };
      
      const res = await fetch('https://openapiv1.coinstats.app/coins/price/avg?coinId=monero&timestamp=1725364458', options)
      const dejsonifyedres = res.json()
      return dejsonifyedres
}

export function generateRandomId16() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
  }
  return code;
}

import { byer } from './data';  // Importer byer-objektet fra data.ts

export function søkByer(q: string): string[] {
    // Filtrer byer basert på om navnet inkluderer søkestrengen (ikke case-sensitivt)
    return Object.keys(byer).filter(by => by.toLowerCase().includes(q.toLowerCase()));
}

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number = 500): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>): void => {
      if (timeoutId) {
          clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
          func(...args);
      }, delay);
  };
}