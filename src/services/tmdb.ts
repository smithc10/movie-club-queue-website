import type { TMDBResponse } from "@/types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  console.error(
    "TMDB API key is not configured. Please add VITE_TMDB_API_KEY to your .env file"
  );
}

export const tmdbApi = {
  async searchMovies(
    query: string,
    signal?: AbortSignal
  ): Promise<TMDBResponse> {
    if (!API_KEY) {
      throw new Error("TMDB API key is not configured");
    }

    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`,
      { signal }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.status_message || "Failed to search movies");
    }

    return response.json();
  },
};
