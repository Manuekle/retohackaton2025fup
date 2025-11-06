"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/hooks/use-cart";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Settings,
  LogOut,
  User,
  Package,
} from "lucide-react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { PageLoading } from "@/components/dashboard/LoadingSkeleton";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sizes?: string[];
  category?: {
    id: string;
    name: string;
  } | null;
};

type Category = {
  id: string;
  name: string;
};

export default function ShopPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, addToCart, getItemCount, isLoading: cartLoading } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("Error al cargar los datos");
        }

        const [productsData, categoriesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.ok ? categoriesRes.json() : [],
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch {
        toast.error("Error al cargar los productos", {
          description:
            "No se pudieron cargar los productos. Por favor, recarga la página.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category?.id === selectedCategory;

    const hasStock = product.stock > 0;

    return matchesSearch && matchesCategory && hasStock;
  });

  const handleAddToCart = (product: Product, size?: string) => {
    if (product.stock === 0) {
      toast.error("Producto sin stock");
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !size) {
      toast.error("Selecciona una talla");
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: size || undefined,
    });

    toast.success("Producto agregado al carrito", {
      description: `${product.name}${size ? ` (Talla: ${size})` : ""} agregado correctamente.`,
    });
  };

  if (isLoading || cartLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/")}
              className="text-xl sm:text-2xl font-bold tracking-heading text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Tienda
            </button>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => router.push("/shop/cart")}
              >
                <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">
                    {getItemCount()}
                  </span>
                )}
              </Button>
              {session ? (
                <div className="flex items-center gap-2">
                  {session.user?.role === "admin" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/dashboard")}
                      className="rounded-full text-xs hidden sm:flex"
                    >
                      Dashboard
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative h-9 w-9 rounded-full hover:opacity-80 transition-opacity">
                        <Avatar className="h-9 w-9 border-2 border-gray-200 dark:border-gray-700">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-semibold">
                            {session.user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2) ||
                              session.user?.email?.[0].toUpperCase() ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56  rounded-xl border-gray-200 dark:border-gray-800 shadow-lg"
                    >
                      <DropdownMenuLabel className="px-4 py-3">
                        <div className="flex flex-col space-y-1">
                          <p className="text-xs font-semibold leading-none text-gray-900 dark:text-white">
                            {session.user?.name || "Usuario"}
                          </p>
                          <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                            {session.user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
                      <DropdownMenuItem
                        onClick={() => router.push("/shop/purchases")}
                        className="cursor-pointer rounded-lg px-4 py-2.5"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        <span>Mis Compras</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/shop/settings")}
                        className="cursor-pointer rounded-lg px-4 py-2.5"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Ajustes</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
                      <DropdownMenuItem
                        onClick={async () => {
                          await signOut({
                            redirect: false,
                            callbackUrl: "/shop",
                          });
                          router.push("/shop");
                          toast.success("Sesión cerrada exitosamente");
                        }}
                        className="cursor-pointer rounded-lg px-4 py-2.5 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => router.push("/login")}
                  className="rounded-full text-xs sm:text-xs"
                >
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-11 rounded-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full text-xs h-8 px-4 ${
                selectedCategory === "all"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full text-xs h-8 px-4 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              No se encontraron productos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
              >
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-xs">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(product.price)}
                    </span>
                    <Badge
                      variant={product.stock > 10 ? "default" : "secondary"}
                      className="text-xs h-5"
                    >
                      {product.stock} unidades
                    </Badge>
                  </div>
                  {product.sizes && product.sizes.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                        Tallas disponibles:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleAddToCart(product, size)}
                            disabled={product.stock === 0}
                            className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all duration-200 ${
                              product.stock === 0
                                ? "bg-gray-100 dark:bg-gray-900 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-800"
                                : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white hover:scale-105 border border-gray-200 dark:border-gray-800"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-9 text-xs font-medium"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      Agregar al Carrito
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
