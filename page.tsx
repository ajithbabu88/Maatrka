
'use client'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-semibold">Mātṛkā • Spiritual Companion</h1>
      <button
        onClick={() => router.push('/chat')}
        className="px-5 py-3 bg-indigo-600 text-white rounded-lg shadow"
      >
        Begin My Journey
      </button>
    </main>
  );
}
