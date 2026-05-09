"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen lang sein."),
  firstName: z.string().min(2, "Bitte geben Sie Ihren Vornamen ein."),
  lastName: z.string().min(2, "Bitte geben Sie Ihren Nachnamen ein."),
});

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { first_name: form.firstName, last_name: form.lastName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(
        authError.message.includes("already registered")
          ? "Diese E-Mail ist bereits registriert. Bitte melden Sie sich an."
          : "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut."
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-4" role="alert">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="font-bold text-taxi-blue text-lg mb-2">Registrierung erfolgreich!</h2>
        <p className="text-gray-500 text-sm">
          Bitte bestätigen Sie Ihre E-Mail-Adresse. Danach können Sie sich anmelden.
        </p>
        <a href="/auth/login" className="btn-primary mt-6 justify-center w-full">
          Zur Anmeldung
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-taxi-blue mb-1.5">
              Vorname
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={form.firstName}
                onChange={set("firstName")}
                placeholder="Max"
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-taxi-blue mb-1.5">
              Nachname
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              required
              value={form.lastName}
              onChange={set("lastName")}
              placeholder="Mustermann"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-email" className="block text-sm font-medium text-taxi-blue mb-1.5">
            E-Mail-Adresse
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={set("email")}
              placeholder="ihre@email.de"
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-password" className="block text-sm font-medium text-taxi-blue mb-1.5">
            Passwort <span className="text-gray-400 font-normal">(min. 8 Zeichen)</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              id="reg-password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={form.password}
              onChange={set("password")}
              placeholder="Sicheres Passwort"
              className="input-field pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPw ? "Passwort verbergen" : "Passwort anzeigen"}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center mt-6 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-taxi-blue/30 border-t-taxi-blue rounded-full animate-spin" />
            Konto wird erstellt...
          </>
        ) : (
          "Profil erstellen"
        )}
      </button>
    </form>
  );
}
