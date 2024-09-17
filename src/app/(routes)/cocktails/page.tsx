"use client";

import { useEffect, useState } from "react";
import CocktailCard from "@/components/layout/CocktailCard";
import { AddCocktailDialog } from "@/components/layout/AddCocktailDialog";
import useCocktailStore from "@/store/store";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import { useRouter } from "next/navigation"; // Use Next.js router
import { supabase } from "@/lib/supabaseClient"; // Your Supabase client

export default function CocktailsPage() {
  const { data, loading, error, fetchData } = useCocktailStore(); // Zustand store values
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: session, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error checking session: ", error);
        return;
      }

      if (!session) {
        // If no session, redirect to home
        router.push("/");
      } else {
        // If authenticated, fetch the cocktail data
        fetchData();
      }
    };

    checkAuth();
  }, [fetchData, router]);

  useEffect(() => {
    // Filter data based on search term
    setFilteredData(
      data.filter((cocktail) =>
        cocktail.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data]);

  if (error) {
    return (
      <div className="bg-white h-screen text-center text-red-500">{error}</div>
    );
  }

  return (
    <>
      <Navbar />

      <div className=" py-10 container mx-auto px-10">
        <h1 className="text-4xl font-bold dark:text-slate-50">Cocktails</h1>
        {/* Search Bar */}
        <div className="w-full flex items-center justify-center">
          <Input
            type="text"
            placeholder="Search cocktails..."
            className="dark:text-slate-50 border border-gray-300 rounded-lg px-4 w-96"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Button for adding new cocktails */}
        <div className=" mb-6">
          <AddCocktailDialog fetchData={fetchData} />
        </div>

        {/* Cocktail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="h-screen col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-500">
              <p className="text-2xl">Loading...</p>
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((cocktail) => (
              <CocktailCard
                key={cocktail.id}
                id={cocktail.id} // Ensure the id is passed to each card
                name={cocktail.name}
                description={cocktail.description}
                ratings={cocktail.ratings}
                fetchData={fetchData}
              />
            ))
          ) : (
            <div className="h-screen col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-500">
              <p className="text-2xl">No cocktails found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
