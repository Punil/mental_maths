import React, { useState, useEffect } from 'react';
import { Tablet, QrCode, Copy, Check, ExternalLink, Wifi, ShieldCheck } from 'lucide-react';

export default function DevicePairing() {
  const [networkInfo, setNetworkInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/network')
      .then(res => res.json())
      .then(data => {
        setNetworkInfo(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch network info:', err);
        setLoading(false);
      });
  }, []);

  const handleCopy = () => {
    if (!networkInfo?.lanUrl) return;
    navigator.clipboard.writeText(networkInfo.lanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lanUrl = networkInfo?.lanUrl || `http://${window.location.hostname}:3000`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center">
        <div className="w-14 h-14 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-3 text-indigo-600">
          <Tablet className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-black text-slate-800">
          Connect Child's Tablet
        </h2>
        <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
          Scan the QR code with your child's iPad or Android tablet to open the mental maths portal on the tablet immediately.
        </p>

        {/* QR Code Container */}
        <div className="my-6 inline-block p-4 bg-white rounded-3xl shadow-md border-2 border-indigo-100">
          {networkInfo?.qrDataUrl ? (
            <img
              src={networkInfo.qrDataUrl}
              alt="Scan QR code to access from tablet"
              className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-2xl mx-auto"
            />
          ) : (
            <div className="w-56 h-56 sm:w-64 sm:h-64 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <QrCode className="w-16 h-16 animate-pulse" />
            </div>
          )}
        </div>

        {/* LAN URL Display & Copy */}
        <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 pl-2 overflow-hidden text-left">
            <Wifi className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-mono font-bold text-slate-800 text-sm truncate">
              {lanUrl}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-sm touch-btn"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <a
              href={lanUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200 transition"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Easy Instructions Steps */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
        <h3 className="font-extrabold text-indigo-950 text-base mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          Easy 3-Step Setup for Tablet
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-white/70 p-3.5 rounded-2xl border border-indigo-100">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </span>
            <div className="text-xs sm:text-sm text-slate-700">
              <strong className="text-slate-900 font-bold block">Connect to same Wi-Fi</strong>
              Make sure the tablet is connected to the same home Wi-Fi network as this computer.
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/70 p-3.5 rounded-2xl border border-indigo-100">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </span>
            <div className="text-xs sm:text-sm text-slate-700">
              <strong className="text-slate-900 font-bold block">Scan the QR code</strong>
              Open the camera app on the tablet, aim at the QR code above, and tap the prompt that appears.
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/70 p-3.5 rounded-2xl border border-indigo-100">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </span>
            <div className="text-xs sm:text-sm text-slate-700">
              <strong className="text-slate-900 font-bold block">Hand tablet to child</strong>
              The child can choose Grade 2 or Grade 3, solve 15 questions per test using the on-screen touch pad & scratchpad, and you can watch their live score!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
