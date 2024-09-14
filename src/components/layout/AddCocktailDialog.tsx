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

export function AddCocktailDialog({ fetchData }: { fetchData: () => void }) {
  const [newCocktail, setNewCocktail] = useState({
    name: "",
    description: "",
    ratings: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Check if the form is valid
  useEffect(() => {
    const isValid =
      newCocktail.name.trim() !== "" &&
      newCocktail.description.trim() !== "" &&
      newCocktail.ratings > 0;
    setIsFormValid(isValid);
  }, [newCocktail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("cocktails")
      .insert([newCocktail]);

    if (error) {
      console.error("Error adding cocktail:", error);
      setError("Failed to add cocktail. Please try again.");
    } else {
      console.log("New cocktail added:", data);
      // Clear form after successful addition
      setNewCocktail({ name: "", description: "", ratings: 0 });
      fetchData(); // Call the fetchData function after adding the cocktail to refresh the data
      toast.success("New Cocktail added successfully");
    }

    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">Add New Cocktails</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] px-8">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg">Add New Cocktail</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new cocktail to the list.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 my-4">
            <div>
              <Label htmlFor="name" className="mb-2">
                Name
              </Label>
              <Input
                id="name"
                value={newCocktail.name}
                onChange={(e) =>
                  setNewCocktail({ ...newCocktail, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={newCocktail.description}
                onChange={(e) =>
                  setNewCocktail({
                    ...newCocktail,
                    description: e.target.value,
                  })
                }
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
                value={newCocktail.ratings}
                onChange={(e) =>
                  setNewCocktail({
                    ...newCocktail,
                    ratings: parseFloat(e.target.value),
                  })
                }
                min="0"
                max="5"
                step="0.1"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" disabled={!isFormValid || loading}>
                {loading ? "Adding..." : "Add New Cocktail"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
