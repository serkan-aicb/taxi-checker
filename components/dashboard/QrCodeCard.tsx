"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Copy, CheckCheck, ExternalLink } from "lucide-react";

interface Props {
  slug: string;
  driverName: string;
}

export default function QrCodeCard({ slug, driverName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [rendered, setRendered] = useState(false);

  const reviewUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://taxi-checker.de"}/bewerten/${slug}`;

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, reviewUrl, {
      width: 280,
      margin: 2,
      color: { dark: "#0D1B2A", light: "#FFFFFF" },
    }).then(() => setRendered(true));
  }, [reviewUrl]);

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a padded version for print quality
    const pad = 24;
    const out = document.createElement("canvas");
    out.width = canvas.width + pad * 2;
    out.height = canvas.height + pad * 2;
    const ctx = out.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, pad, pad);

    const link = document.createElement("a");
    link.download = `taxichecker-qr-${slug}.png`;
    link.href = out.toDataURL("image/png");
    link.click();
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      {/* QR visual area */}
      <div className="bg-gradient-to-br from-taxi-blue to-taxi-blue-light flex flex-col items-center justify-center py-10 px-6">
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <canvas
            ref={canvasRef}
            className={`block transition-opacity duration-300 ${rendered ? "opacity-100" : "opacity-0"}`}
          />
          {!rendered && (
            <div className="w-[280px] h-[280px] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-taxi-yellow/30 border-t-taxi-yellow rounded-full animate-spin" />
            </div>
          )}
        </div>
        <p className="text-white/60 text-xs mt-4 text-center">
          Scan → Bewertungsseite für {driverName}
        </p>
      </div>

      {/* URL bar */}
      <div className="px-6 py-4 border-b border-gray-50">
        <p className="text-xs text-gray-400 mb-1.5">Bewertungslink</p>
        <div className="flex items-center gap-2">
          <span className="flex-1 text-sm text-taxi-blue font-mono bg-gray-50 rounded-lg px-3 py-2 truncate">
            {reviewUrl}
          </span>
          <button
            onClick={handleCopyUrl}
            title="Link kopieren"
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-taxi-blue hover:border-taxi-blue transition-colors"
          >
            {copied ? <CheckCheck className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Link öffnen"
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-taxi-blue hover:border-taxi-blue transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4">
        <button
          onClick={handleDownloadPng}
          disabled={!rendered}
          className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 shrink-0" />
          PNG herunterladen
        </button>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Druckoptimiert · 328 × 328 px mit weißem Rand
        </p>
      </div>
    </div>
  );
}
