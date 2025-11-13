export interface CatechismResult {
  number: number;
  text: string;
  topic: string;
  reference?: string;
}

export interface SearchState {
  query: string;
  results: CatechismResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}