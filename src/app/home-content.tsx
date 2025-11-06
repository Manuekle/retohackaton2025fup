"use client";

import Link from "next/link";
import { SponsorCarousel } from "@/components/ui/sponsor-carousel";
import { Github, Mail } from "lucide-react";

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

const teamMembers = [
  {
    id: "1",
    name: "Manuel Esteban Erazo Medina",
    email: "manuel.erazo7@estudiante.fup.edu.co",
    github: "https://github.com/Manuekle",
    role: "Desarrollador Full Stack",
  },
  {
    id: "2",
    name: "Santiago Alejandro Medina Munoz",
    email: "santiagoa.medina@estudiante.fup.edu.co",
    github: "https://github.com/santiamedina",
    role: "Desarrollador Data Analyst",
  },
  {
    id: "3",
    name: "Juan Miguel Cedeno Solano",
    email: "juan.cedeno@estudiante.fup.edu.co",
    github: "https://github.com/Juans4Tv",
    role: "Arquitecto de Software",
  },
];

const projectRepo = "https://github.com/Manuekle/retohackaton2025fup";

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

        {/* Team Section */}
        <div className="w-full mt-16 sm:mt-24 mb-8 sm:mb-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-heading mb-2">
              Nuestro Equipo
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Conoce a los integrantes que desarrollaron este proyecto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-card border border-border rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                      {member.role}
                    </p>
                    <div className="space-y-2">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        <span>{member.email}</span>
                      </a>
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Repository */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full px-6 py-3 hover:shadow-md transition-shadow duration-200">
              <Github className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground mr-2">
                Repositorio del Proyecto:
              </span>
              <a
                href={projectRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Ver en GitHub
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
