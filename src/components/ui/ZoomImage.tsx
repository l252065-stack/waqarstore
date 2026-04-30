"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface ZoomImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  zoomScale?: number;
}

/**
 * Amazon-style cursor-magnification zoom.
 * On hover the image scales around the cursor position.
 */
export default function ZoomImage({
  src,
  alt,
  width,
  height,
  className,
  zoomScale = 2.2,
}: ZoomImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-zoom-in select-none", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "w-full h-full object-cover transition-transform duration-200 ease-out will-change-transform",
          isHovering ? "scale-[var(--zoom)]" : "scale-100"
        )}
        style={
          isHovering
            ? ({
                "--zoom": zoomScale,
                transformOrigin: `${origin.x}% ${origin.y}%`,
              } as React.CSSProperties)
            : undefined
        }
        draggable={false}
        priority={false}
      />
    </div>
  );
}
