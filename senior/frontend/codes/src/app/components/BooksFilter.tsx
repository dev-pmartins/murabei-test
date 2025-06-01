import React from "react";
import { Input } from "@/components/ui/input";

interface BooksFilterProps {
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
}

const BooksFilter: React.FC<BooksFilterProps> = ({ filters, setFilters }) => (
<div className="mb-4 bg-white rounded-lg shadow p-4 flex flex-row flex-nowrap gap-4 items-end">
    <Input
        data-testid="filter-author"
        placeholder="Filtrar autor..."
        value={filters.author}
        onChange={e => setFilters.setAuthor(e.target.value)}
        className="max-w-xs"
    />
    <Input
        data-testid="filter-title"
        placeholder="Filtrar título..."
        value={filters.title}
        onChange={e => setFilters.setTitle(e.target.value)}
        className="max-w-xs"
    />
    <Input
        data-testid="filter-subjects"
        placeholder="Filtrar assuntos..."
        value={filters.subjects}
        onChange={e => setFilters.setSubjects(e.target.value)}
        className="max-w-xs"
    />
    <Input
        data-testid="filter-publisher"
        placeholder="Filtrar editora..."
        value={filters.publisher}
        onChange={e => setFilters.setPublisher(e.target.value)}
        className="max-w-xs"
    />
</div>
);

export default BooksFilter;
