import type { Movie } from '@/types/movie';
import { Card } from '@/components/ui/card';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const posterUrl = movie.poster_path 
    ? `${imageBaseUrl}${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <Card className="movie-card">
      <img 
        src={posterUrl} 
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="movie-year">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </span>
          <span className="movie-rating">
            ⭐ {movie.vote_average.toFixed(1)}
          </span>
        </div>
        <p className="movie-overview">
          {movie.overview || 'No overview available.'}
        </p>
      </div>
    </Card>
  );
};

export default MovieCard;
