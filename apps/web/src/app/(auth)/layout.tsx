import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-64px-200px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-bold text-primary-600">
          E-Commerce
        </Link>
      </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {children}
      </div>
    </div>
  );
}
