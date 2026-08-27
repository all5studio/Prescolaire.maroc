import { useEffect } from 'react';
import { useSiteData } from '@/lib/SiteDataContext';
import { COLOR_TOKENS } from '@/lib/types';

// Generates a 9-step Tailwind-style color ramp from a single hex color
// and injects it as CSS variables on :root, plus overrides the
// primary/secondary Tailwind classes via inline style tags.
function generateRamp(hex: string): string[] {
  const { r, g, b } = hexToRgb(hex);
  const ramp: string[] = [];
  const steps = [
    { l: 0.95, s: 0.85 }, { l: 0.88, s: 0.80 }, { l: 0.78, s: 0.75 },
    { l: 0.68, s: 0.72 }, { l: 0.58, s: 0.70 }, { l: 0.48, s: 0.68 },
    { l: 0.40, s: 0.66 }, { l: 0.30, s: 0.62 }, { l: 0.22, s: 0.55 },
    { l: 0.14, s: 0.48 },
  ];
  for (const step of steps) {
    ramp.push(rgbToHex(mix(r, g, b, step.l, step.s)));
  }
  return ramp;
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const to = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

function mix(r: number, g: number, b: number, lightness: number, sat: number) {
  const gray = lightness * 255;
  return {
    r: r * sat + gray * (1 - sat),
    g: g * sat + gray * (1 - sat),
    b: b * sat + gray * (1 - sat),
  };
}

let styleEl: HTMLStyleElement | null = null;

export function useThemeColors() {
  const { settings } = useSiteData();

  useEffect(() => {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-theme-colors';
      document.head.appendChild(styleEl);
    }

    const primaryRamp = generateRamp(settings.primary_color);
    const secondaryRamp = generateRamp(settings.secondary_color);

    let css = ':root {\n';
    primaryRamp.forEach((c, i) => {
      css += `  --color-primary-${i * 100 === 0 ? 50 : i * 100}: ${c};\n`;
    });
    secondaryRamp.forEach((c, i) => {
      css += `  --color-secondary-${i * 100 === 0 ? 50 : i * 100}: ${c};\n`;
    });
    css += `  --primary: ${settings.primary_color};\n  --secondary: ${settings.secondary_color};\n`;

    // inject granular element color tokens
    for (const token of COLOR_TOKENS) {
      css += `  ${token.cssVar}: ${settings[token.key]};\n`;
    }
    css += '}\n\n';

    // Override Tailwind's primary-* and secondary-* utility classes
    css += generateClassOverrides('primary', primaryRamp);
    css += generateClassOverrides('secondary', secondaryRamp);

    styleEl.textContent = css;
  }, [settings]);
}

function generateClassOverrides(name: string, ramp: string[]): string {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  let css = '';
  shades.forEach((shade, i) => {
    const c = ramp[i];
    css += `.bg-${name}-${shade} { background-color: ${c} !important; }\n`;
    css += `.text-${name}-${shade} { color: ${c} !important; }\n`;
    css += `.border-${name}-${shade} { border-color: ${c} !important; }\n`;
    css += `.from-${name}-${shade} { --tw-gradient-from: ${c} var(--tw-gradient-from-position); --tw-gradient-to: ${c}00 var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }\n`;
    css += `.to-${name}-${shade} { --tw-gradient-to: ${c} var(--tw-gradient-to-position); }\n`;
    css += `.via-${name}-${shade} { --tw-gradient-via: ${c} var(--tw-gradient-via-position); }\n`;
    css += `.hover\\:bg-${name}-${shade}:hover { background-color: ${c} !important; }\n`;
    css += `.hover\\:text-${name}-${shade}:hover { color: ${c} !important; }\n`;
    css += `.hover\\:border-${name}-${shade}:hover { border-color: ${c} !important; }\n`;
    css += `.dark\\:bg-${name}-${shade}:is(.dark *) { background-color: ${c} !important; }\n`;
    css += `.dark\\:text-${name}-${shade}:is(.dark *) { color: ${c} !important; }\n`;
    css += `.dark\\:hover\\:bg-${name}-${shade}:is(.dark *):hover { background-color: ${c} !important; }\n`;
    css += `.dark\\:hover\\:text-${name}-${shade}:is(.dark *):hover { color: ${c} !important; }\n`;
    css += `.group:hover .group-hover\\:text-${name}-${shade} { color: ${c} !important; }\n`;
    css += `.group:hover .group-hover\\:bg-${name}-${shade} { background-color: ${c} !important; }\n`;
    css += `.ring-${name}-${shade} { --tw-ring-color: ${c} !important; }\n`;
  });
  css += `.from-${name}-600 { --tw-gradient-from: ${ramp[6]} var(--tw-gradient-from-position); }\n`;
  css += `.to-${name}-800 { --tw-gradient-to: ${ramp[8]} var(--tw-gradient-to-position); }\n`;
  return css;
}
