import React from "react";
import { Book } from "@/types/Book";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useAuthorBooks } from "@/hooks/useAuthorBooks";

interface AuthorBooksProps {
  author_slug: string;
  author: string;
  name?: string;
}

const AuthorBooks: React.FC<AuthorBooksProps> = ({ author_slug, author, name }) => {
  console.log("AuthorBooks component rendered with author_slug:", author_slug, "and author:", author);
  const { books, loading, error } = useAuthorBooks(author_slug, name);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Livros de {author}</h3>
      {loading && <div>Carregando...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Editora</TableHead>
              <TableHead>Assuntos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Nenhum livro encontrado.</TableCell>
              </TableRow>
            ) : (
              books.map((book: Book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.publisher}</TableCell>
                  <TableCell>{book.subjects}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AuthorBooks;
