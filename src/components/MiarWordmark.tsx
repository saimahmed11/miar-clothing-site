import React from 'react';

interface MiarWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  color?: string;
  animated?: boolean;
  showLatin?: boolean;
  className?: string;
  onAnimationEnd?: () => void;
}

export const MiarWordmark: React.FC<MiarWordmarkProps> = ({
  size = 'md',
  color = '#0E5A6B',
  animated = false,
  showLatin = true,
  className = '',
  onAnimationEnd,
}) => {
  // Dimension scalings
  const dimensions = {
    sm: { width: 100, height: 42, latinSize: 'text-[9px]' },
    md: { width: 130, height: 54, latinSize: 'text-[10px]' },
    lg: { width: 180, height: 72, latinSize: 'text-[12px]' },
    xl: { width: 230, height: 92, latinSize: 'text-[13px]' },
    hero: { width: 340, height: 136, latinSize: 'text-[14px]' },
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-2 select-none ${className}`}
      role="img"
      aria-label="میار MIAR Karachi Apparel"
    >
      <svg
        viewBox="0 0 280 110"
        width={dimensions.width}
        height={dimensions.height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        onAnimationEnd={onAnimationEnd}
      >
        <title>میار — Miar</title>

        {/* 
          Outlined Nastaliq SVG Strokes for میار:
          1. Meem (مـ) loop and slope
          2. Medial Ya tooth (ـیـ)
          3. Vertical Alif ascent (ـا)
          4. Swooping Re descent (ر)
          5. Two distinct calligraphic diamond Nuqtas (dots) under Ya
        */}
        <g stroke={color} strokeLinecap="round" strokeLinejoin="round">
          {/* Main calligraphic ligature: Meem -> Ya -> Alif */}
          <path
            d="M 248 48 
               C 246 39, 236 34, 226 38 
               C 214 43, 212 55, 219 63 
               C 225 70, 238 70, 244 60 
               C 246 56, 245 52, 239 52
               C 222 52, 206 68, 185 70
               C 172 71, 160 67, 150 56
               L 150 18"
            strokeWidth={animated ? '6' : '7'}
            fill="none"
            className={animated ? 'animate-draw-stroke' : ''}
            style={{ animationDelay: '0.05s' }}
          />

          {/* Solid fill overlay when not animated or for high legibility */}
          {!animated && (
            <path
              d="M 248 48 
                 C 246 39, 236 34, 226 38 
                 C 214 43, 212 55, 219 63 
                 C 225 70, 238 70, 244 60 
                 C 246 56, 245 52, 239 52
                 C 222 52, 206 68, 185 70
                 C 172 71, 160 67, 150 56
                 L 150 18
                 L 144 19
                 L 144 58
                 C 155 70, 168 76, 184 75
                 C 204 74, 216 61, 231 59
                 C 233 63, 229 67, 223 66
                 C 216 63, 217 48, 228 44
                 C 236 41, 242 45, 244 50
                 Z"
              fill={color}
              stroke="none"
            />
          )}

          {/* Distinct downward Re (ر) calligraphic stroke */}
          <path
            d="M 125 50 
               C 120 50, 114 54, 110 61 
               C 102 74, 88 88, 70 94 
               C 62 96, 54 97, 46 96"
            strokeWidth={animated ? '6' : '7.5'}
            fill="none"
            className={animated ? 'animate-draw-stroke' : ''}
            style={{ animationDelay: '0.2s' }}
          />

          {!animated && (
            <path
              d="M 125 50 
                 C 120 50, 114 54, 110 61 
                 C 102 74, 88 88, 70 94 
                 C 62 96, 54 97, 46 96
                 C 53 98, 62 98, 72 95
                 C 91 89, 108 75, 116 61
                 C 119 56, 122 53, 126 53
                 Z"
              fill={color}
              stroke="none"
            />
          )}

          {/* Two Calligraphic Diamond Nuqtas (dots) under the Ya */}
          {/* Dot 1 */}
          <path
            d="M 188 86 L 195 93 L 188 100 L 181 93 Z"
            fill={color}
            strokeWidth="1.5"
            className={animated ? 'animate-draw-stroke' : ''}
            style={{ animationDelay: '0.35s' }}
          />
          {/* Dot 2 */}
          <path
            d="M 172 86 L 179 93 L 172 100 L 165 93 Z"
            fill={color}
            strokeWidth="1.5"
            className={animated ? 'animate-draw-stroke' : ''}
            style={{ animationDelay: '0.45s' }}
          />
        </g>
      </svg>

      {/* Small Latin "MIAR" companion for accessibility, brand recognition, and search */}
      {showLatin && (
        <span
          className={`font-semibold tracking-[0.28em] uppercase ${dimensions.latinSize} opacity-90 transition-opacity`}
          style={{ color }}
        >
          MIAR
        </span>
      )}
    </div>
  );
};
