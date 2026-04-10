import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Welcome to <span className="text-indigo-600">WaqarStore</span>
      </h1>
      <p className="mt-4 max-w-md text-lg text-gray-500">
        Quality kids&apos; clothing for every occasion.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/boys-trousers"
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          Shop Boys&apos; Trousers
        </Link>
      </div>
    </div>
  );
}

