import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="text-6xl">🍜</p>
        <h1 className="mt-4 text-2xl font-bold">這個頁面也不會來</h1>
        <p className="mt-2 text-zinc-500">
          就像你的外送一樣，找不到了。
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-uber px-6 py-3 font-bold text-black"
        >
          回首頁繼續幻想
        </Link>
      </div>
    </main>
  );
}
