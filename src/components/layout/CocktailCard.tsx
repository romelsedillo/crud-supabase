import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { EditCocktailDialog } from "./EditCocktailDialog";
import { DeleteCocktailDialog } from "./DeleteCocktailDialog";

interface RecipeCardProps {
  id: string;
  name: string;
  description: string;
  ratings: number;
  fetchData: () => void; // Use the correct type for fetchData
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  name,
  description,
  ratings,
  fetchData,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 relative">
      {/* Card content */}
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
          {name}
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-xs">
          {description}
        </p>
      </div>

      {/* Ratings */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <span className="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-900 dark:text-gray-800">
          ⭐ {ratings}
        </span>
        {/* Edit and Delete Icons */}
        <div className="">
          {/* Pass the cocktail id to the Edit and Delete dialogs */}
          <EditCocktailDialog
            Id={id}
            fetchData={fetchData}
            Name={name}
            Description={description}
            Ratings={ratings}
          />
          <DeleteCocktailDialog Id={id} fetchData={fetchData} />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
