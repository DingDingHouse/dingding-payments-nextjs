"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";
import Image from "next/image";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
}: DataTableProps<TData, TValue>) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const openPreview = (url: string) => setPreviewUrl(url);
  const closePreview = () => setPreviewUrl(null);

  return (
    <>
      <div className={`rounded-md border ${className}`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isImageColumn =
                      cell.column.columnDef.header === "Image" ||
                      cell.column.id === "image";

                    const cellValue = cell.getValue() as string;

                    return (
                      <TableCell key={cell.id} className="py-3">
                        {isImageColumn ? (
                          <Image
                            src={cellValue}
                            alt="Preview"
                            width={50}
                            height={50}
                            className="cursor-pointer object-cover rounded"
                            onClick={() => openPreview(cellValue)}
                          />
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={closePreview}
        >
          <div className="bg-white p-4 rounded shadow-lg max-w-full max-h-full">
            <Image
              src={previewUrl}
              alt="Full Preview"
              width={600}
              height={600}
              className="object-contain max-h-[80vh] max-w-[80vw]"
            />
          </div>
        </div>
      )}
    </>
  );
}
