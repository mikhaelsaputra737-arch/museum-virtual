import type { Metadata } from "next";
import "./globals.css";
import "./museum-scene.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Museum Virtual — Museum Sejarah Indonesia dan Dunia",
  description:
    "Jelajahi sejarah dunia dan Indonesia melalui museum virtual interaktif: Perang Dunia I, Perang Dunia II, kolonialisme, perjuangan kemerdekaan, serta refleksi.",
  keywords: [
    "museum virtual",
    "proyeksi 3D",
    "Perang Dunia I",
    "Perang Dunia II",
    "kolonialisme Indonesia",
    "perjuangan kemerdekaan",
    "museum sejarah",
  ],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Museum Sejarah Gen Z",
    description:
      "Jelajahi Perang Dunia I, Perang Dunia II, dan Kolonialisme-Perjuangan Indonesia dalam proyeksi 3D interaktif.",
    siteName: "Museum Sejarah Gen Z",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
