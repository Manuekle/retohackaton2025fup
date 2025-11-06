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
  Package,
  Trash2,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { PageLoading } from "@/components/dashboard/LoadingSkeleton";
import { Separator } from "@/components/ui/separator";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string | null;
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

type GenderSection = "all" | "niño" | "niña" | "mujer" | "hombre";

// Tallas típicas para cada sección
const GENDER_SIZES = {
  niño: ["4", "6", "8", "10", "12", "14", "16"],
  niña: ["4", "6", "8", "10", "12", "14", "16"],
  mujer: ["XXS", "XS", "S", "M", "L", "XL"],
  hombre: ["XXS", "XS", "S", "M", "L", "XL"],
};

export default function ShopPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getItemCount,
    getTotal,
    isLoading: cartLoading,
  } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<GenderSection>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined,
  );

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

  // Función para determinar si un producto pertenece a una sección de género
  const productBelongsToGender = (
    product: Product,
    gender: GenderSection,
  ): boolean => {
    if (gender === "all") return true;
    if (!product.sizes || product.sizes.length === 0) return false;

    const genderSizes = GENDER_SIZES[gender];
    // Verificar si el producto tiene al menos una talla de la sección
    return product.sizes.some((size) => genderSizes.includes(size));
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category?.id === selectedCategory;

    const matchesGender = productBelongsToGender(product, selectedGender);

    const hasStock = product.stock > 0;

    return matchesSearch && matchesCategory && matchesGender && hasStock;
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

    try {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: size || undefined,
        stock: product.stock,
        image: product.image || undefined,
      });

      toast.success("Producto agregado al carrito", {
        description: `${product.name}${size ? ` (Talla: ${size})` : ""} agregado correctamente.`,
      });

      // Cerrar el dialog si está abierto
      setIsProductDialogOpen(false);
      setSelectedProduct(null);
      setSelectedSize(undefined);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al agregar al carrito",
      );
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(undefined);
    setIsProductDialogOpen(true);
  };

  const handleCartItemRemove = (productId: string, size?: string) => {
    removeFromCart(productId, size);
    toast.success("Producto eliminado del carrito");
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    {getItemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">
                        {getItemCount()}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 rounded-xl border-gray-200 dark:border-gray-800 shadow-lg p-0"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Carrito de Compras
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {getItemCount()}{" "}
                      {getItemCount() === 1 ? "producto" : "productos"}
                    </p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="p-8 text-center">
                        <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Tu carrito está vacío
                        </p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {cart.map((item, index) => (
                          <div
                            key={`${item.productId}-${item.size || index}`}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                {item.name}
                              </p>
                              {item.size && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Talla: {item.size}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full"
                                    onClick={() => {
                                      const newQuantity = item.quantity - 1;
                                      updateQuantity(
                                        item.productId,
                                        newQuantity,
                                        item.size,
                                      );
                                    }}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-xs font-medium w-6 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full"
                                    onClick={() => {
                                      updateQuantity(
                                        item.productId,
                                        item.quantity + 1,
                                        item.size,
                                      );
                                    }}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() =>
                                handleCartItemRemove(item.productId, item.size)
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {cart.length > 0 && (
                    <>
                      <Separator className="bg-gray-200 dark:bg-gray-800" />
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            Total:
                          </span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(getTotal())}
                          </span>
                        </div>
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                          onClick={() => {
                            router.push("/shop/cart");
                          }}
                        >
                          Ver Carrito Completo
                        </Button>
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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

          {/* Gender Sections */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Secciones:
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedGender === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGender("all")}
                className={`rounded-full text-xs h-8 px-4 ${
                  selectedGender === "all"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                Todas
              </Button>
              <Button
                variant={selectedGender === "niño" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGender("niño")}
                className={`rounded-full text-xs h-8 px-4 ${
                  selectedGender === "niño"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                Niño
              </Button>
              <Button
                variant={selectedGender === "niña" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGender("niña")}
                className={`rounded-full text-xs h-8 px-4 ${
                  selectedGender === "niña"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                Niña
              </Button>
              <Button
                variant={selectedGender === "mujer" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGender("mujer")}
                className={`rounded-full text-xs h-8 px-4 ${
                  selectedGender === "mujer"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                Mujer
              </Button>
              <Button
                variant={selectedGender === "hombre" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGender("hombre")}
                className={`rounded-full text-xs h-8 px-4 ${
                  selectedGender === "hombre"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                Hombre
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Categorías:
            </h3>
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
                className="group border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <img
                    src={product.image || "/fallback.png"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.currentTarget.src = "/fallback.png";
                    }}
                  />
                </div>
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
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-9 text-xs font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                    disabled={product.stock === 0}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Product Detail Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold tracking-heading">
                  {selectedProduct.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedProduct.description || "Sin descripción"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Image */}
                <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={selectedProduct.image || "/fallback.png"}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/fallback.png";
                    }}
                  />
                </div>

                {/* Price and Stock */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(selectedProduct.price)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Precio unitario
                    </p>
                  </div>
                  <Badge
                    variant={
                      selectedProduct.stock > 10 ? "default" : "secondary"
                    }
                    className="text-xs h-6 px-3"
                  >
                    {selectedProduct.stock} unidades disponibles
                  </Badge>
                </div>

                {/* Category */}
                {selectedProduct.category && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoría:
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {selectedProduct.category.name}
                    </Badge>
                  </div>
                )}

                {/* Sizes */}
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      Selecciona una talla:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          disabled={selectedProduct.stock === 0}
                          className={`px-4 py-2 text-sm rounded-full font-medium transition-all duration-200 border-2 ${
                            selectedSize === size
                              ? "bg-blue-600 text-white border-blue-600 scale-105"
                              : selectedProduct.stock === 0
                                ? "bg-gray-100 dark:bg-gray-900 text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-800"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Add to Cart Button */}
                <div className="pt-4">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 text-sm font-semibold"
                    onClick={() =>
                      handleAddToCart(selectedProduct, selectedSize)
                    }
                    disabled={
                      selectedProduct.stock === 0 ||
                      (selectedProduct.sizes &&
                        selectedProduct.sizes.length > 0 &&
                        !selectedSize)
                    }
                  >
                    {selectedProduct.stock === 0
                      ? "Sin Stock"
                      : selectedProduct.sizes &&
                          selectedProduct.sizes.length > 0 &&
                          !selectedSize
                        ? "Selecciona una talla"
                        : "Agregar al Carrito"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
