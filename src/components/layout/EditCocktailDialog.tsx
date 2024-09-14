"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";

interface EditCocktailDialogProps {
  Id: string;
  Name: string;
  Description: string;
  Ratings: number;
  fetchData: () => void;
}

export function EditCocktailDialog({
  Id,
  Name,
  Description,
  Ratings,
  fetchData,
}: EditCocktailDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [name, setName] = useState(Name);
  const [description, setDescription] = useState(Description);
  const [ratings, setRatings] = useState(Ratings);

  useEffect(() => {
    // Validation check for form
    setIsFormValid(
      name.trim() !== "" &&
        description.trim() !== "" &&
        ratings >= 0 &&
        ratings <= 5
    );
  }, [name, description, ratings]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const { error } = await supabase
        .from("cocktails")
        .update({ name, description, ratings })
        .eq("id", Id);
  
      if (error) {
        throw new Error(error.message);
      }
  
      toast.success("Cocktail updated successfully.");
      fetchData(); // Refresh data
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error("Failed to update cocktail.");
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
        <button className="text-blue-500 hover:text-blue-700" aria-label="Edit">
          <FaEdit size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] px-8">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg">Edit Cocktail</DialogTitle>
            <DialogDescription>
              Update the details of the selected cocktail.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 my-4">
            <div>
              <Label htmlFor="name" className="mb-2">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="ratings" className="mb-2">
                Ratings
              </Label>
              <Input
                type="number"
                id="ratings"
                min="0"
                max="5"
                step="0.1"
                value={ratings}
                onChange={(e) => setRatings(e.target.valueAsNumber)}
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className={`ml-2 ${loading ? "bg-gray-300" : "bg-blue-500"}`}
              size="sm"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
