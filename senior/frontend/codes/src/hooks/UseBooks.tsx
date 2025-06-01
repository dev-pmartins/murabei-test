import { useEffect, useState } from "react";
import { Book } from "../types/Book";

interface UseBooksFilters {
  author?: string;
  title?: string;
  subjects?: string;
  publisher?: string;
  page?: number;
  page_size?: number;
}

interface UseBooksResult {
  books: Book[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalBooks: number;
}

export function useBooks(filters: UseBooksFilters = {}): UseBooksResult {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBooks, setTotalBooks] = useState(0);

  const page = filters.page || 1;
  const pageSize = filters.page_size || 20;

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    const sanitize = (value?: string) =>
      value ? value.trim().replace(/\s+/g, " ") : undefined;

    const author = sanitize(filters.author);
    const title = sanitize(filters.title);
    const subjects = sanitize(filters.subjects);
    const publisher = sanitize(filters.publisher);

    if (author) params.append("author", author);
    if (title) params.append("title", title);
    if (subjects) params.append("subjects", subjects);
    if (publisher) params.append("publisher", publisher);
    params.append("page", String(page));
    params.append("page_size", String(pageSize));

    const backendApi = process.env.NEXT_PUBLIC_BACKEND_API || "";
    fetch(`http://${backendApi}/books?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setBooks(json.data || []);
        setTotalBooks(json.total_books || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  }, [filters.author, filters.title, filters.subjects, filters.publisher, page, pageSize]);

  return { books, loading, error, page, pageSize, totalBooks };
}
