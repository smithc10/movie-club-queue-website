import type { Movie } from "@/types/movie";
import type { ScheduleEntry } from "@/types/schedule";

export function movieToScheduleEntry(
  movie: Movie,
  order: number
): ScheduleEntry {
  return {
    tmdbId: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    scheduledDate: new Date().toISOString(),
    order,
  };
}

export function getMovieYear(releaseDate: string): string {
  return releaseDate ? new Date(releaseDate).getFullYear().toString() : "N/A";
}
