import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface QRISPanelProps {
  orderId: number;
  sessionId: string;
  onPaymentConfirmed: () => void;
}

const QRISPanel: React.FC<QRISPanelProps> = ({ orderId, sessionId, onPaymentConfirmed }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    generateQR();
  }, [orderId]);

  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      
      setTimeLeft(diff);
      
      if (diff === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const generateQR = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.generateQRIS(orderId, sessionId);
      setQrCodeUrl(data.qrCodeUrl);
      setExpiresAt(data.expiresAt);
    } catch (err: any) {
      console.error('QRIS Generation failed', err);
      setError(err.message || 'Gagal generate QRIS');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in duration-500">
      <div className="w-full max-w-[240px] aspect-square bg-slate-50 rounded-3xl mb-6 relative overflow-hidden flex items-center justify-center border border-slate-100">
        {loading ? (
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-32 h-32 bg-slate-200 rounded-2xl mb-4"></div>
            <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
          </div>
        ) : (
          <>
            <img src={qrCodeUrl || ''} alt="QRIS Payment" className="w-full h-full p-4" />
            {timeLeft === 0 && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                <p className="text-red-500 font-bold mb-3">QR Sudah Kadaluarsa</p>
                <button 
                  onClick={generateQR}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Generate Ulang
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 border border-red-100 p-3 rounded-xl w-full">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-black text-slate-900 mb-1">Scan QRIS</h3>
        <p className="text-xs text-slate-400 font-medium">Bisa bayar pakai OVO, GoPay, ShopeePay, atau Mobile Banking apa saja</p>
      </div>

      <div className="w-full bg-slate-50 rounded-2xl p-4 mb-8 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sisa Waktu</span>
        <span className={`font-black text-xl ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      <button 
        onClick={onPaymentConfirmed}
        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center"
      >
        Saya Sudah Bayar
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <p className="mt-6 text-[10px] text-slate-300 font-medium">
        Pembayaran Anda akan terverifikasi secara otomatis oleh sistem kami.
      </p>
    </div>
  );
};

export default QRISPanel;
