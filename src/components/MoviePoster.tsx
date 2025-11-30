import { getTmdbImageUrl } from "@/lib/imageUtils";

interface MoviePosterProps {
  path: string | null;
  title: string;
  size?: "w92" | "w200" | "w500";
  className?: string;
}

export function MoviePoster({
  path,
  title,
  size = "w92",
  className = "w-10 h-15",
}: MoviePosterProps) {
  const imageUrl = getTmdbImageUrl(path, size);

  return imageUrl ? (
    <img
      src={imageUrl}
      alt={title}
      className={`${className} object-cover rounded`}
    />
  ) : (
    <div
      className={`${className} bg-gray-700 rounded flex items-center justify-center text-gray-500 text-xs`}
    >
      🎬
    </div>
  );
}
