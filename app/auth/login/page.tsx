import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fahrer-Login | TaxiChecker",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-taxi-blue flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center mb-10">
        <span className="text-white font-bold text-xl">
          Taxi<span className="text-taxi-yellow">Checker</span>
        </span>
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-taxi-blue">Willkommen zurück</h1>
            <p className="text-gray-500 text-sm mt-1">
              Melden Sie sich in Ihrem Fahrerkonto an
            </p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-gray-500 mt-6">
            Noch kein Konto?{" "}
            <Link href="/auth/register" className="text-taxi-yellow font-medium hover:underline">
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
