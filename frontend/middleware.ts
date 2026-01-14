import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("your_") ||
    supabaseAnonKey.includes("your_")
  ) {
    console.error(
      "⚠️  Supabase environment variables are not configured properly."
    );
    console.error(
      "Please update .env.local with your actual Supabase credentials."
    );
    console.error(
      "Get them from: https://supabase.com/dashboard > Your Project > Settings > API"
    );

    // Allow the request to continue for development
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user profile if logged in
  let userRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    userRole = profile?.role || null;
  }

  const pathname = request.nextUrl.pathname;

  // Protect dashboard routes (owner only)
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (userRole !== "owner") {
      return NextResponse.redirect(new URL("/browse", request.url));
    }
  }

  // Protect browse routes (logged-in finders only)
  if (pathname.startsWith("/browse")) {
    if (!user) {
      // Logged out users cannot see browse page
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (userRole === "owner") {
      // Owners should go to dashboard instead
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect logged-in users away from landing page
  if (pathname === "/") {
    if (user) {
      if (userRole === "owner") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/browse", request.url));
      }
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login" && user) {
    if (userRole === "owner") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/browse", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
