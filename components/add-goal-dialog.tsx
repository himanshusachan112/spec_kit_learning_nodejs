"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddGoalDialogProps {
  onCreate: (title: string, endDate: string) => void;
}

export function AddGoalDialog({ onCreate }: AddGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setTitle("");
    setEndDate("");
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !endDate) {
      setError("Please enter a title and an end date.");
      return;
    }
    onCreate(title, endDate);
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetForm();
      }}
    >
      <DialogTrigger
        render={
          <Button className="bg-accent-peach text-foreground hover:bg-accent-peach/80" />
        }
      >
        Add Goal
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new goal</DialogTitle>
          <DialogDescription>
            Give your goal a title and a deadline.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="goal-title">Title</Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Run a 5k"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="goal-end-date">End date</Label>
            <Input
              id="goal-end-date"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit">Save goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
