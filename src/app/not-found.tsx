import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <Image
        src="/icon.png"
        alt="Welly"
        width={64}
        height={64}
        className="mb-6 rounded-2xl shadow-lg shadow-[#00A5E0]/20"
      />
      <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#00A5E0] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#0086B8]"
      >
        Go home
      </Link>
    </div>
  );
}
