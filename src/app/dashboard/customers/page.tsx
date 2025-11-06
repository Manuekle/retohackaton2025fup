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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Edit, Trash2, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { PageLoading } from "@/components/dashboard/LoadingSkeleton";
import { toast } from "sonner";
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
import { customerSchema, type CustomerInput } from "@/lib/validations/customer";

type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const form = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersRes = await fetch("/api/customers");

        if (!customersRes.ok) {
          throw new Error("Error al cargar clientes");
        }

        const customersData = await customersRes.json();

        setCustomers(customersData);
      } catch {
        toast.error("Error al cargar los clientes", {
          description:
            "No se pudieron cargar los clientes. Por favor, recarga la página.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      form.reset({
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
      });
    } else {
      setEditingCustomer(null);
      form.reset({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCustomer(null);
    form.reset({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  const onSubmit = async (data: CustomerInput) => {
    try {
      const payload = {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
      };

      if (editingCustomer) {
        // Actualizar cliente
        const response = await fetch(`/api/customers/${editingCustomer.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el cliente");
        }

        const updatedCustomer = await response.json();
        setCustomers(
          customers.map((c) =>
            c.id === updatedCustomer.id ? updatedCustomer : c,
          ),
        );
        toast.success("Cliente actualizado exitosamente", {
          description: `El cliente "${data.name}" ha sido actualizado correctamente.`,
        });
      } else {
        // Crear cliente
        const response = await fetch("/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Error al crear el cliente");
        }

        const newCustomer = await response.json();
        setCustomers([newCustomer, ...customers]);
        toast.success("Cliente creado exitosamente", {
          description: `El cliente "${data.name}" ha sido creado correctamente.`,
        });
      }

      handleCloseDialog();
    } catch {
      toast.error(
        editingCustomer
          ? "Error al actualizar el cliente"
          : "Error al crear el cliente",
        {
          description:
            "No se pudo completar la acción. Por favor, intenta de nuevo.",
        },
      );
    }
  };

  const columns = [
    {
      key: "name",
      header: "Cliente",
      render: (_: unknown, row: Customer) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.name}
          </p>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {row.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>{row.email}</span>
              </div>
            )}
            {row.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>{row.phone}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "address",
      header: "Dirección",
      render: (_value: unknown, row: Customer) =>
        row.address ? (
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-xs">{row.address}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        ),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      render: (_: unknown, row: Customer) => (
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
              setCustomerToDelete(row);
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
            Clientes
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Gestiona tu base de clientes
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-full sm:w-auto"
          onClick={() => handleOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Nuevo Cliente</span>
          <span className="sm:hidden">Nuevo</span>
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        data={customers}
        columns={columns}
        searchKey={["name", "email", "phone", "address"]}
        searchPlaceholder="Buscar por nombre, email, teléfono o dirección..."
        customFilter={(item, searchTerm) => {
          const customer = item as Customer;
          const term = searchTerm.toLowerCase();
          return (
            customer.name.toLowerCase().includes(term) ||
            customer.email?.toLowerCase().includes(term) ||
            customer.phone?.toLowerCase().includes(term) ||
            customer.address?.toLowerCase().includes(term)
          );
        }}
        filterOptions={[]}
        itemsPerPage={10}
        emptyMessage="No hay clientes registrados"
      />

      {/* Dialog Nuevo/Editar Cliente */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-heading">
              {editingCustomer ? "Editar Cliente" : "Nuevo Cliente"}
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
                          placeholder="Nombre completo del cliente"
                          className="h-10 rounded-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="ejemplo@correo.com"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+57 300 123 4567"
                            className="h-10 rounded-full"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Dirección del cliente"
                          className="h-10 rounded-full"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                      {editingCustomer ? "Actualizando..." : "Creando..."}
                    </>
                  ) : (
                    <>{editingCustomer ? "Actualizar" : "Crear"} Cliente</>
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
              ¿Eliminar cliente?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              cliente{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {customerToDelete?.name}
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
                if (!customerToDelete) return;

                try {
                  const response = await fetch(
                    `/api/customers/${customerToDelete.id}`,
                    {
                      method: "DELETE",
                    },
                  );
                  if (response.ok) {
                    setCustomers(
                      customers.filter((c) => c.id !== customerToDelete.id),
                    );
                    toast.success("Cliente eliminado exitosamente", {
                      description: `El cliente "${customerToDelete.name}" ha sido eliminado correctamente.`,
                    });
                    setIsDeleteDialogOpen(false);
                    setCustomerToDelete(null);
                  } else {
                    throw new Error("Error al eliminar");
                  }
                } catch {
                  toast.error("Error al eliminar el cliente", {
                    description:
                      "No se pudo eliminar el cliente. Por favor, intenta de nuevo.",
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
