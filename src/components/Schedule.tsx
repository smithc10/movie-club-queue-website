import { useState, memo } from "react";
import type { ScheduleEntry } from "@/types/schedule";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoviePoster } from "@/components/MoviePoster";
import { getMovieYear } from "@/lib/movieUtils";

interface ScheduleProps {
  schedule: ScheduleEntry[];
  onRemove: (tmdbId: number) => void;
  onReorder: (reorderedSchedule: ScheduleEntry[]) => void;
}

const ScheduleItem = memo(({
  entry,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemove,
}: {
  entry: ScheduleEntry;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: () => void;
  onRemove: () => void;
}) => (
  <Card
    draggable
    onDragStart={onDragStart}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    className={`
      flex items-center gap-4 p-4 transition-all cursor-move
      ${isDragging ? "opacity-50 border-blue-500" : "border-gray-700"}
      ${isDropTarget ? "bg-blue-900/20 border-blue-500" : "bg-gray-800/50"}
      hover:bg-gray-700/50 hover:border-gray-600
    `}
  >
    <div className="text-gray-500 font-mono text-sm w-8 text-center shrink-0">
      #{entry.order}
    </div>

    <MoviePoster path={entry.poster_path} title={entry.title} />

    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-white truncate text-sm mb-1">
        {entry.title}
      </h3>
      <p className="text-xs text-gray-400">
        {getMovieYear(entry.release_date)}
      </p>
    </div>

    <Button
      variant="destructive"
      size="sm"
      onClick={onRemove}
      className="shrink-0"
    >
      Remove
    </Button>
  </Card>
));
ScheduleItem.displayName = "ScheduleItem";

export default function Schedule({
  schedule,
  onRemove,
  onReorder,
}: ScheduleProps) {
  const [dragState, setDragState] = useState<{
    draggedId: number | null;
    dragOverIndex: number | null;
  }>({
    draggedId: null,
    dragOverIndex: null,
  });

  const handleDrop = (targetIndex: number) => {
    if (!dragState.draggedId) return;

    const draggedIndex = schedule.findIndex(
      (e) => e.tmdbId === dragState.draggedId
    );
    if (draggedIndex === targetIndex) {
      setDragState({ draggedId: null, dragOverIndex: null });
      return;
    }

    const newSchedule = [...schedule];
    const [draggedItem] = newSchedule.splice(draggedIndex, 1);
    newSchedule.splice(targetIndex, 0, draggedItem);

    onReorder(
      newSchedule.map((entry, index) => ({ ...entry, order: index + 1 }))
    );
    setDragState({ draggedId: null, dragOverIndex: null });
  };

  if (schedule.length === 0) {
    return (
      <Card className="text-center py-12 text-gray-400 bg-gray-800/30 border-2 border-dashed border-gray-700">
        <p className="text-lg mb-2">📅 No movies scheduled</p>
        <p className="text-sm">Search and add movies to your schedule</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {schedule.map((entry, index) => {
        const isDragging = dragState.draggedId === entry.tmdbId;
        const isDropTarget = dragState.dragOverIndex === index;

        return (
          <ScheduleItem
            key={entry.tmdbId}
            entry={entry}
            isDragging={isDragging}
            isDropTarget={isDropTarget}
            onDragStart={() =>
              setDragState({ ...dragState, draggedId: entry.tmdbId })
            }
            onDragOver={(e) => {
              e.preventDefault();
              setDragState({ ...dragState, dragOverIndex: index });
            }}
            onDragLeave={() =>
              setDragState({ ...dragState, dragOverIndex: null })
            }
            onDrop={() => handleDrop(index)}
            onRemove={() => onRemove(entry.tmdbId)}
          />
        );
      })}
    </div>
  );
}
