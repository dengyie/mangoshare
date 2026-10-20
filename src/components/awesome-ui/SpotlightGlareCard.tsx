import React, { useRef, useState } from "react";

export interface SpotlightGlareCardProps {
  children?: React.ReactNode;
  /** Glare highlight intensity (0-1), default 0.45 */
  glareOpacity?: number;
  /** Glare gradient radius in percentage, default 55% */
  glareRadius?: number;
  /** Enable subtle 3D tilt transformation */
  enableTilt?: boolean;
  /** Max tilt degrees, default 5 */
  maxTilt?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const SpotlightGlareCard: React.FC<SpotlightGlareCardProps> = ({
  children,
  glareOpacity = 0.45,
  glareRadius = 55,
  enableTilt = false,
  maxTilt = 5,
  className = "",
  style,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ gx: string; gy: string; rx: number; ry: number; isHovered: boolean }>({
    gx: "50%",
    gy: "50%",
    rx: 0,
    ry: 0,
    isHovered: false,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gxPercent = (x / rect.width) * 100;
    const gyPercent = (y / rect.height) * 100;

    let rx = 0;
    let ry = 0;
    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      ry = ((x - centerX) / centerX) * maxTilt;
      rx = -((y - centerY) / centerY) * maxTilt;
    }

    setCoords({
      gx: `${gxPercent.toFixed(1)}%`,
      gy: `${gyPercent.toFixed(1)}%`,
      rx,
      ry,
      isHovered: true,
    });
  };

  const handlePointerLeave = () => {
    setCoords((prev) => ({
      ...prev,
      rx: 0,
      ry: 0,
      isHovered: false,
    }));
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      style={{
        ...style,
        transform: enableTilt && coords.isHovered
          ? `perspective(1000px) rotateX(${coords.rx}deg) rotateY(${coords.ry}deg) translateY(-2px)`
          : undefined,
        transition: coords.isHovered ? "transform 0.1s ease-out" : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={`group relative overflow-hidden rounded-2xl bg-[#faf8f1] dark:bg-[#1a1d24] border border-[#d6d2c2]/80 dark:border-[#2b3038]/80 text-[#22262d] dark:text-[#e9e6db] shadow-[0_1px_0_rgba(34,38,45,0.07),0_5px_16px_rgba(34,38,45,0.07)] dark:shadow-[0_1px_0_rgba(0,0,0,0.4),0_8px_22px_rgba(0,0,0,0.42)] transition-shadow duration-300 hover:shadow-[0_2px_0_rgba(34,38,45,0.08),0_12px_28px_rgba(34,38,45,0.12)] select-none ${className}`}
    >
      {/* Specular glare reflection layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: coords.isHovered ? glareOpacity : 0,
          background: `radial-gradient(circle at ${coords.gx} ${coords.gy}, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.15) 30%, transparent ${glareRadius}%)`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-0 h-full w-full">{children}</div>
    </div>
  );
};
