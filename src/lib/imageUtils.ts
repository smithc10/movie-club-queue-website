const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function getTmdbImageUrl(
  path: string | null,
  size: "w92" | "w200" | "w500" = "w92"
): string | null {
  return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;
}
