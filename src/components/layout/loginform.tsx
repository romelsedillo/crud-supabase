"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
import { redirect, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error checking session: ", error);
          return;
        }

        if (data?.session) {
          // If a session exists, redirect to the homepage
          router.push("/");
        }
      } catch (error) {
        console.error("Unexpected error during session check: ", error);
      }
    };

    checkAuth();
  }, [router]);

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Login failed: " + error.message);
      } else {
        toast.success("Login successful!");
        redirect("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        toast.error("Google login failed: " + error.message);
      } else {
        toast.success("Logged in with Google!");
        router.push("/cocktails");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during Google login.");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });

      if (error) {
        toast.error("GitHub login failed: " + error.message);
      } else {
        toast.success("Logged in with GitHub!");
        // router.push("/cocktails");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during GitHub login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xs mx-auto p-6 rounded-md shadow-2xl border">
      <h2 className="dark:text-slate-50 text-3xl mb-4 text-center">Sign In</h2>
      <form
        onSubmit={login}
        className="text-foreground max-w-xs mx-auto flex flex-col gap-2"
        autoComplete="on"
      >
        <Input
          name="email"
          className="dark:text-slate-50 border border-slate-500 rounded outline-none focus-visible:ring-0"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Password"
          value={password}
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          className="dark:text-slate-50 border border-slate-500 rounded outline-none focus-visible:ring-0"
          required
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showPassword"
            className="mr-2"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)} // Toggle password visibility
          />
          <label htmlFor="showPassword" className="text-xs">
            Show Password
          </label>
        </div>
        <Button className="px-4 py-2 rounded" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <div className="max-w-xs flex items-center justify-end py-2 mx-auto text-xs">
        <div>
          <Link
            href={"/password-recovery"}
            className="hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>
      </div>
      <div className="max-w-xs flex items-center gap-2 py-2 mx-auto">
        <hr className="border flex-grow" />
        <p className="text-xs dark:text-slate-50">Or continue with</p>
        <hr className="border flex-grow" />
      </div>
      <div className="max-w-xs flex flex-col items-center mx-auto py-2 gap-2">
        <Button
          onClick={handleGoogleLogin}
          className="w-full"
          disabled={loading}
        >
          Google
          <FcGoogle className="ml-2" />
        </Button>
        <Button
          onClick={handleGitHubLogin}
          className="w-full"
          disabled={loading}
        >
          GitHub
          <FaGithub className="ml-2" />
        </Button>
      </div>
      <div className="mx-auto max-w-xs mt-8">
        <p className="text-xs">
          Don&apos;t have an account?{" "}
          <Link href={"/register"} className="font-medium hover:underline">
            Sign up here.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
