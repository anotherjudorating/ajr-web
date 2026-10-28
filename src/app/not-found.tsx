import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[640px] border-l-[3px] border-claret bg-panel border-y border-r border-rule px-5 py-6">
      <h1 className="font-serif text-[28px] leading-[32px] font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 text-[14px] text-muted">
        This page does not exist or is not built yet.{" "}
        <Link href="/rankings" className="text-claret hover:underline">
          Go to the rankings
        </Link>
        .
      </p>
    </div>
  );
}
