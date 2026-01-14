"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<"owner" | "finder">("finder");
  const [signupLoading, setSignupLoading] = useState(false);

  // Resend confirmation email handler
  const handleResendConfirmation = async () => {
    if (!loginEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: loginEmail,
      });

      if (error) throw error;

      toast.success("Confirmation email sent! Please check your inbox.");
      setShowResendConfirmation(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend confirmation email");
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setShowResendConfirmation(false);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

      if (authError) {
        // Handle specific error codes from Supabase
        const errorCode = (authError as any).code;

        if (errorCode === "email_not_confirmed") {
          setShowResendConfirmation(true);
          toast.error("Please confirm your email before logging in.");
          return;
        }

        if (errorCode === "invalid_credentials") {
          toast.error("Invalid email or password. Please try again.");
          return;
        }

        throw authError;
      }

      if (authData.user) {
        // Fetch user profile to get role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          toast.error("Error fetching user profile");
          return;
        }

        toast.success("Logged in successfully!");

        // Redirect based on role
        if (profile?.role === "owner") {
          router.push("/dashboard");
        } else {
          router.push("/browse");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);

    try {
      // Step 1: Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
      });

      if (authError) {
        // Handle duplicate email (status 409 or specific message)
        if (
          authError.status === 409 ||
          authError.message?.toLowerCase().includes("already registered") ||
          authError.message?.toLowerCase().includes("already exists") ||
          authError.message?.toLowerCase().includes("duplicate")
        ) {
          toast.error(
            "This email is already registered. Please login instead."
          );
          return;
        }
        throw authError;
      }

      // Check if user already exists (Supabase may return a user with identities = [])
      if (
        authData.user &&
        authData.user.identities &&
        authData.user.identities.length === 0
      ) {
        toast.error("This email is already registered. Please login instead.");
        return;
      }

      if (authData.user) {
        // Step 2: Insert profile with role
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: signupEmail,
          role: signupRole,
        });

        if (profileError) {
          // Handle duplicate profile (in case user exists)
          if (
            profileError.code === "23505" ||
            profileError.message?.includes("duplicate")
          ) {
            toast.error(
              "This email is already registered. Please login instead."
            );
            return;
          }
          console.error("Profile creation error:", profileError);
          toast.error("Error creating user profile");
          return;
        }

        // Check if email confirmation is required
        if (authData.session) {
          // No email confirmation required, redirect immediately
          toast.success("Account created successfully!");
          if (signupRole === "owner") {
            router.push("/dashboard");
          } else {
            router.push("/browse");
          }
        } else {
          // Email confirmation required
          toast.success(
            "Account created! Please check your email to verify your account."
          );
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Welcome to RoomFinder
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Logging in..." : "Log In"}
                </Button>

                {/* Resend Confirmation Email Section */}
                {showResendConfirmation && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                      Your email is not confirmed. Please check your inbox for
                      the confirmation link, or request a new one.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-amber-500 text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/30"
                      onClick={handleResendConfirmation}
                      disabled={resendLoading}
                    >
                      {resendLoading
                        ? "Sending..."
                        : "Resend Confirmation Email"}
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>I am a:</Label>
                  <RadioGroup
                    value={signupRole}
                    onValueChange={(value) =>
                      setSignupRole(value as "owner" | "finder")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="finder" id="finder" />
                      <Label
                        htmlFor="finder"
                        className="font-normal cursor-pointer"
                      >
                        Room Finder (Looking for a room)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="owner" id="owner" />
                      <Label
                        htmlFor="owner"
                        className="font-normal cursor-pointer"
                      >
                        Room Owner (Have rooms to rent)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signupLoading}
                >
                  {signupLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
