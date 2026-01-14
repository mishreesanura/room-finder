# RoomFinder

A modern room rental platform built with Next.js and Supabase that connects property owners with potential tenants. The platform features role-based authentication, real-time room listings, image uploads, and a responsive user interface.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Environment Setup](#environment-setup)
7. [Database Setup](#database-setup)
8. [Storage Setup](#storage-setup)
9. [Running the Application](#running-the-application)
10. [Authentication System](#authentication-system)
11. [API Reference](#api-reference)
12. [Components](#components)
13. [Utilities](#utilities)
14. [Middleware](#middleware)
15. [TypeScript Types](#typescript-types)
16. [Troubleshooting](#troubleshooting)

---

## Features

### For Property Owners

- Create and manage room listings
- Upload multiple images per listing (up to 5MB each)
- Set property details: title, location, price, property type, tenant preference
- Edit and delete existing listings
- View all owned properties in a dashboard

### For Room Finders

- Browse all available room listings
- Filter rooms by location, price range, property type, and tenant preference
- View detailed room information with image carousel
- Contact property owners directly

### General Features

- Role-based authentication (Owner/Finder)
- Responsive design for mobile and desktop
- Dark mode support
- Animated UI with Framer Motion
- Real-time data updates
- Secure image storage with Supabase

---

## Tech Stack

| Category         | Technology                   |
| ---------------- | ---------------------------- |
| Framework        | Next.js 16.0.10 (App Router) |
| Language         | TypeScript                   |
| Styling          | Tailwind CSS v4              |
| UI Components    | Radix UI, shadcn/ui          |
| Animations       | Framer Motion                |
| Authentication   | Supabase Auth                |
| Database         | Supabase PostgreSQL          |
| Storage          | Supabase Storage             |
| State Management | React Hooks                  |
| Form Handling    | React Hook Form              |
| Notifications    | Sonner                       |
| Icons            | Lucide React                 |

---

## Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page (public)
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Global styles
│   ├── browse/
│   │   └── page.tsx              # Room listings page (finder only)
│   ├── dashboard/
│   │   └── page.tsx              # Owner dashboard (owner only)
│   ├── login/
│   │   └── page.tsx              # Authentication page
│   ├── profile/
│   │   ├── page.tsx              # User profile view
│   │   └── edit/
│   │       └── page.tsx          # Profile editing
│   └── rooms/
│       └── [id]/
│           └── page.tsx          # Individual room details
│
├── components/                   # React components
│   ├── add-room-modal.tsx        # Modal for adding/editing rooms
│   ├── footer.tsx                # Site footer
│   ├── header.tsx                # Navigation header with auth
│   ├── hero-section.tsx          # Search/filter hero section
│   ├── image-carousel.tsx        # Room image carousel
│   ├── owner-dashboard.tsx       # Owner's room management
│   ├── properties-table.tsx      # Room listings table
│   ├── room-details-content.tsx  # Room detail display
│   ├── room-listings.tsx         # Room cards grid
│   ├── theme-provider.tsx        # Dark/light mode provider
│   └── ui/                       # shadcn/ui components
│
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication helpers
│   ├── upload.ts                 # Image upload utilities
│   └── utils.ts                  # General utilities (cn function)
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts             # Mobile detection hook
│   └── use-toast.ts              # Toast notification hook
│
├── types/                        # TypeScript definitions
│   └── supabase.ts               # Database type definitions
│
├── utils/
│   └── supabase/                 # Supabase client utilities
│       ├── client.ts             # Browser client
│       └── server.ts             # Server client
│
├── middleware.ts                 # Route protection middleware
├── supabase-setup.sql            # Database schema SQL
├── storage-setup.sql             # Storage policies SQL
└── package.json                  # Dependencies
```

---

## Prerequisites

Before setting up the project, ensure you have:

- Node.js 18.x or higher
- npm or yarn package manager
- A Supabase account (free tier available at https://supabase.com)
- Git (optional, for cloning)

---

## Installation

1. Clone or download the repository:

   ```bash
   git clone <repository-url>
   cd roomfinder/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Environment Setup

1. Create a `.env.local` file in the `frontend` directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. Get your Supabase credentials:
   - Go to https://supabase.com/dashboard
   - Select your project (or create a new one)
   - Navigate to Settings > API
   - Copy the "Project URL" and "anon public" key

---

## Database Setup

Run the following SQL in your Supabase SQL Editor (Dashboard > SQL Editor > New Query):

### Profiles Table

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('owner', 'finder')) DEFAULT 'finder'
);
```

### Rooms Table

```sql
CREATE TABLE public.rooms (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  property_type TEXT NOT NULL,
  tenant_preference TEXT NOT NULL,
  contact_number TEXT,
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### Row Level Security Policies

```sql
-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Public can view all rooms
CREATE POLICY "Public rooms are viewable by everyone"
ON public.rooms FOR SELECT USING (true);

-- Owners can insert their own rooms
CREATE POLICY "Owners can insert their own rooms"
ON public.rooms FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Owners can update their own rooms
CREATE POLICY "Owners can update their own rooms"
ON public.rooms FOR UPDATE USING (auth.uid() = owner_id);

-- Owners can delete their own rooms
CREATE POLICY "Owners can delete their own rooms"
ON public.rooms FOR DELETE USING (auth.uid() = owner_id);
```

---

## Storage Setup

Run the following SQL to set up image storage:

### Create Storage Bucket

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-images',
  'room-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
```

### Storage Policies

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'room-images');

-- Allow public read access
CREATE POLICY "Allow public downloads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'room-images');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'room-images');
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## Authentication System

### User Roles

| Role   | Description                    | Access                           |
| ------ | ------------------------------ | -------------------------------- |
| Owner  | Property owners who list rooms | Dashboard, Add/Edit/Delete rooms |
| Finder | Users looking for rooms        | Browse rooms, View details       |

### Authentication Flow

1. **Signup**: User registers with email, password, and selects role
2. **Email Confirmation**: Optional (configurable in Supabase settings)
3. **Login**: Email/password authentication
4. **Session**: Managed automatically with Supabase SSR
5. **Logout**: Clears session and redirects to home

### Role-Based Redirects

| Condition                | Owner Redirect           | Finder Redirect       |
| ------------------------ | ------------------------ | --------------------- |
| After Login              | /dashboard               | /browse               |
| Landing Page (logged in) | /dashboard               | /browse               |
| Accessing /dashboard     | Allowed                  | Redirected to /browse |
| Accessing /browse        | Redirected to /dashboard | Allowed               |

---

## API Reference

### Auth Helper Functions (lib/auth.ts)

| Function               | Description                                   | Returns                     |
| ---------------------- | --------------------------------------------- | --------------------------- |
| `getCurrentUser()`     | Get authenticated user                        | `User \| null`              |
| `getCurrentProfile()`  | Get user profile with role                    | `Profile \| null`           |
| `requireAuth()`        | Protect routes, redirect if not authenticated | `User`                      |
| `requireOwner()`       | Ensure user is an owner                       | `{ user, profile }`         |
| `getUserWithProfile()` | Get user and profile together                 | `{ user, profile } \| null` |

### Upload Functions (lib/upload.ts)

| Function              | Description                       | Parameters                                             |
| --------------------- | --------------------------------- | ------------------------------------------------------ |
| `uploadRoomImages()`  | Upload multiple images            | `files: File[], userId: string, onProgress?: callback` |
| `validateImageFile()` | Validate image file type and size | `file: File`                                           |
| `deleteRoomImage()`   | Delete image from storage         | `imageUrl: string`                                     |

### Supabase Clients (utils/supabase/)

| Client                       | Usage                            |
| ---------------------------- | -------------------------------- |
| `createClient()` (client.ts) | Browser/Client components        |
| `createClient()` (server.ts) | Server components and API routes |

---

## Components

### Page Components

| Component    | Path                      | Description                              |
| ------------ | ------------------------- | ---------------------------------------- |
| Landing Page | app/page.tsx              | Public marketing page with animations    |
| Browse Page  | app/browse/page.tsx       | Room listings with filters (finder only) |
| Dashboard    | app/dashboard/page.tsx    | Owner room management                    |
| Login        | app/login/page.tsx        | Authentication forms                     |
| Room Details | app/rooms/[id]/page.tsx   | Individual room view                     |
| Profile      | app/profile/page.tsx      | User profile display                     |
| Edit Profile | app/profile/edit/page.tsx | Profile editing form                     |

### Shared Components

| Component          | Description                                         |
| ------------------ | --------------------------------------------------- |
| Header             | Navigation bar with auth state and profile dropdown |
| Footer             | Site footer with links                              |
| HeroSection        | Search and filter interface                         |
| RoomListings       | Grid of room cards                                  |
| AddRoomModal       | Form for creating/editing rooms                     |
| OwnerDashboard     | Owner's room management interface                   |
| PropertiesTable    | Table view of owner's rooms                         |
| ImageCarousel      | Room image slideshow                                |
| RoomDetailsContent | Detailed room information display                   |

### UI Components (components/ui/)

Built with Radix UI primitives and shadcn/ui styling:

- Accordion, Alert, AlertDialog
- Avatar, Badge, Button
- Calendar, Card, Carousel
- Checkbox, Dialog, Dropdown
- Form, Input, Label
- Modal, Navigation, Pagination
- Progress, RadioGroup, Select
- Separator, Skeleton, Slider
- Switch, Table, Tabs
- Textarea, Toast, Toggle
- Tooltip, and more

---

## Utilities

### cn Function (lib/utils.ts)

Combines class names with Tailwind merge support:

```typescript
import { cn } from "@/lib/utils";

cn("px-4 py-2", condition && "bg-blue-500", className);
```

### Custom Hooks

| Hook          | Description                   |
| ------------- | ----------------------------- |
| `useMobile()` | Detects mobile viewport       |
| `useToast()`  | Toast notification management |

---

## Middleware

The middleware (middleware.ts) handles:

1. **Environment Validation**: Checks Supabase credentials
2. **Session Refresh**: Automatically refreshes expired sessions
3. **Route Protection**:
   - /dashboard: Owner only
   - /browse: Logged-in finders only
   - /: Redirects logged-in users based on role
   - /login: Redirects authenticated users away

### Protected Routes

| Route      | Required Role      | Redirect on Failure |
| ---------- | ------------------ | ------------------- |
| /dashboard | owner              | /login or /browse   |
| /browse    | finder (logged in) | / or /dashboard     |

---

## TypeScript Types

### Database Types (types/supabase.ts)

```typescript
// Room type
interface Room {
  id: number;
  owner_id: string;
  title: string;
  location: string;
  price: number;
  property_type: string;
  tenant_preference: string;
  contact_number: string | null;
  image_urls: string[] | null;
  created_at: string;
}

// Profile type
interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: "owner" | "finder";
}
```

---

## Troubleshooting

### Common Issues

**1. "Supabase environment variables are not configured"**

- Ensure `.env.local` exists with valid credentials
- Restart the development server after adding environment variables

**2. "Email not confirmed" error on login**

- Either confirm email via the confirmation link
- Or disable email confirmation in Supabase: Authentication > Settings > Email Auth

**3. Images not uploading**

- Run the storage-setup.sql in Supabase SQL Editor
- Ensure the 'room-images' bucket exists and is public

**4. "Permission denied" when adding rooms**

- Ensure the user is logged in as an "owner"
- Verify RLS policies are correctly set up

**5. Rooms not appearing after creation**

- Check browser console for errors
- Verify the rooms table has the correct schema
- Ensure RLS policies allow SELECT for everyone

### Useful Commands

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Check for TypeScript errors
npx tsc --noEmit
```

---

## License

This project is private and not licensed for public distribution.

---

## Support

For issues and feature requests, please contact the development team.
