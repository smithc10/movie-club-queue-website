import { useState, useEffect } from 'react'
import type { Movie } from '@/types/movie'
import { tmdbApi } from '@/services/tmdb'
import MovieCard from '@/components/MovieCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPopularMovies()
  }, [])

  const fetchPopularMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await tmdbApi.getPopularMovies()
      setMovies(data.results)
    } catch (err) {
      setError('Failed to fetch movies. Please check your API key.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      fetchPopularMovies()
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await tmdbApi.searchMovies(searchQuery)
      setMovies(data.results)
    } catch (err) {
      setError('Failed to search movies.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 Movie Club Queue</h1>
        <form onSubmit={handleSearch} className="search-form">
          <Input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <Button type="submit">Search</Button>
          {searchQuery && (
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => {
                setSearchQuery('')
                fetchPopularMovies()
              }}
            >
              Clear
            </Button>
          )}
        </form>
      </header>

      <main className="app-main">
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : (
          <div className="movies-grid">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            ) : (
              <div className="no-results">No movies found.</div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
