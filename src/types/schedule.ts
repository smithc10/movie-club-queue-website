export interface ScheduleEntry {
  tmdbId: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  scheduledDate: string; // ISO date string
  order: number;
}
