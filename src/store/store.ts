import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

interface CocktailStore {
  data: any[]; // Holds fetched cocktail data
  loading: boolean; // Tracks loading state
  error: string | null; // Holds error messages, if any
  loggedInUser?: any; // Information about the logged-in user
  userId?: string; // User ID
  userEmail?: string; // User email
  checkUserSession: (router: any) => Promise<void>; // Function to check user session
  fetchData: () => Promise<void>; // Function to fetch cocktail data
}

const useCocktailStore = create<CocktailStore>((set) => ({
  data: [],
  loading: false,
  error: null,

  checkUserSession: async (router: any) => {
    set({ loading: true });
    // try {
    //   const session = await supabase.auth.getSession();
    //   if (!session) {
    //     console.log("No active session found, redirecting to login");
    //     router.push("/");
    //   }
    // } catch (error) {
    //   console.log("Error checking session:", error);
    //   router.push("/"); // Redirect to login if session not found
    // } finally {
    //   set({ loading: false });
    // }
  },

  fetchData: async () => {
    set({ loading: true, error: null }); // Start loading and reset errors
    try {
      const { data, error } = await supabase.from("cocktails").select("*"); // Fetch cocktails data
      if (error) {
        console.error("Error fetching data:", error);
        set({ error: "Failed to load cocktails.", loading: false });
      } else {
        set({ data, loading: false }); // Set the fetched data in the store
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      set({ error: error.message, loading: false }); // Capture any errors
    }
  },
}));

export default useCocktailStore;
