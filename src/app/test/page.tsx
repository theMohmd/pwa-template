import Link from "next/link";

export default function page() {
  return (
    <div className="h-dvh flex-col gap-4 flex items-center justify-center">
      <h1 className="text-4xl font-black">Test page</h1>
      <Link href="/">Go back</Link>
    </div>
  );
}
