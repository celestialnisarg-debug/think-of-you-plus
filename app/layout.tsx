import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThinkOfYou+ — Design & send heartfelt postcards",
  description:
    "Design a heartfelt digital postcard — pick a theme, add a photo and stickers, and send a link they can open and keep.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <footer className="px-6 py-6 text-center text-xs opacity-50">
          Inspired by the original think-of-you by{" "}
          <a
            href="https://www.instagram.com/iryna_lupan/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            @iryna_lupan
          </a>{" "}
          · rebuilt with more customization.
        </footer>
      </body>
    </html>
  );
}
