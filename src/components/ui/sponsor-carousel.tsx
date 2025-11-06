"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils/utils";

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url?: string;
}

interface SponsorCarouselProps {
  sponsors: Sponsor[];
  autoPlayInterval?: number;
  className?: string;
}

export function SponsorCarousel({ sponsors, className }: SponsorCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    if (scrollRef.current && sponsors.length > 0) {
      // Inicializar la posición del scroll si no está establecida
      if (scrollPositionRef.current === 0) {
        scrollPositionRef.current = scrollRef.current.scrollLeft || 0;
      }
    }
  }, [sponsors.length]);

  useEffect(() => {
    if (!isPaused && sponsors.length > 0 && scrollRef.current) {
      const scrollSpeed = 0.5; // Velocidad de scroll (px por frame)

      const animate = () => {
        if (scrollRef.current) {
          // Solo actualizar si no está pausado
          if (!isPaused) {
            scrollPositionRef.current += scrollSpeed;

            // Obtener el ancho de un solo set de sponsors
            const singleSetWidth = scrollRef.current.scrollWidth / 2;

            // Resetear cuando llegue al final del primer set (para loop infinito)
            if (scrollPositionRef.current >= singleSetWidth) {
              scrollPositionRef.current = 0;
            }

            scrollRef.current.scrollLeft = scrollPositionRef.current;
          }
        }

        if (!isPaused) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, sponsors.length]);

  // Guardar la posición actual cuando se pausa
  useEffect(() => {
    if (isPaused && scrollRef.current) {
      scrollPositionRef.current = scrollRef.current.scrollLeft;
    }
  }, [isPaused]);

  const handleMouseEnter = () => {
    // Guardar la posición actual antes de pausar
    if (scrollRef.current) {
      scrollPositionRef.current = scrollRef.current.scrollLeft;
    }
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (sponsors.length === 0) {
    return null;
  }

  // Duplicamos los sponsors para el loop infinito
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div
      className={cn("w-full relative py-8", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fade gradient izquierdo - efecto de desvanecimiento */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />

      {/* Fade gradient derecho - efecto de desvanecimiento */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

      <div className="relative w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex items-center gap-12 overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {duplicatedSponsors.map((sponsor, index) => (
            <div
              key={`${sponsor.id}-${index}`}
              className="flex-shrink-0 flex items-center justify-center group px-4"
            >
              <div className="relative w-40 h-24 flex items-center justify-center">
                {sponsor.url ? (
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full flex items-center justify-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="w-full h-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110 opacity-70 group-hover:opacity-100 max-h-20"
                    />
                  </a>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="w-full h-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110 opacity-70 group-hover:opacity-100 max-h-20"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
