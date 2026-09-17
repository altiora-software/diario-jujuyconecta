export type ExternalNewsArticle = {
  title?: string | null;
  description?: string | null;
  publishedAt?: string | null;
  urlToImage?: string | null;
  url?: string | null;
  source?: {
    name?: string | null;
  } | null;
};

export type ExternalNewsResponse = {
  status?: string;
  articles?: ExternalNewsArticle[];
  message?: string;
};
