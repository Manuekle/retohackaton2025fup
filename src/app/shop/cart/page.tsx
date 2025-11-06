"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/lib/hooks/use-cart";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageLoading } from "@/components/dashboard/LoadingSkeleton";

type ClientType = {
  id: string;
  name: string;
};

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    isLoading,
  } = useCart();
  const [clientTypes, setClientTypes] = useState<ClientType[]>([]);
  const [selectedClientType, setSelectedClientType] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingClientTypes, setIsLoadingClientTypes] = useState(true);

  // Datos del cliente para la compra
  const [customerName, setCustomerName] = useState(session?.user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(
    session?.user?.email || "",
  );
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar tipos de cliente
        const clientTypesRes = await fetch("/api/client-types");
        if (clientTypesRes.ok) {
          const clientTypesData = await clientTypesRes.json();
          setClientTypes(clientTypesData);
        }
      } catch {
        toast.error("Error al cargar los datos");
      } finally {
        setIsLoadingClientTypes(false);
      }
    };

    fetchData();
  }, []);

  // Prellenar campos con datos del usuario si está logueado
  useEffect(() => {
    if (session?.user) {
      if (!customerName && session.user.name) {
        setCustomerName(session.user.name);
      }
      if (!customerEmail && session.user.email) {
        setCustomerEmail(session.user.email);
      }
    }
  }, [session, customerName, customerEmail]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    // Validar datos del cliente
    if (!customerName.trim()) {
      toast.error("El nombre del cliente es requerido");
      return;
    }

    if (!customerEmail.trim()) {
      toast.error("El email del cliente es requerido");
      return;
    }

    setIsProcessing(true);

    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity.toString(),
        price: item.price.toString(),
        size: item.size || undefined,
      }));

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim() || undefined,
          customerAddress: customerAddress.trim() || undefined,
          clientTypeId: selectedClientType || undefined,
          items,
          total: getTotal().toString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al procesar la venta");
      }

      clearCart();
      toast.success("Compra realizada exitosamente", {
        description: `Venta por ${formatCurrency(getTotal())} registrada correctamente.`,
      });
      router.push("/shop");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo registrar la venta. Por favor, intenta de nuevo.";
      toast.error("Error al procesar la venta", {
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/shop")}
                className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-heading text-gray-900 dark:text-white">
                  Carrito
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {cart.length} {cart.length === 1 ? "producto" : "productos"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
            <div className="rounded-full bg-gray-100 dark:bg-gray-900 p-6 mb-6">
              <ShoppingCart className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            </div>
            <h2 className="text-xl font-bold tracking-heading text-gray-900 dark:text-white mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
              Agrega productos a tu carrito para comenzar a comprar
            </p>
            <Button
              onClick={() => router.push("/shop")}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-11 px-6 font-medium"
            >
              Explorar Productos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              <div className="mb-4">
                <h2 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
                  Productos en el Carrito
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {cart.length} {cart.length === 1 ? "producto" : "productos"}
                </p>
              </div>
              {cart.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size || index}`}
                  className="group border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-xs text-gray-900 dark:text-white mb-2">
                            {item.name}
                          </h3>
                          {item.size && (
                            <Badge
                              variant="outline"
                              className="text-xs h-5 border-gray-200 dark:border-gray-700"
                            >
                              Talla: {item.size}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(item.price)} c/u
                        </p>
                        <span className="text-gray-300 dark:text-gray-700">
                          •
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-3 py-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.size,
                              )
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-10 text-center text-xs font-semibold text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1,
                                item.size,
                              )
                            }
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-xs font-medium"
                          onClick={() =>
                            removeFromCart(item.productId, item.size)
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Summary */}
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Resumen de Compra */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-bold tracking-heading mb-6 text-gray-900 dark:text-white">
                  Resumen de Compra
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Subtotal ({cart.length}{" "}
                      {cart.length === 1 ? "producto" : "productos"}):
                    </span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {formatCurrency(getTotal())}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(getTotal())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h3 className="text-xs font-bold tracking-heading mb-4 text-gray-900 dark:text-white">
                  Información del Cliente
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Ingresa tu nombre completo"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="rounded-full h-10 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="rounded-full h-10 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Teléfono (opcional)
                    </label>
                    <Input
                      type="tel"
                      placeholder="+57 300 000 0000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="rounded-full h-10 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Dirección (opcional)
                    </label>
                    <Input
                      placeholder="Dirección de entrega"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="rounded-full h-10 text-xs"
                    />
                  </div>
                  {clientTypes.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                        Tipo de Cliente (opcional)
                      </label>
                      <Select
                        value={selectedClientType || "none"}
                        onValueChange={(value) =>
                          setSelectedClientType(value === "none" ? "" : value)
                        }
                      >
                        <SelectTrigger className="rounded-full h-10 text-xs">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin tipo</SelectItem>
                          {clientTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de Compra */}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 font-semibold text-xs shadow-sm hover:shadow-md transition-all"
                onClick={handleCheckout}
                disabled={
                  isProcessing || !customerName.trim() || !customerEmail.trim()
                }
              >
                {isProcessing ? (
                  <>
                    <span className="mr-2">Procesando...</span>
                  </>
                ) : (
                  "Realizar Compra"
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
