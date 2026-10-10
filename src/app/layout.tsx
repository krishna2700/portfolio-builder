import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Portfolio Builder — Create your portfolio in minutes",
    template: "%s · Portfolio Builder",
  },
  description:
    "Upload your resume, pick a theme, and get a live portfolio at your own /username link.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#121218",
              color: "#f5f5f8",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "10px",
              fontSize: "14px",
              padding: "12px 16px",
            },
            success: { iconTheme: { primary: "#6d5efc", secondary: "#ffffff" } },
          }}
        />
      </body>
    </html>
  );
}
