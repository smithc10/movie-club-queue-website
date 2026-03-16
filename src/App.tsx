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
import { ExitIcon, SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { useThemeContext } from "@/contexts/ThemeContext";

function App() {
  const { isLoggedIn, user, isLoading, handleLogout } = useAuthContext();
  const { theme, toggleTheme } = useThemeContext();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-lg">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <Toaster />
        <LoginPage />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster />

      <header className="bg-[var(--color-header)] py-6 px-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-[var(--color-header-foreground)]">Movie Club Schedule</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-[var(--color-header-muted)] hover:text-[var(--color-header-foreground)] hover:bg-black/10 h-8 w-8"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </Button>
            <span className="text-sm text-[var(--color-header-muted)]">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-[var(--color-header-muted)] hover:text-[var(--color-header-foreground)] hover:bg-black/10"
            >
              <ExitIcon className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 pt-10 pb-12">
        <div className="w-full max-w-3xl space-y-12">
          <MovieSearch onAddToSchedule={handleAddToSchedule} />

          {schedule.length > 0 && (
            <section className="bg-card rounded-2xl border border-border p-8 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Upcoming Schedule
                </h2>
                <span className="text-sm text-muted-foreground bg-secondary px-4 py-2 rounded-full border border-border">
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
