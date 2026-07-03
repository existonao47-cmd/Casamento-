import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PetalsFall from "@/components/PetalsFall";
import ElegantCursor from "@/components/ElegantCursor";
import MusicToggle from "@/components/MusicToggle";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-paper dark:bg-ink transition-colors">
      <ElegantCursor />
      <PetalsFall />
      <Navbar />
      <div className="relative z-10">{children}</div>
      <Footer />
      <MusicToggle />
    </div>
  );
}
