import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { cn } from "cn";
import { ModalProvider } from "@/components/providers/ModalProvider";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
const openSans = Open_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const openSansMono = Open_Sans({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "Discord Clone built with Next.js and Tailwind CSS",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${openSansMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={cn('bg-white dark:bg-[#313338]')}>
        <ClerkProvider afterSignOutUrl="/" >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="thiscord-theme"
          >
            <SocketProvider>
              <QueryProvider>
                <ModalProvider />
                  {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
