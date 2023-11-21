import { ToasterProvider } from "@/providers/ToastProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";
import ActiveStatus from "@/components/ActiveStatus";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Facebook Messenger Clone",
  description: "Facebook Messenger Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToasterProvider />
          <ActiveStatus />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
