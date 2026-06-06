import Link from "next/link";
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Postcard not found</h1>
        <p className="mt-2 opacity-70">This link may be wrong or expired.</p>
        <Link href="/create" className="mt-4 inline-block rounded-full bg-emerald-600 px-5 py-2 text-white">Create your own</Link>
      </div>
    </main>
  );
}
