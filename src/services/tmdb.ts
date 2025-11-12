import type { TMDBResponse } from "@/types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const tmdbApi = {
  // Get popular movies
  getPopularMovies: async (page: number = 1): Promise<TMDBResponse> => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch popular movies");
    }
    return response.json();
  },

  // Search movies
  searchMovies: async (
    query: string,
    page: number = 1
  ): Promise<TMDBResponse> => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`
    );
    if (!response.ok) {
      throw new Error("Failed to search movies");
    }
    return response.json();
  },

  // Get trending movies
  getTrendingMovies: async (
    timeWindow: "day" | "week" = "week"
  ): Promise<TMDBResponse> => {
    const response = await fetch(
      `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch trending movies");
    }
    return response.json();
  },
};
