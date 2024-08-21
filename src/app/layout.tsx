import "@/styles/globals.css";
import "@/styles/custom.css";
import "@/styles/prose.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import MainLayout from "@/components/layout";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  title: "Johnny Lin's Portfolio",
  description: "Welcome to Johnny Lin's Portfolio!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <MainLayout>{children}</MainLayout>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-11WT891P5R" />
    </html>
  );
}
