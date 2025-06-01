"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Book } from "@/types/Book";
import AuthorBooks from './AuthorBooks';

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "author",
    header: "Autor",
  },
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "subjects",
    header: "Assuntos",
  },
  {
    accessorKey: "publisher",
    header: "Editora",
  }
];

export const defaultData: Book[] = [
  // {
  //   id: 1,
  //   author: "Autor 1",
  //   title: "Título 1",
  //   subjects: "Assunto 1",
  //   author_slug: "author-1",
  //   publisher: "Editora 1",
  // },
  // {
  //   id: 2,
  //   author: "Autor 2",
  //   title: "Título 2",
  //   subjects: "Assunto 2",
  //   author_slug: "author-2",
  //   publisher: "Editora 2",
  // },
  // {
  //   id: 3,
  //   author: "Autor 3",
  //   title: "Título 3",
  //   subjects: "Assunto 3",
  //   author_slug: "author-3",
  //   publisher: "Editora 3",
  // },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface BooksTableProps extends Partial<DataTableProps<Book, string>> {
  filters: {
    author: string;
    title: string;
    subjects: string;
    publisher: string;
  };
  setFilters: {
    setAuthor: (value: string) => void;
    setTitle: (value: string) => void;
    setSubjects: (value: string) => void;
    setPublisher: (value: string) => void;
  };
  page?: number;
  setPage: (page: number) => void;
  pageSize: number;
  totalBooks: number;
  onShowModal: (content: React.ReactNode) => void;
}

const BooksTable = ({
  columns: columnsProp = columns,
  data = defaultData,
  filters,
  setFilters,
  page,
  setPage,
  pageSize,
  totalBooks,
  onShowModal,
}: BooksTableProps) => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const totalPages = Math.ceil(totalBooks / pageSize);
  const table = useReactTable({
    data,
    columns: columnsProp,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const handleAuthorInfo = (author_slug: string, author: string) => {
    onShowModal(<AuthorBooks author_slug={author_slug} author={author} />);
  };

  return (
    <>
      <div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter authors..."
            value={filters.author}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilters.setAuthor(event.target.value)}
            className="max-w-sm"
          />

          <Input
            placeholder="Filter titles..."
            value={filters.title}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilters.setTitle(event.target.value)}
            className="max-w-sm ml-4"
          />

          <Input
            placeholder="Filter subjects..."
            value={filters.subjects}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilters.setSubjects(event.target.value)}
            className="max-w-sm ml-4"
          />

          <Input
            placeholder="Filter publisher..."
            value={filters.publisher}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilters.setPublisher(event.target.value)}
            className="max-w-sm ml-4"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: ReturnType<typeof table.getHeaderGroups>[number]) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: import("@tanstack/react-table").Header<Book, unknown>) => (
                  <TableHead key={header.id}>
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === "author") {
                      const author_slug = row.original.author_slug;
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          {author_slug && (
                            <a
                              className="ml-2 text-blue-600 hover:underline cursor-pointer text-xs align-top inline-block"
                              style={{ verticalAlign: "top", lineHeight: "1" }}
                              title="Ver outros livros deste autor"
                              onClick={() => handleAuthorInfo(author_slug, row.original.author)}
                              tabIndex={0}
                              role="button"
                            >
                              ?
                            </a>
                          )}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>

      <h2>
        Page {page} of {totalPages} ({totalBooks} total books)
      </h2>
    </>
  );
};

export default BooksTable;
