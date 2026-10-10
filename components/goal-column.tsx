import { GoalCard } from "@/components/goal-card";
import type { Goal } from "@/lib/goals";

type Accent = "pink" | "mint";

const accentClasses: Record<Accent, string> = {
  pink: "bg-accent-pink text-foreground",
  mint: "bg-accent-mint text-foreground",
};

interface GoalColumnProps {
  title: string;
  goals: Goal[];
  emptyMessage: string;
  accent: Accent;
  onComplete?: (id: string) => void;
  onDeleteRequest?: (id: string) => void;
}

export function GoalColumn({
  title,
  goals,
  emptyMessage,
  accent,
  onComplete,
  onDeleteRequest,
}: GoalColumnProps) {
  return (
    <section className="min-w-0 flex-1">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${accentClasses[accent]}`}
        >
          {goals.length}
        </span>
      </div>
      {goals.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {goals.map((goal) => (
            <li key={goal.id}>
              <GoalCard
                goal={goal}
                onComplete={onComplete}
                onDeleteRequest={onDeleteRequest}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
