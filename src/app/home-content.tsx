"use client";

import Link from "next/link";
import { SponsorCarousel } from "@/components/ui/sponsor-carousel";

const sponsors = [
  {
    id: "1",
    name: "Programa Ingeniería de Sistemas",
    logo: "/sponsors/1.png",
  },
  {
    id: "2",
    name: "Smurfit Kappa",
    logo: "/sponsors/2.jpg",
  },
  {
    id: "3",
    name: "SMARTER",
    logo: "/sponsors/3.jpg",
  },
  {
    id: "4",
    name: "SENPRO",
    logo: "/sponsors/4.jpg",
  },
  {
    id: "5",
    name: "BLESS CARD",
    logo: "/sponsors/5.jpg",
  },
  {
    id: "6",
    name: "LIBERO",
    logo: "/sponsors/6.jpg",
  },
  {
    id: "7",
    name: "DEVENIAC",
    logo: "/sponsors/7.jpg",
  },
];

export function HomeContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <main className="flex flex-col items-center justify-center p-4 sm:p-8 text-center w-full max-w-7xl mx-auto">
        <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
          {/* Logo FUP */}
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fup.png"
              alt="Logo FUP"
              className="h-24 sm:h-32 md:h-40 w-auto object-contain dark:brightness-0 dark:invert transition-all duration-300"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-heading font-bold mb-4 bg-gradient-to-r dark:from-blue-200 dark:via-sky-300 dark:to-blue-400 from-blue-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            Reto Hackaton 2025 FUP
          </h1>
          <p className="text-xs sm:text-lg md:text-xl tracking-card text-muted-foreground mb-6 sm:mb-8">
            Solución de análisis de inventario y ventas.
          </p>
          <div className="flex md:flex-row flex-col items-center gap-2 w-full justify-center mb-6 sm:mb-8">
            <Link href="/login" legacyBehavior>
              <a className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-xs font-semibold text-primary-foreground bg-primary rounded-full hover:opacity-90 transition-opacity">
                Iniciar Sesión
              </a>
            </Link>
            <Link href="/shop" legacyBehavior>
              <a className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-xs font-semibold text-primary-foreground bg-primary rounded-full hover:opacity-90 transition-opacity">
                Ver Productos
              </a>
            </Link>
          </div>
        </div>

        {/* Sponsors Carousel */}
        <div className="w-full mt-8 sm:mt-16">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xs sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nuestros Sponsors
            </h2>
          </div>
          <SponsorCarousel sponsors={sponsors} autoPlayInterval={3000} />
        </div>
      </main>
    </div>
  );
}
