import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current user's profile with role
 */
export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Require owner role - redirect to home if not an owner
 */
export async function requireOwner() {
  const user = await requireAuth();
  const profile = await getCurrentProfile();

  if (profile?.role !== "owner") {
    redirect("/");
  }

  return { user, profile };
}

/**
 * Get user with profile in one call
 */
export async function getUserWithProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getCurrentProfile();
  return { user, profile };
}
