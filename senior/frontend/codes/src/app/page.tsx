"use client"

import React, { useState } from 'react';
import { useBooks } from "@/hooks/UseBooks";
import { useDebounce } from "@/hooks/useDebounce";
import { Book } from "@/types/Book";
import BooksTable from './components/BooksTable';
import Modal from './components/Modal';

export default function Home() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [subjects, setSubjects] = useState("");
  const [publisher, setPublisher] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const debouncedAuthor = useDebounce(author, 500);
  const debouncedTitle = useDebounce(title, 500);
  const debouncedSubjects = useDebounce(subjects, 500);
  const debouncedPublisher = useDebounce(publisher, 500);

  const { books, loading, error, totalBooks } = useBooks({
    author: debouncedAuthor,
    title: debouncedTitle,
    subjects: debouncedSubjects,
    publisher: debouncedPublisher,
    page,
    page_size: pageSize,
  });

  React.useEffect(() => {
    setPage(1);
  }, [debouncedAuthor, debouncedTitle, debouncedSubjects, debouncedPublisher]);

  // Handler para abrir modal de livros do autor
  const handleOpenModal = (content: React.ReactNode) => {
    setModalOpen(true);
    setModalContent(content);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></span>
      <span className="ml-4 text-blue-700 font-medium">Carregando...</span>
    </div>
  );
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Catálogo de Livros
        </h1>
        <BooksTable
          data={books}
          filters={{ author, title, subjects, publisher }}
          setFilters={{ setAuthor, setTitle, setSubjects, setPublisher }}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          totalBooks={totalBooks}
          onShowModal={handleOpenModal}
        />
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalContent}
      </Modal>
    </main>
  );
}
