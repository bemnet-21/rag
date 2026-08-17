import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import AuthGuard from "@/components/AuthGuard";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: "Aethelgard Horology — The Archive Ledger",
  description: "Heritage mechanical watchmaker since 1892. Explore calibre records, serial archives, and horological schematics through the Aethelgard Archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body className="antialiased">
          
          <StoreProvider>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
              <AuthGuard allowedRoles={["admin", "user"]}>
                {children}
              </AuthGuard>
            </GoogleOAuthProvider>
          </StoreProvider>
        </body>
      </html>
  );
}
