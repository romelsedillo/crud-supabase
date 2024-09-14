"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useCocktailStore from "@/store/store";
import { FaTrashAlt } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";


interface DeleteCocktailDialogProps {
  Id: string;
  fetchData: () => void;
}

export function DeleteCocktailDialog({
  Id,
  fetchData,
}: DeleteCocktailDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("cocktails")
        .delete()
        .eq("id", Id)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Cocktail deleted successfully.");
      await fetchData(); // Refresh data after deleting
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error("Failed to delete cocktail.");
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="font-thin text-red-500"
          aria-label="Delete"
        >
          <FaTrashAlt size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-500">Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the data.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="text-red-500"
              variant="outline"
              size="sm"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
