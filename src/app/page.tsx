"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [counter, setCounter] = useState<number>(0);
  return (
    <div className="flex flex-col h-dvh gap-4 items-center justify-center">
      <h1 className="text-4xl font-black">PWA Template</h1>
      <div className="flex gap-4 items-center justify-center">
        <button
          onClick={() => setCounter((p) => p - 1)}
          className="active:translate-y-1 hover:bg-emerald-800/50 duration-200 bg-emerald-600/50 p-4 rounded-md font-bold"
        >
          -
        </button>

        <div className="bg-emerald-600/50 p-4 rounded-md font-bold min-w-20 text-center">
          {counter}
        </div>

        <button
          onClick={() => setCounter((p) => p + 1)}
          className="active:translate-y-1 hover:bg-emerald-800/50 duration-200 bg-emerald-600/50 p-4 rounded-md font-bold"
        >
          +
        </button>
      </div>
      <Link href="/test">Test page</Link>
    </div>
  );
}
