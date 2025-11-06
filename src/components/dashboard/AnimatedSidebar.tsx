"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Home,
  BarChart2,
  Package,
  Users,
  Settings,
  ShoppingCart,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Ventas", href: "/dashboard/sales", icon: ShoppingCart },
  { name: "Productos", href: "/dashboard/products", icon: Package },
  { name: "Clientes", href: "/dashboard/customers", icon: Users },
  { name: "Reportes", href: "/dashboard/reports", icon: BarChart2 },
  { name: "Ajustes", href: "/dashboard/settings", icon: Settings },
];

const NavigationContent = ({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({
      redirect: false,
      callbackUrl: "/login",
    });
    router.push("/login");
    onLinkClick?.();
  };

  return (
    <>
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold tracking-heading text-gray-900 dark:text-white">
          Mi Negocio
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-full text-xs font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 mr-3 transition-colors",
                      isActive
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white",
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer con usuario y cerrar sesión */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
        {session?.user && (
          <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900">
            <p className="text-xs font-medium text-gray-900 dark:text-white">
              {session.user.name || session.user.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {session.user.email}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full h-12"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-xs font-medium">Cerrar Sesión</span>
        </Button>
      </div>
    </>
  );
};

export function AnimatedSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white dark:bg-black border-gray-200 dark:border-gray-800"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full bg-white dark:bg-black">
              <NavigationContent
                pathname={pathname}
                onLinkClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 z-50">
        <div className="flex flex-col h-full w-full">
          <NavigationContent pathname={pathname} />
        </div>
      </aside>
    </>
  );
}
