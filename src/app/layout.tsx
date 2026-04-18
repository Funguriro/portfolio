import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nigel — Full-Stack Engineer & AI Builder",
  description:
    "Personal portfolio and AI assistant. Ask me anything about my work, skills, and experience.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Nigel — Full-Stack Engineer & AI Builder",
    description: "Interactive AI-powered portfolio. Ask me anything.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
