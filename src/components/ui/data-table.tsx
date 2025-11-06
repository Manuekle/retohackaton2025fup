"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Pagination } from "./pagination";
import { cn } from "@/lib/utils/utils";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T | string;
  searchPlaceholder?: string;
  filterOptions?: {
    key: keyof T | string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  itemsPerPage?: number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchKey,
  searchPlaceholder = "Buscar...",
  filterOptions = [],
  itemsPerPage = 10,
  onRowClick,
  emptyMessage = "No hay datos disponibles",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Aplicar filtros
  let filteredData = data;

  if (searchTerm && searchKey) {
    filteredData = filteredData.filter((item) => {
      const value = item[searchKey as keyof T];
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  filterOptions.forEach((filter) => {
    if (filters[filter.key as string]) {
      filteredData = filteredData.filter(
        (item) => item[filter.key as keyof T] === filters[filter.key as string],
      );
    }
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm || Object.values(filters).some((f) => f !== "");

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 space-y-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="flex flex-col sm:flex-row gap-4">
          {searchKey && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-full focus:bg-white dark:focus:bg-gray-950"
              />
            </div>
          )}
          {filterOptions.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {filterOptions.map((filter) => (
                <Select
                  key={filter.key as string}
                  value={filters[filter.key as string] || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(filter.key as string, value)
                  }
                >
                  <SelectTrigger className="w-[180px] h-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-full">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-10 rounded-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          )}
        </div>
        {hasActiveFilters && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Mostrando {paginatedData.length} de {filteredData.length} resultados
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-white dark:bg-black">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-800 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    "font-semibold text-gray-500 dark:text-gray-400",
                    column.className,
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={cn(
                    "border-gray-200 dark:border-gray-800 transition-colors",
                    onRowClick &&
                      "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900",
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className={cn(
                        "text-gray-900 dark:text-white",
                        column.className,
                      )}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
