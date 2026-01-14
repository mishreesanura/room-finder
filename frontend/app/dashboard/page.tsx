import Header from "@/components/header";
import Footer from "@/components/footer";
import OwnerDashboard from "@/components/owner-dashboard";
import { requireOwner } from "@/lib/auth";

export default async function DashboardPage() {
  // Ensure user is authenticated and is an owner
  await requireOwner();

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <OwnerDashboard />
      <Footer />
    </main>
  );
}
