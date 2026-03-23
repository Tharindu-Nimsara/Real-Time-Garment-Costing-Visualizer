export default function GarmentPreview({
  color = "#FFFFFF",
  type = "crewneck_tee",
  hasLogo = false,
  logoPosition = "chest",
  size = 280,
}) {
  const isDark = isColorDark(color);
  const strokeColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
  const shadowColor = isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.1)";
  const highlightColor = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(255,255,255,0.7)";

  const isPolo = type === "polo";
  const isLong = type === "crewneck_long";
  const bodyPath =
    "M72 55 L30 80 L38 115 L65 105 L65 240 L195 240 L195 105 L222 115 L230 80 L188 55 L175 42 C165 35 130 32 130 32 C130 32 95 35 85 42 Z";
  const longBodyPath =
    "M72 55 L52 78 L48 115 L65 105 L65 240 L195 240 L195 105 L212 115 L208 78 L188 55 L175 42 C165 35 130 32 130 32 C130 32 95 35 85 42 Z";
  const leftLongSleevePath =
    "M50 101 C43 115 38 139 35 163 C39 175 43 184 49 191 C56 180 61 166 65 149 L65 95 Z";
  const rightLongSleevePath =
    "M210 101 C217 115 222 139 225 163 C221 175 217 184 211 191 C204 180 199 166 195 149 L195 95 Z";

  // Logo positions mapped to SVG coords
  const logoCoords = {
    chest: { x: 118, y: 105 },
    back: { x: 118, y: 120 },
    sleeve: { x: 68, y: 95 },
  };
  const logo = logoCoords[logoPosition] || logoCoords.chest;

  return (
    <svg
      viewBox="0 0 260 320"
      width={size}
      height={size * (320 / 260)}
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 8px 24px ${shadowColor})` }}
    >
      <defs>
        <linearGradient id={`bodyGrad-${type}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={highlightColor} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>

      {/* Body */}
      <path
        d={isLong ? longBodyPath : bodyPath}
        fill={color}
        stroke={strokeColor}
        strokeWidth="1.5"
      />

      {isLong && (
        <>
          <path
            d={leftLongSleevePath}
            fill={color}
            stroke={strokeColor}
            strokeWidth="1.2"
          />
          <path
            d={rightLongSleevePath}
            fill={color}
            stroke={strokeColor}
            strokeWidth="1.2"
          />
        </>
      )}

      {/* Highlight overlay */}
      <path
        d={isLong ? longBodyPath : bodyPath}
        fill={`url(#bodyGrad-${type})`}
      />

      {isLong && (
        <>
          <path d={leftLongSleevePath} fill={`url(#bodyGrad-${type})`} />
          <path d={rightLongSleevePath} fill={`url(#bodyGrad-${type})`} />
        </>
      )}

      {/* Neckline */}
      {isPolo ? (
        // Polo collar
        <>
          <path
            d="M105 42 Q130 52 155 42 L158 65 Q130 72 102 65 Z"
            fill={color}
            stroke={strokeColor}
            strokeWidth="1"
          />
          <path
            d="M125 42 L130 58 L135 42"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          {/* Polo buttons */}
          <circle cx="130" cy="52" r="2" fill={strokeColor} />
          <circle cx="130" cy="60" r="2" fill={strokeColor} />
        </>
      ) : (
        // Crew neck
        <path
          d="M105 42 Q130 58 155 42"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}

      {/* Sleeve seam lines */}
      {isLong ? (
        <>
          <path
            d="M63 96 C60 119 58 146 56 173"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          <path
            d="M197 96 C200 119 202 146 204 173"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
        </>
      ) : (
        <>
          <line
            x1="65"
            y1="105"
            x2="65"
            y2="155"
            stroke={strokeColor}
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          <line
            x1="195"
            y1="105"
            x2="195"
            y2="155"
            stroke={strokeColor}
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
        </>
      )}

      {/* Hem line */}
      <line
        x1="67"
        y1="237"
        x2="193"
        y2="237"
        stroke={strokeColor}
        strokeWidth="1"
        strokeDasharray="4 3"
      />

      {/* Logo / embroidery */}
      {hasLogo && (
        <g transform={`translate(${logo.x}, ${logo.y})`}>
          <rect
            x="-14"
            y="-10"
            width="28"
            height="20"
            rx="3"
            fill={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"}
            stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}
            strokeWidth="0.8"
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="7"
            fontFamily="'DM Mono', monospace"
            fontWeight="500"
            fill={isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)"}
          >
            LOGO
          </text>
        </g>
      )}

      {/* Rib cuffs for long sleeve */}
      {isLong && (
        <>
          <path
            d="M38 173 C41 181 45 187 49 191"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <path
            d="M222 173 C219 181 215 187 211 191"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        </>
      )}
    </svg>
  );
}

function isColorDark(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}
