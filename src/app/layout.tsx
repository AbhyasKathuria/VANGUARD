import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import VanguardBot from "@/components/VanguardBot";
import "./globals.css";

export const metadata: Metadata = {
  title: "VANGUARD — Rural Service Routing Platform",
  description: "Empowering rural citizens with instant rule-based service routing, worker dispatch, and civic protection.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="bg-[#f5f5f5] text-[#404040] min-h-screen flex flex-col antialiased selection:bg-[#dcdcdc]">
        <Navbar user={user} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="bg-white border-t border-[#dcdcdc] py-6 text-center text-xs text-[#707070]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-semibold text-[#404040]">
              VANGUARD MVP — Rural Service Routing Platform
            </p>
            <p className="text-[#707070]">
              Deterministic rule-based routing &amp; role-enforced dispatch architecture
            </p>
          </div>
        </footer>
        {/* Tiny & Cute Floating FAQ Chatbot */}
        <VanguardBot />
      </body>
    </html>
  );
}
