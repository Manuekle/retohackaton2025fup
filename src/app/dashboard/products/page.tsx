"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { PageLoading } from "@/components/dashboard/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { productSchema, type ProductInput } from "@/lib/validations/product";

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

type Size = {
  id: string;
  name: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      sizes: [],
      categoryId: "",
      gender: "",
    },
  });

  const selectedGender = form.watch("gender");

  // Mapeo de categorías por género
  const categoriesByGender: Record<string, string[]> = {
    mujer: [
      "Abrigos",
      "Bermudas",
      "Buzos",
      "Camisas",
      "Faldas",
      "Hogar",
      "Jeans",
      "Pantalones",
      "Pijamas",
      "Ropa Interior",
      "Terceras Piezas",
      "T-Shirts",
      "Vestidos",
    ],
    hombre: [
      "Abrigos",
      "Bermudas",
      "Buzos",
      "Camisas",
      "Hogar",
      "Jeans",
      "Pantalones",
      "Polos",
      "Ropa de Baño",
      "Ropa Interior",
      "T-Shirts",
    ],
    niño: [
      "Bermudas",
      "Buzos",
      "Camisas",
      "Jeans",
      "Pantalones",
      "Polos",
      "Ropa de Baño",
      "T-Shirts",
    ],
    niña: [
      "Abrigos",
      "Bermudas",
      "Buzos",
      "Camisas",
      "Faldas",
      "Jeans",
      "Pantalones",
      "Terceras Piezas",
      "T-Shirts",
      "Vestidos",
    ],
  };

  // Obtener categorías filtradas por género
  const getFilteredCategories = () => {
    if (!selectedGender || !categories.length) return categories;
    const allowedCategories = categoriesByGender[selectedGender] || [];
    return categories.filter((cat) => allowedCategories.includes(cat.name));
  };

  // Obtener tallas filtradas por género
  const getFilteredSizes = () => {
    if (!selectedGender || !sizes.length) return [];

    const numberSizes = ["4", "6", "8", "10", "12", "14", "16"];
    const letterSizes = ["XXS", "XS", "S", "M", "L", "XL"];

    if (selectedGender === "niño" || selectedGender === "niña") {
      return sizes.filter((s) => numberSizes.includes(s.name));
    } else if (selectedGender === "mujer" || selectedGender === "hombre") {
      return sizes.filter((s) => letterSizes.includes(s.name));
    }

    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, sizesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/sizes"),
        ]);

        if (!productsRes.ok) {
          throw new Error("Error al cargar productos");
        }

        const [productsData, categoriesData, sizesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.ok ? categoriesRes.json() : [],
          sizesRes.ok ? sizesRes.json() : [],
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setSizes(sizesData);
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

  // Función para detectar el género basado en las tallas del producto
  const detectGenderFromSizes = (sizes: string[]): string => {
    if (!sizes || sizes.length === 0) return "";

    const hasNumberSizes = sizes.some((s) =>
      ["4", "6", "8", "10", "12", "14", "16"].includes(s),
    );
    const hasLetterSizes = sizes.some((s) =>
      ["XXS", "XS", "S", "M", "L", "XL"].includes(s),
    );

    if (hasNumberSizes) {
      // Podría ser niño o niña, pero no podemos determinarlo solo con las tallas
      // Por defecto, dejamos que el usuario lo seleccione
      return "";
    }
    if (hasLetterSizes) {
      // Podría ser mujer u hombre, pero no podemos determinarlo solo con las tallas
      return "";
    }
    return "";
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      const detectedGender = detectGenderFromSizes(product.sizes || []);
      form.reset({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        stock: product.stock.toString(),
        sizes: product.sizes || [],
        categoryId: product.category?.id || "",
        gender: detectedGender,
      });
    } else {
      setEditingProduct(null);
      form.reset({
        name: "",
        description: "",
        price: "",
        stock: "",
        sizes: [],
        categoryId: "",
        gender: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    form.reset({
      name: "",
      description: "",
      price: "",
      stock: "",
      sizes: [],
      categoryId: "",
      gender: "",
    });
  };

  const onSubmit = async (data: ProductInput) => {
    try {
      const payload = {
        name: data.name,
        description: data.description || null,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        sizes: data.sizes || [],
        categoryId:
          data.categoryId === "none" || !data.categoryId
            ? null
            : data.categoryId,
      };

      if (editingProduct) {
        // Actualizar producto
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el producto");
        }

        const updatedProduct = await response.json();
        setProducts(
          products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p,
          ),
        );
        toast.success("Producto actualizado exitosamente", {
          description: `El producto "${data.name}" ha sido actualizado correctamente.`,
        });
      } else {
        // Crear producto
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Error al crear el producto");
        }

        const newProduct = await response.json();
        setProducts([newProduct, ...products]);
        toast.success("Producto creado exitosamente", {
          description: `El producto "${data.name}" ha sido creado correctamente.`,
        });
      }

      handleCloseDialog();
    } catch {
      toast.error(
        editingProduct
          ? "Error al actualizar el producto"
          : "Error al crear el producto",
        {
          description:
            "No se pudo completar la acción. Por favor, intenta de nuevo.",
        },
      );
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Agotado</Badge>;
    } else if (stock < 10) {
      return <Badge variant="secondary">Stock Bajo</Badge>;
    } else {
      return <Badge variant="default">En Stock</Badge>;
    }
  };

  const columns = [
    {
      key: "name",
      header: "Producto",
      render: (_: unknown, row: Product) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.name}
          </p>
          {row.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md">
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Categoría",
      render: (_: unknown, row: Product) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {row.category?.name || "Sin categoría"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Precio",
      className: "text-right",
      render: (_: unknown, row: Product) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(row.price)}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      className: "text-right",
      render: (_: unknown, row: Product) => (
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs font-medium">{row.stock}</span>
          {getStockBadge(row.stock)}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      render: (_: unknown, row: Product) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => handleOpenDialog(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-red-600 hover:text-red-700"
            onClick={() => {
              setProductToDelete(row);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-heading text-gray-900 dark:text-white">
            Productos
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Gestiona tu catálogo de productos
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-full sm:w-auto"
          onClick={() => handleOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Nuevo Producto</span>
          <span className="sm:hidden">Nuevo</span>
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        data={products}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Buscar productos..."
        itemsPerPage={10}
        emptyMessage="No hay productos registrados"
      />

      {/* Dialog Nuevo/Editar Producto */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-heading">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre del producto"
                          className="h-10 rounded-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Descripción del producto"
                          className="h-10 rounded-full"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="h-10 rounded-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="h-10 rounded-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sección *</FormLabel>
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Limpiar las tallas y categoría cuando se cambia el género
                          form.setValue("sizes", []);
                          form.setValue("categoryId", "");
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 rounded-full">
                            <SelectValue placeholder="Seleccionar sección" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="niño">Niño</SelectItem>
                          <SelectItem value="niña">Niña</SelectItem>
                          <SelectItem value="mujer">Mujer</SelectItem>
                          <SelectItem value="hombre">Hombre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => {
                    const filteredCategories = selectedGender
                      ? getFilteredCategories()
                      : categories;
                    return (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select
                          value={field.value || "none"}
                          onValueChange={(value) =>
                            field.onChange(value === "none" ? "" : value)
                          }
                          disabled={!selectedGender}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 rounded-full">
                              <SelectValue
                                placeholder={
                                  selectedGender
                                    ? "Seleccionar categoría"
                                    : "Primero selecciona una sección"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Sin categoría</SelectItem>
                            {filteredCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!selectedGender && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Selecciona una sección primero para ver las
                            categorías disponibles
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              {selectedGender && (
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => {
                    const filteredSizes = getFilteredSizes();
                    return (
                      <FormItem>
                        <FormLabel>Tallas Disponibles</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {filteredSizes.map((size) => (
                                <button
                                  key={size.id}
                                  type="button"
                                  onClick={() => {
                                    const currentSizes = field.value || [];
                                    const newSizes = currentSizes.includes(
                                      size.name,
                                    )
                                      ? currentSizes.filter(
                                          (s) => s !== size.name,
                                        )
                                      : [...currentSizes, size.name];
                                    field.onChange(newSizes);
                                  }}
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                    (field.value || []).includes(size.name)
                                      ? "bg-blue-600 text-white hover:bg-blue-700"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                  }`}
                                >
                                  {size.name}
                                </button>
                              ))}
                            </div>
                            {field.value && field.value.length > 0 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Tallas seleccionadas: {field.value.join(", ")}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="rounded-full"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 rounded-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingProduct ? "Actualizando..." : "Creando..."}
                    </>
                  ) : (
                    <>{editingProduct ? "Actualizar" : "Crear"} Producto</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog para eliminar */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white text-2xl font-semibold tracking-heading">
              ¿Eliminar producto?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              producto{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {productToDelete?.name}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white rounded-full"
              onClick={async () => {
                if (!productToDelete) return;

                try {
                  const response = await fetch(
                    `/api/products/${productToDelete.id}`,
                    {
                      method: "DELETE",
                    },
                  );
                  if (response.ok) {
                    setProducts(
                      products.filter((p) => p.id !== productToDelete.id),
                    );
                    toast.success("Producto eliminado exitosamente", {
                      description: `El producto "${productToDelete.name}" ha sido eliminado correctamente.`,
                    });
                    setIsDeleteDialogOpen(false);
                    setProductToDelete(null);
                  } else {
                    throw new Error("Error al eliminar");
                  }
                } catch {
                  toast.error("Error al eliminar el producto", {
                    description:
                      "No se pudo eliminar el producto. Por favor, intenta de nuevo.",
                  });
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
