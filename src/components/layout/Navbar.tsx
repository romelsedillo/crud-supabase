"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; // Import your Supabase client
import { ModeToggle } from "./modeToggle";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { useRouter } from "next/navigation"; // For redirect after sign-out

export default function Navbar() {
  const [user, setUser] = useState<any>(null); // State to store user data
  const router = useRouter();

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      setUser(data?.user); // Set user if logged in
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setUser(null); // Clear the user data after sign out
      router.push("/login"); // Redirect to home or login page after sign out
    }
  };

  return (
    <nav className="z-10 sticky top-0 w-full flex items-center justify-between px-8 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
      {/* Logo or Branding (optional) */}
      <div className="flex-shrink-0">
        <a href="/" className="text-xl font-bold text-gray-900 dark:text-white">
          Brand
        </a>
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />

        {/* If the user is authenticated, show their name and sign out button */}

        <div className="flex items-center gap-4">
          {/* Display user's name */}
          <p className="text-gray-900 dark:text-white">
            {" "}
            Hello, <span className=" capitalize font-semibold"> {user?.user_metadata?.name || "User"}</span>
          </p>

          {/* Sign Out Button */}
          {user && <Button onClick={handleSignOut}>Sign out</Button>}
        </div>

        {/* Mode Toggle Button */}
      </div>
    </nav>
  );
}
