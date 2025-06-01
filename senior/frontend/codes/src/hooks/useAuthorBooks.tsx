import { useEffect, useState } from "react";
import { Book } from "../types/Book";

export function useAuthorBooks(author_slug?: string, name?: string) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!author_slug) return;

    setLoading(true);
    setError(null);

    const params = name ? `?name=${encodeURIComponent(name)}` : "";
    const backendApi = process.env.NEXT_PUBLIC_BACKEND_API || "";
    fetch(`http://${backendApi}/books/author/${author_slug}${params}`)
      .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar livros do autor");
      return res.json();
      })
      .then((data) => setBooks(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [author_slug, name]);

  return { books, loading, error };
}
