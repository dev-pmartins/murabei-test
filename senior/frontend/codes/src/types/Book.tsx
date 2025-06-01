export interface Book {
  id: number;
  author: string;
  title: string;
  subjects: string;
  author_slug: string;
  biography?: string;
  format?: string;
  publisher?: string;
  pubdate?: string;
  dimensions?: string;
  overview?: string;
  synopsis?: string;
  toc?: string;
}
