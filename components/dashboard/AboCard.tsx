"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, XCircle, Clock, CreditCard, ExternalLink, Zap } from "lucide-react";

type Status = "none" | "trialing" | "active" | "past_due" | "canceled" | "incomplete";

const STATUS_CONFIG: Record<Status, {
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  border: string;
}> = {
  active: {
    label: "Aktiv",
    description: "Ihr Abo ist aktiv. Alle Funktionen sind freigeschaltet.",
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  trialing: {
    label: "Testphase",
    description: "Sie befinden sich in der kostenlosen Testphase.",
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  past_due: {
    label: "Zahlung ausstehend",
    description: "Eine Zahlung konnte nicht eingezogen werden. Bitte aktualisieren Sie Ihre Zahlungsmethode.",
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  canceled: {
    label: "Gekündigt",
    description: "Ihr Abo wurde gekündigt. Reaktivieren Sie es, um Ihr Profil wieder zu aktivieren.",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  incomplete: {
    label: "Unvollständig",
    description: "Die Zahlung wurde noch nicht abgeschlossen. Bitte schließen Sie den Checkout ab.",
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  none: {
    label: "Kein Abo",
    description: "Sie haben noch kein aktives Abo. Starten Sie jetzt für 9,90 Euro pro Monat.",
    icon: XCircle,
    color: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-gray-200",
  },
};

const FEATURES = [
  "Öffentliches Fahrerprofil auf taxi-checker.de",
  "Persönlicher QR-Code für Bewertungen",
  "Alle Bewertungen im Dashboard",
  "Statistiken und Kategorie-Auswertungen",
  "DSGVO-konform und sicher",
];

interface Props {
  status: Status;
  periodEnd: string | null;
  hasCustomer: boolean;
}

export default function AboCard({ status, periodEnd, hasCustomer }: Props) {
  const [loading, setLoading] = useState(false);
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  const isActive = status === "active" || status === "trialing";

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/create-checkout", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(false);
  };

  const handlePortal = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/create-portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(false);
  };

  const formattedDate = periodEnd
    ? new Date(periodEnd).toLocaleDateString("de-DE", {
        day: "2-digit", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="max-w-2xl space-y-4">
      {/* Status card */}
      <div className={`rounded-xl p-5 border ${cfg.bg} ${cfg.border}`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${cfg.color}`} />
          <div className="flex-1">
            <p className={`font-semibold ${cfg.color}`}>{cfg.label}</p>
            <p className="text-sm text-gray-600 mt-0.5">{cfg.description}</p>
            {isActive && formattedDate && (
              <p className="text-xs text-gray-400 mt-2">
                Naechste Abrechnung: {formattedDate}
              </p>
            )}
            {!isActive && formattedDate && status === "canceled" && (
              <p className="text-xs text-gray-400 mt-2">
                Aktiv bis: {formattedDate}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold text-taxi-blue">9,90 Euro</p>
            <p className="text-xs text-gray-400">pro Monat</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl p-5 shadow-card">
        <h2 className="font-semibold text-taxi-blue mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-taxi-yellow" />
          Im Abo enthalten
        </h2>
        <ul className="space-y-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl p-5 shadow-card">
        <h2 className="font-semibold text-taxi-blue mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-taxi-yellow" />
          Aboverwaltung
        </h2>

        {!isActive ? (
          <div className="space-y-3">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-taxi-blue/30 border-t-taxi-blue rounded-full animate-spin" />
              ) : null}
              {status === "none" || status === "incomplete"
                ? "Jetzt Abo starten"
                : "Abo reaktivieren"}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Zahlung sicher über Stripe. Monatlich kündbar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {hasCustomer && (
              <button
                onClick={handlePortal}
                disabled={loading}
                className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-taxi-blue/30 border-t-taxi-blue rounded-full animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                Zahlungsmethode oder Kündigung verwalten
              </button>
            )}
            <p className="text-xs text-gray-400 text-center">
              Sie werden zum sicheren Stripe-Kundenportal weitergeleitet.
            </p>
          </div>
        )}
      </div>

      {/* Stripe Climate badge */}
      <div className="flex justify-center pt-2">
        <iframe
          width="380"
          height="82"
          style={{ border: 0 }}
          src="https://climate.stripe.com/badge/onqaEi?theme=light&size=large&locale=de-DE"
          title="Stripe Climate"
        />
      </div>
    </div>
  );
}
