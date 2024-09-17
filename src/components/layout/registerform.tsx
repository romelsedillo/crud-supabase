"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { toast } from "react-hot-toast"; // Added toast for feedback
import { supabase } from "@/lib/supabaseClient"; // Supabase client import
import { useRouter } from "next/navigation";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [registering, setRegistering] = useState<boolean>(false);
  const router = useRouter();

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegistering(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }, // Save the user's name as part of the profile
        },
      });

      if (error) {
        toast.error("Registration failed: " + error.message);
      } else {
        toast.success(
          "Registration successful! Please check your email to confirm your account."
        );
        router.push("/"); // Redirect to login after registration
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setRegistering(false);
    }
  };

  const handleGoogleLogin = async () => {
    setRegistering(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        toast.error("Google login failed: " + error.message);
      } else {
        toast.success("Logged in with Google!");
        router.push("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during Google login.");
    } finally {
      setRegistering(false);
    }
  };

  const handleGitHubLogin = async () => {
    setRegistering(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });

      if (error) {
        toast.error("GitHub login failed: " + error.message);
      } else {
        toast.success("Logged in with GitHub!");
        router.push("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during GitHub login.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="max-w-xs mx-auto p-6 rounded-md shadow-xl border">
      <h2 className="text-3xl font-semi mb-4 text-center">Sign up</h2>
      <form
        onSubmit={register}
        className="max-w-xs mx-auto flex flex-col items-center gap-2"
      >
        <div className="w-full flex flex-col items-start gap-2">
          <Input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Name"
            type="text"
            className="border border-slate-500 rounded outline-none focus-visible:ring-0"
            required
          />
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <Input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
            type="email"
            className="border border-slate-500 rounded outline-none focus-visible:ring-0"
            required
          />
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <Input
            placeholder="Password"
            value={password}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-slate-500 rounded outline-none focus-visible:ring-0"
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
        </div>
        <div className="flex flex-col items-start w-full">
          <Button
            type="submit"
            className="w-full py-1 rounded font-thin"
            disabled={registering}
          >
            {registering ? "Registering..." : "Sign up"}
          </Button>
        </div>
      </form>

      <div className="max-w-xs flex items-center gap-2 py-4 mx-auto">
        <hr className="border flex-grow" />
        <p className="text-xs">Or continue with</p>
        <hr className="border flex-grow" />
      </div>
      <div className="flex flex-col items-center mx-auto gap-2">
        <Button
          onClick={handleGoogleLogin}
          className="w-full"
          disabled={registering}
        >
          Google
          <FcGoogle className="ml-2" />
        </Button>
        <Button
          onClick={handleGitHubLogin}
          className="w-full"
          disabled={registering}
        >
          GitHub
          <FaGithub className="ml-2" />
        </Button>
      </div>

      <div className="mx-auto max-w-xs mt-4">
        <p className="text-xs">
          Already have an account?{" "}
          <Link href="/login" className="font-medium underline">
            Sign in.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
