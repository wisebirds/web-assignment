import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <h1>wisebirds web assignment</h1>

      <Link href="/example/components">Shadcn Components Example</Link>
    </main>
  );
}
