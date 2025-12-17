"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // 🔑 CRITICAL LINE — sync cookies with server
        router.refresh();

        // now go to dashboard
        router.push("/dashboard");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess("Check your email for a confirmation link!");
        setEmail("");
        setPassword("");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSuccess("Check your email for password reset instructions!");
        setEmail("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div
        className="hidden md:flex flex-1 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/woman-promoting.jpg')",
        }}
      ></div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            {mode === "login"
              ? "Welcome Back To Business!"
              : mode === "signup"
              ? "Create Your Account"
              : "Reset Your Password"}
          </h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && (
            <p className="text-green-500 text-center mb-4">{success}</p>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                placeholder="Input email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <label htmlFor="password" className="block text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Type password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}

            {mode === "login" && (
              <div className="flex justify-between items-center text-sm text-gray-600">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember Me</span>
                </label>
                <button
                  type="button"
                  className="text-green-500 hover:underline"
                  onClick={() => setMode("forgot")}
                >
                  Forgotten Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition-colors disabled:opacity-50 mt-4"
            >
              {loading
                ? mode === "login"
                  ? "Logging in..."
                  : mode === "signup"
                  ? "Signing up..."
                  : "Sending..."
                : mode === "login"
                ? "Log In"
                : mode === "signup"
                ? "Sign Up"
                : "Send Reset Email"}
            </button>
          </form>

          {mode !== "forgot" && (
            <p className="mt-4 text-center text-sm text-gray-600">
              {mode === "login"
                ? "Don't Have An Account? "
                : "Already have an account? "}
              <button
                className="text-green-500 hover:underline font-medium"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                Click Here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
