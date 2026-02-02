import type { Metadata } from "next";
import { Saira } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { MaintenanceDialog } from "@/components/maintenance-dialog";

const saira = Saira({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['200','300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Tachyon Hub",
  description: "Game redeem codes storage and management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={saira.variable} suppressHydrationWarning>
      <body className="antialiased flex min-h-screen flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <MaintenanceDialog />
            <Header />
            <main className="flex-1 pb-20">
              {children}
            </main>
            <Toaster />
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
