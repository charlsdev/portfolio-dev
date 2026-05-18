# Design Tokens — Brand System

Sistema de diseño para portafolio fullstack. Todos los tokens están en formatos consumibles: HEX, CSS variables y Tailwind config.

---

## 1. Colores

### Primario
| Token | HEX | Uso |
|---|---|---|
| `--color-primary` | `#F5B544` | Signal Amber. CTAs, acentos, branding, links importantes. |
| `--color-primary-deep` | `#C8893A` | Hover de primary, texto sobre fondos claros, eyebrows. |

### Acento
| Token | HEX | Uso |
|---|---|---|
| `--color-accent` | `#4DD4E0` | Logic Cyan. Tags técnicos, highlights secundarios, data. |

### Neutros (escala)
| Token | HEX | Uso |
|---|---|---|
| `--color-ink` | `#0A0A0B` | Negro tinta. Texto principal en modo claro, fondo en oscuro. |
| `--color-gray-900` | `#1A1A1C` | Surfaces oscuras (cards en dark mode). |
| `--color-gray-700` | `#4A4A4F` | Texto secundario, párrafos. |
| `--color-gray-500` | `#8A8A8F` | Texto terciario, labels, placeholders. |
| `--color-gray-300` | `#D4D4D0` | Bordes, dividers. |
| `--color-gray-100` | `#EEEEE8` | Surfaces sutiles, hover de neutros. |
| `--color-paper` | `#FAFAF7` | Bone Paper. Fondo principal modo claro. |

### Fondo
| Token | HEX (light) | HEX (dark) |
|---|---|---|
| `--color-bg` | `#FAFAF7` | `#0A0A0B` |
| `--color-bg-surface` | `#FFFFFF` | `#1A1A1C` |
| `--color-bg-elevated` | `#EEEEE8` | `#2A2A2D` |

### Estados
| Token | HEX | Uso |
|---|---|---|
| `--color-success` | `#2D8F4E` | Confirmaciones, checks, "yes". |
| `--color-success-bg` | `#E8F5ED` | Background de banners de éxito (light). |
| `--color-error` | `#D9434E` | Errores, validación, "no", destructive. |
| `--color-error-bg` | `#FCE9EB` | Background de banners de error (light). |
| `--color-warning` | `#E8A317` | Advertencias. Comparte familia con primary pero más saturado. |
| `--color-warning-bg` | `#FDF3D9` | Background de banners de warning (light). |
| `--color-info` | `#4DD4E0` | Info banners. Reusa accent. |
| `--color-info-bg` | `#E3F8FA` | Background de banners de info (light). |

---

## 2. Tipografía

### Familias
| Token | Familia | Carga |
|---|---|---|
| `--font-display` | `Space Grotesk` | Google Fonts — pesos 500, 600, 700 |
| `--font-body` | `Inter` | Google Fonts — pesos 400, 500, 600 |
| `--font-mono` | `JetBrains Mono` | Google Fonts — pesos 400, 500 |

### Import (HTML `<head>`)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

### Import (Next.js / `app/layout.tsx`)
```ts
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
```

### Escala tipográfica
| Token | Rol | Familia | Size | Weight | Tracking | Line-height |
|---|---|---|---|---|---|---|
| `--text-hero` | H1 Hero | display | `56–72px` (clamp) | 700 | -0.02em | 0.95 |
| `--text-h2` | H2 Sección | display | `28–36px` | 700 | -0.02em | 1.1 |
| `--text-h3` | H3 Subtítulo | display | `18–22px` | 600 | -0.01em | 1.2 |
| `--text-body-lg` | Lead / Intro | body | `16–18px` | 400 | 0 | 1.5 |
| `--text-body` | Párrafo | body | `14–16px` | 400 | 0 | 1.6 |
| `--text-sm` | Secundario | body | `13–14px` | 400 | 0 | 1.5 |
| `--text-eyebrow` | Labels UPPER | body | `11–12px` | 600 | +0.2em | 1.4 |
| `--text-code` | Inline / blocks | mono | `13–14px` | 400 | 0 | 1.6 |

---

## 3. Logo

Todos los archivos están en `/logos`.

### Versiones disponibles
| Archivo | Uso |
|---|---|
| `logo_primary.svg` | Versión principal. Ámbar sobre cualquier fondo oscuro. |
| `logo_black.svg` | Mono negro. Para fondos claros y documentos impresos. |
| `logo_white.svg` | Mono blanco. Para fondos oscuros sin acento de color. |
| `logo_avatar_dark.svg` | Isologo cuadrado, fondo oscuro. Avatar redes sociales. |
| `logo_avatar_amber.svg` | Isologo cuadrado, fondo ámbar. Versión alternativa avatar. |
| `favicon_32.png` / `favicon_64.png` | Favicon web. |

### Reglas de uso
- **Es un isotipo** (símbolo solo) — todavía no hay imagotipo (símbolo + texto). Si se necesita versión con nombre, ubicar el wordmark a la derecha del isotipo con un gap igual al ancho del bracket `<`.
- **Tamaño mínimo digital**: 24×24px. Para favicon: 16×16px (usar `favicon_32.png` reescalado).
- **Área de seguridad**: equivale a `x` = 20% del lado del bounding box del logo. Mantener libre de texto u otros elementos.
- **Cuándo usar cada versión**:
  - Fondo oscuro (#0A0A0B → #4A4A4F) → `logo_primary.svg` (ámbar)
  - Fondo claro (#FAFAF7 → #EEEEE8) → `logo_black.svg`
  - Sobre fondo de color sólido → `logo_black.svg` o `logo_white.svg` según contraste
  - Avatar de plataformas (GitHub, LinkedIn, Twitter) → `logo_avatar_dark.svg`

---

## 4. Layout — Radios, espaciado, sombras

### Border radius
| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | `4px` | Inputs, badges, chips. |
| `--radius-md` | `8px` | Botones, tags. |
| `--radius-lg` | `12px` | Cards, modals. |
| `--radius-xl` | `20px` | Hero cards, contenedores grandes. |
| `--radius-full` | `9999px` | Pills, avatars circulares. |

### Espaciado (base 4px)
| Token | Valor |
|---|---|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |
| `--space-24` | `96px` |

### Sombras
| Token | Valor |
|---|---|
| `--shadow-sm` | `0 1px 2px rgba(10, 10, 11, 0.06)` |
| `--shadow-md` | `0 4px 12px rgba(10, 10, 11, 0.08)` |
| `--shadow-lg` | `0 12px 32px rgba(10, 10, 11, 0.12)` |
| `--shadow-glow-amber` | `0 0 24px rgba(245, 181, 68, 0.35)` |
| `--shadow-glow-cyan` | `0 0 24px rgba(77, 212, 224, 0.35)` |

**Regla**: usar sombras con moderación. La marca prefiere bordes + contraste cromático antes que profundidad. Reservar `shadow-lg` y `glow` para elementos destacados puntuales.

### Bordes
- Grosor estándar: `1px solid var(--color-gray-300)` (light) / `1px solid var(--color-gray-700)` (dark)
- Grosor enfático: `2px` para estados focus

### Focus ring
```css
outline: 2px solid var(--color-primary);
outline-offset: 2px;
```

---

## 5. Modo de color

**Soporta light y dark.** El modo claro es el default; el oscuro es first-class (no afterthought) porque encaja con la identidad de la marca (el isotipo primario nació sobre fondo negro).

### Convención
- Detección automática: respetar `prefers-color-scheme`
- Override manual: clase `.dark` en `<html>` o atributo `[data-theme="dark"]`
- Persistir preferencia en `localStorage`

### Variables por modo (CSS)

```css
:root {
  /* Light mode (default) */
  --color-bg: #FAFAF7;
  --color-bg-surface: #FFFFFF;
  --color-bg-elevated: #EEEEE8;
  --color-text: #0A0A0B;
  --color-text-secondary: #4A4A4F;
  --color-text-tertiary: #8A8A8F;
  --color-border: #D4D4D0;
  --color-border-strong: #8A8A8F;

  /* Brand colors (constantes entre modos) */
  --color-primary: #F5B544;
  --color-primary-deep: #C8893A;
  --color-accent: #4DD4E0;

  /* Estados */
  --color-success: #2D8F4E;
  --color-error: #D9434E;
  --color-warning: #E8A317;
}

.dark, [data-theme="dark"] {
  --color-bg: #0A0A0B;
  --color-bg-surface: #1A1A1C;
  --color-bg-elevated: #2A2A2D;
  --color-text: #FAFAF7;
  --color-text-secondary: #D4D4D0;
  --color-text-tertiary: #8A8A8F;
  --color-border: #2A2A2D;
  --color-border-strong: #4A4A4F;

  /* Brand colors se mantienen; ajustar estados para contraste */
  --color-success: #4FB36F;
  --color-error: #E96570;
  --color-warning: #F5BD3A;
}
```

---

## 6. Tailwind config (drop-in)

```js
// tailwind.config.js
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#F5B544', deep: '#C8893A' },
        accent: { DEFAULT: '#4DD4E0' },
        ink: '#0A0A0B',
        paper: '#FAFAF7',
        gray: {
          100: '#EEEEE8',
          300: '#D4D4D0',
          500: '#8A8A8F',
          700: '#4A4A4F',
          900: '#1A1A1C',
        },
        success: '#2D8F4E',
        error: '#D9434E',
        warning: '#E8A317',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '20px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(10, 10, 11, 0.06)',
        md: '0 4px 12px rgba(10, 10, 11, 0.08)',
        lg: '0 12px 32px rgba(10, 10, 11, 0.12)',
        'glow-amber': '0 0 24px rgba(245, 181, 68, 0.35)',
        'glow-cyan': '0 0 24px rgba(77, 212, 224, 0.35)',
      },
      letterSpacing: {
        tight: '-0.02em',
        wide: '0.2em',
      },
    },
  },
};
```

---

## 7. Reglas rápidas para el agente

- **Default font**: cuerpo en `Inter`, títulos en `Space Grotesk`, todo lo "code-flavored" (HEX, paths, tags técnicos, números técnicos) en `JetBrains Mono`.
- **Primary CTA**: fondo `--color-primary` (#F5B544) con texto `--color-ink` (#0A0A0B). Nunca primary sobre primary.
- **Eyebrows / labels**: uppercase, tracking `+0.2em`, color `--color-primary-deep` en light / `--color-primary` en dark.
- **Cards**: fondo `--color-bg-surface`, borde `1px solid --color-border`, radius `lg` (12px). Sombra solo si es elemento destacado.
- **Mono inline**: usar para nombres de tech (`React`, `TypeScript`, `PostgreSQL`), HEX, paths, comandos. Pequeño tag visual de "esto es código".
- **No usar**: gradientes (excepto sutiles funcionales), drop-shadows densas, múltiples colores brand simultáneamente (primary + accent en un mismo componente sí; añadir un tercero no).
- **Focus visible siempre**: `outline: 2px solid var(--color-primary); outline-offset: 2px;` — accesibilidad no negociable.
