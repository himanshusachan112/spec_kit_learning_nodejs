import { Checkbox } from "@/components/ui/checkbox";
import { DeleteGoalDialog } from "@/components/delete-goal-dialog";
import { getDaysLeft, isDueSoon, formatDaysLeft } from "@/lib/date";
import type { Goal } from "@/lib/goals";

interface GoalCardProps {
  goal: Goal;
  onComplete?: (id: string) => void;
  onDeleteRequest?: (id: string) => void;
}

export function GoalCard({ goal, onComplete, onDeleteRequest }: GoalCardProps) {
  const daysLeft = goal.status === "active" ? getDaysLeft(goal.endDate) : null;
  const dueSoon = daysLeft !== null && isDueSoon(daysLeft);

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-3 shadow-sm ${
        dueSoon
          ? "border-transparent bg-highlight text-highlight-foreground"
          : "border-border bg-surface text-foreground"
      }`}
    >
      <Checkbox
        checked={goal.status === "completed"}
        disabled={goal.status === "completed"}
        onCheckedChange={(checked) => {
          if (checked && goal.status === "active") {
            onComplete?.(goal.id);
          }
        }}
        aria-label={`Mark "${goal.title}" complete`}
      />
      <div className="min-w-0 flex-1">
        <p className="break-words font-medium">{goal.title}</p>
        {daysLeft !== null && (
          <p className="text-sm opacity-80">{formatDaysLeft(daysLeft)}</p>
        )}
      </div>
      <DeleteGoalDialog
        goalTitle={goal.title}
        onConfirm={() => onDeleteRequest?.(goal.id)}
      />
    </div>
  );
}
