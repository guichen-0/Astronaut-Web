export type EntityType = "planet" | "star" | "constellation" | "article";

export interface SearchResult {
  id: string;
  entityType: EntityType;
  title: string;
  description: string;
  imageUrl?: string;
  slug?: string;
  rank: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
