"use client";

import { useSyncExternalStore } from "react";
import {
  commitGoals,
  completeGoal,
  createGoal,
  deleteGoal,
  getGoalsServerSnapshot,
  getGoalsSnapshot,
  sortActiveGoals,
  sortCompletedGoals,
  subscribeToGoals,
} from "@/lib/goals";
import { GoalColumn } from "@/components/goal-column";
import { AddGoalDialog } from "@/components/add-goal-dialog";

export function GoalBoard() {
  const goals = useSyncExternalStore(
    subscribeToGoals,
    getGoalsSnapshot,
    getGoalsServerSnapshot
  );

  const activeGoals = sortActiveGoals(
    goals.filter((goal) => goal.status === "active")
  );
  const completedGoals = sortCompletedGoals(
    goals.filter((goal) => goal.status === "completed")
  );

  function handleCreate(title: string, endDate: string) {
    commitGoals([...goals, createGoal(title, endDate)]);
  }

  function handleComplete(id: string) {
    commitGoals(completeGoal(goals, id));
  }

  function handleDeleteRequest(id: string) {
    commitGoals(deleteGoal(goals, id));
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 bg-background p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">doit</h1>
        <AddGoalDialog onCreate={handleCreate} />
      </div>
      <div className="flex flex-col gap-6 md:flex-row">
        <GoalColumn
          title="Active"
          goals={activeGoals}
          emptyMessage="No active goals yet — add one to get started."
          accent="pink"
          onComplete={handleComplete}
          onDeleteRequest={handleDeleteRequest}
        />
        <GoalColumn
          title="Completed"
          goals={completedGoals}
          emptyMessage="Nothing completed yet."
          accent="mint"
          onDeleteRequest={handleDeleteRequest}
        />
      </div>
    </main>
  );
}
