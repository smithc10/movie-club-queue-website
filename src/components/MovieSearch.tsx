import { useState, useEffect, memo } from "react";
import type { Movie } from "@/types/movie";
import { tmdbApi } from "@/services/tmdb";
import { useDebounce } from "@/hooks/useDebounce";
import { MoviePoster } from "@/components/MoviePoster";
import { getMovieYear } from "@/lib/movieUtils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface MovieSearchProps {
  onAddToSchedule: (movie: Movie) => void;
}

const MovieResultItem = memo(
  ({ movie, onSelect }: { movie: Movie; onSelect: () => void }) => (
    <CommandItem
      key={movie.id}
      value={`${movie.id}-${movie.title}`}
      onSelect={onSelect}
      className="flex items-center gap-4 p-3 cursor-pointer rounded-lg data-[selected=true]:bg-blue-600/30 aria-selected:bg-blue-600/30 transition-colors"
    >
      <MoviePoster path={movie.poster_path} title={movie.title} />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white truncate text-base">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-400">
          {getMovieYear(movie.release_date)}
        </p>
      </div>
    </CommandItem>
  )
);
MovieResultItem.displayName = "MovieResultItem";

export default function MovieSearch({ onAddToSchedule }: MovieSearchProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 400);

  // Reset empty message when user types
  useEffect(() => {
    setShowEmptyMessage(false);
  }, [searchQuery]);

  // Handle search as user types
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setMovies([]);
      return;
    }

    const abortController = new AbortController();
    let emptyMessageTimer: ReturnType<typeof setTimeout>;

    const searchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await tmdbApi.searchMovies(
          debouncedQuery,
          abortController.signal
        );
        const results = data.results.slice(0, 10);
        setMovies(results);

        // Show empty message after 2s delay if no results
        if (results.length === 0) {
          emptyMessageTimer = setTimeout(() => {
            setShowEmptyMessage(true);
          }, 2000);
        }
      } catch (err) {
        // Ignore abort errors - these are expected when cancelling requests
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError("Failed to search movies.");
        console.error(err);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    searchMovies();

    // Cleanup: abort in-flight request when query changes or component unmounts
    return () => {
      abortController.abort();
      clearTimeout(emptyMessageTimer);
    };
  }, [debouncedQuery]);

  const handleSelectMovie = (movie: Movie) => {
    onAddToSchedule(movie);
    setSearchQuery("");
    setMovies([]);
  };

  return (
    <>
      <Command
        className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 [&_[cmdk-input-wrapper]]:border-none"
        shouldFilter={false}
      >
        <div className="relative">
          <CommandInput
            placeholder="What are we watching next week?"
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="text-xl pl-0 pr-4 py-6 h-auto border-none text-white placeholder:text-gray-500 font-light"
          />

          {loading && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
            </div>
          )}
        </div>

        {searchQuery && (
          <CommandList className="mt-3 bg-gray-800 border border-gray-700/50 rounded-2xl shadow-2xl max-h-96 overflow-y-auto will-change-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {(loading || showEmptyMessage) && (
              <CommandEmpty className="py-6 text-center text-gray-400 text-base">
                {loading
                  ? "Searching..."
                  : "No movies found. Try a different search."}
              </CommandEmpty>
            )}
            {movies.length > 0 && (
              <CommandGroup className="p-2 [&_[cmdk-group-items]]:space-y-1">
                {movies.map((movie) => (
                  <MovieResultItem
                    key={movie.id}
                    movie={movie}
                    onSelect={() => handleSelectMovie(movie)}
                  />
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>

      {error && (
        <div className="mt-4 bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm shadow-lg">
          {error}
        </div>
      )}
    </>
  );
}
