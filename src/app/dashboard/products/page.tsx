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
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
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
  image?: string | null;
  sizes?: string[];
  category?: {
    id: string;
    name: string;
  } | null;
  clientType?: {
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
      image: "",
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

  // Función para detectar el género basado en la categoría y tallas del producto
  const detectGenderFromProduct = (product: Product): string => {
    if (!product) return "";

    const categoryName = product.category?.name;
    const sizes = product.sizes || [];

    // Detectar basándose en categorías exclusivas primero
    if (categoryName) {
      // Categorías exclusivas de mujer (solo mujer)
      if (["Faldas", "Pijamas", "Terceras Piezas"].includes(categoryName)) {
        return "mujer";
      }
      // Categorías exclusivas de niña (solo niña)
      // Vestidos puede ser mujer o niña, pero si tiene tallas numéricas es niña
      if (["Vestidos"].includes(categoryName)) {
        const hasNumberSizes = sizes.some((s) =>
          ["4", "6", "8", "10", "12", "14", "16"].includes(s),
        );
        if (hasNumberSizes) return "niña";
        return "mujer";
      }
      // Categorías exclusivas de hombre (solo hombre)
      if (["Polos", "Ropa de Baño"].includes(categoryName)) {
        const hasNumberSizes = sizes.some((s) =>
          ["4", "6", "8", "10", "12", "14", "16"].includes(s),
        );
        if (hasNumberSizes) return "niño";
        return "hombre";
      }
    }

    // Si no se puede determinar por categorías exclusivas, usar tallas y categoría
    const hasNumberSizes = sizes.some((s) =>
      ["4", "6", "8", "10", "12", "14", "16"].includes(s),
    );
    const hasLetterSizes = sizes.some((s) =>
      ["XXS", "XS", "S", "M", "L", "XL"].includes(s),
    );

    if (hasNumberSizes) {
      // Tallas numéricas: niño o niña
      if (categoryName) {
        // Verificar si la categoría está en las categorías de niña
        if (categoriesByGender.niña.includes(categoryName)) {
          return "niña";
        }
        // Verificar si la categoría está en las categorías de niño
        if (categoriesByGender.niño.includes(categoryName)) {
          return "niño";
        }
      }
      // Si no se puede determinar, dejar vacío para que el usuario seleccione
      return "";
    }

    if (hasLetterSizes) {
      // Tallas de letras: mujer u hombre
      if (categoryName) {
        // Verificar si la categoría está solo en mujer (exclusiva)
        if (
          categoriesByGender.mujer.includes(categoryName) &&
          !categoriesByGender.hombre.includes(categoryName)
        ) {
          return "mujer";
        }
        // Verificar si la categoría está solo en hombre (exclusiva)
        if (
          categoriesByGender.hombre.includes(categoryName) &&
          !categoriesByGender.mujer.includes(categoryName)
        ) {
          return "hombre";
        }
        // Si la categoría está en ambos, intentar determinar por el contexto
        // Por defecto, si está en ambos y tiene tallas de letras, preferir mujer
        // (ya que mujer tiene más categorías)
        if (
          categoriesByGender.mujer.includes(categoryName) &&
          categoriesByGender.hombre.includes(categoryName)
        ) {
          // Para categorías compartidas, usar un heurístico simple
          // Si la categoría es común, preferir mujer por defecto
          return "mujer";
        }
      }
      // Si no se puede determinar, dejar vacío para que el usuario seleccione
      return "";
    }

    return "";
  };

  const validateAndSetImage = (file: File) => {
    // Validar tipo de archivo
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de archivo no permitido", {
        description: "Solo se permiten imágenes (JPEG, PNG, WEBP, GIF)",
      });
      return false;
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("Archivo demasiado grande", {
        description: "El tamaño máximo es 10MB",
      });
      return false;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue("image", "");
    // Resetear el input file
    const fileInput = document.getElementById(
      "image-upload",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      const detectedGender = detectGenderFromProduct(product);

      // Resetear el formulario con todos los datos del producto
      const formData = {
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        stock: product.stock.toString(),
        sizes: product.sizes || [],
        categoryId: product.category?.id || "",
        gender: detectedGender || "", // Si no se detecta, dejar vacío
        image: product.image || "",
      };

      form.reset(formData);

      // Establecer preview de imagen si existe
      if (product.image) {
        setImagePreview(product.image);
      } else {
        setImagePreview(null);
      }
      setSelectedImage(null);

      // Asegurarse de que el género se establezca correctamente
      if (detectedGender) {
        form.setValue("gender", detectedGender);
      }
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
        image: "",
      });
      setImagePreview(null);
      setSelectedImage(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setSelectedImage(null);
    setImagePreview(null);
    form.reset({
      name: "",
      description: "",
      price: "",
      stock: "",
      sizes: [],
      categoryId: "",
      gender: "",
      image: "",
    });
  };

  const onSubmit = async (data: ProductInput) => {
    try {
      let imageUrl = data.image || null;

      // Si hay una nueva imagen seleccionada, subirla primero
      if (selectedImage) {
        setIsUploadingImage(true);
        try {
          const formData = new FormData();
          formData.append("file", selectedImage);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || "Error al subir la imagen");
          }

          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        } catch (error: any) {
          toast.error("Error al subir la imagen", {
            description: error.message || "No se pudo subir la imagen",
          });
          setIsUploadingImage(false);
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

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
        image: imageUrl,
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
        searchKey={["name", "description", "category.name"]}
        searchPlaceholder="Buscar por nombre, descripción o categoría..."
        customFilter={(item, searchTerm) => {
          const product = item as Product;
          const term = searchTerm.toLowerCase();
          return (
            product.name.toLowerCase().includes(term) ||
            product.description?.toLowerCase().includes(term) ||
            product.category?.name?.toLowerCase().includes(term) ||
            product.price.toString().includes(term) ||
            product.stock.toString().includes(term)
          );
        }}
        filterOptions={[
          {
            key: "categoryId",
            label: "Categoría",
            options: [
              { value: "__all__", label: "Todas" },
              ...categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              })),
            ],
          },
          {
            key: "stock",
            label: "Stock",
            options: [
              { value: "__all__", label: "Todos" },
              { value: "in-stock", label: "En Stock (>0)" },
              { value: "out-of-stock", label: "Sin Stock (0)" },
              { value: "low-stock", label: "Stock Bajo (<10)" },
            ],
          },
        ]}
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

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen del Producto</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {!imagePreview ? (
                            <div
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                                isDragging
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                  : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 bg-gray-50 dark:bg-gray-900/50"
                              }`}
                            >
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                              />
                              <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                  <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Haz clic para subir o arrastra una imagen
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Formatos: JPEG, PNG, WEBP, GIF • Máximo 10MB
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="relative group">
                              <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                                <img
                                  src={imagePreview}
                                  alt="Vista previa"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"
                                    onClick={handleRemoveImage}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Eliminar
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center justify-center">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full"
                                  onClick={() => {
                                    document
                                      .getElementById("image-upload")
                                      ?.click();
                                  }}
                                >
                                  <ImageIcon className="h-4 w-4 mr-2" />
                                  Cambiar imagen
                                </Button>
                                <input
                                  id="image-upload"
                                  type="file"
                                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                  className="hidden"
                                  onChange={handleImageChange}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                      {/* Campo oculto para mantener el valor de la imagen en el formulario */}
                      <input
                        type="hidden"
                        {...field}
                        value={field.value || ""}
                      />
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
                          const previousGender = field.value;
                          field.onChange(value);
                          // Solo limpiar las tallas y categoría si el usuario cambia el género manualmente
                          // (no cuando se detecta automáticamente al editar)
                          if (previousGender && previousGender !== value) {
                            form.setValue("sizes", []);
                            form.setValue("categoryId", "");
                          }
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

                    // Si estamos editando y la categoría actual no está en las filtradas,
                    // agregarla para que se muestre
                    let categoriesToShow = [...filteredCategories];
                    if (editingProduct && editingProduct.category) {
                      const currentCategory = editingProduct.category;
                      const isInFiltered = filteredCategories.some(
                        (cat) => cat.id === currentCategory.id,
                      );
                      if (!isInFiltered && currentCategory) {
                        categoriesToShow = [
                          currentCategory,
                          ...filteredCategories,
                        ];
                      }
                    }

                    return (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select
                          value={field.value || "__none__"}
                          onValueChange={(value) =>
                            field.onChange(value === "__none__" ? "" : value)
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
                            <SelectItem value="__none__">
                              Sin categoría
                            </SelectItem>
                            {categoriesToShow.map((category) => (
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

              {(selectedGender ||
                (editingProduct &&
                  editingProduct.sizes &&
                  editingProduct.sizes.length > 0)) && (
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => {
                    const filteredSizes = getFilteredSizes();
                    // Si estamos editando y hay tallas pero no hay género seleccionado,
                    // mostrar todas las tallas disponibles para que el usuario pueda verlas
                    const sizesToShow = selectedGender
                      ? filteredSizes
                      : editingProduct &&
                          editingProduct.sizes &&
                          editingProduct.sizes.length > 0
                        ? sizes.filter((s) =>
                            editingProduct.sizes?.includes(s.name),
                          )
                        : [];

                    return (
                      <FormItem>
                        <FormLabel>Tallas Disponibles</FormLabel>
                        {!selectedGender &&
                          editingProduct &&
                          editingProduct.sizes &&
                          editingProduct.sizes.length > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              Selecciona una sección para ver todas las tallas
                              disponibles
                            </p>
                          )}
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {sizesToShow.map((size) => (
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
                  disabled={form.formState.isSubmitting || isUploadingImage}
                >
                  {form.formState.isSubmitting || isUploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isUploadingImage
                        ? "Subiendo imagen..."
                        : editingProduct
                          ? "Actualizando..."
                          : "Creando..."}
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
