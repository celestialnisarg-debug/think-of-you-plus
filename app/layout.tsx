import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThinkOfYou — Send a heartfelt postcard",
  description:
    "Design a heartfelt digital postcard, seal it in an envelope, and send a link someone can open and keep.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="border-b border-stone-200/80">
          <div className="mx-auto flex max-w-6xl items-center px-5 py-4 md:px-8">
            <Link
              href="/"
              className="font-serif-display text-2xl font-medium tracking-wide text-stone-800"
            >
              ThinkOfYou
            </Link>
          </div>
        </header>

        {children}

        <footer className="px-6 py-8 text-center font-sans text-xs text-stone-400">
          Inspired by the original think-of-you by{" "}
          <a
            href="https://www.instagram.com/iryna_lupan/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            @iryna_lupan
          </a>
        </footer>
      </body>
    </html>
  );
}
