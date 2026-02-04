import { useState, useCallback } from "react";
import type { Movie } from "@/types/movie";
import type { ScheduleEntry } from "@/types/schedule";
import { useAuthContext } from "@/contexts/AuthContext";
import LoginPage from "@/components/LoginPage";
import MovieSearch from "@/components/MovieSearch";
import Schedule from "@/components/Schedule";
import { movieToScheduleEntry } from "@/lib/movieUtils";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ExitIcon } from "@radix-ui/react-icons";

function App() {
  const { isLoggedIn, user, logout } = useAuthContext();
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);

  const handleAddToSchedule = useCallback((movie: Movie) => {
    let movieInSchedule = false;

    setSchedule((prev) => {
      const alreadyWatched = prev.some((entry) => entry.tmdbId === movie.id);

      if (alreadyWatched) {
        return prev;
      }

      movieInSchedule = true;
      return [...prev, movieToScheduleEntry(movie, prev.length + 1)];
    });

    // Toast outside setState to prevent duplicate notifications
    if (movieInSchedule) {
      toast.success(`Added "${movie.title}" to schedule!`);
    } else {
      toast.warning("This movie is already in your schedule!");
    }
  }, []);

  const handleRemoveFromSchedule = useCallback((tmdbId: number) => {
    setSchedule((prev) =>
      prev
        .filter((entry) => entry.tmdbId !== tmdbId)
        .map((entry, index) => ({ ...entry, order: index + 1 })),
    );
  }, []);

  if (!isLoggedIn) {
    return (
      <>
        <Toaster />
        <LoginPage />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col">
      <Toaster />

      <header className="py-8 max-w-4xl mx-auto px-6 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Movie Club Schedule</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-400 hover:text-white"
            >
              <ExitIcon className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 pb-12">
        <div className="w-full max-w-3xl space-y-12">
          <MovieSearch onAddToSchedule={handleAddToSchedule} />

          {schedule.length > 0 && (
            <section className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  Upcoming Schedule
                </h2>
                <span className="text-sm text-gray-400 bg-gray-800/80 px-4 py-2 rounded-full border border-gray-700">
                  {schedule.length} {schedule.length === 1 ? "movie" : "movies"}
                </span>
              </div>
              <Schedule
                schedule={schedule}
                onRemove={handleRemoveFromSchedule}
                onReorder={setSchedule}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
