import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[calc(100vh-8rem)] place-items-center p-8 text-center">
      <div>
        <h1 className="font-serif-display text-3xl text-stone-800">Postcard not found</h1>
        <p className="mt-2 font-sans text-sm text-stone-500">This link may be wrong or expired.</p>
        <Link
          href="/create"
          className="mt-5 inline-block rounded-xl bg-stone-800 px-6 py-2.5 font-sans text-sm font-medium text-white transition hover:bg-stone-900"
        >
          Create your own
        </Link>
      </div>
    </main>
  );
}
