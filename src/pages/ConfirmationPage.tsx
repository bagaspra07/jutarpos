import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { SelfOrder } from '../types';

const ConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<SelfOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;
    fetchOrder();

    // Poll for status updates every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const data = await api.getOrderByNumber(orderNumber!);
      setOrder(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending_cashier': return 1;
      case 'confirmed':
      case 'preparing': return 2;
      case 'completed': return 3;
      default: return 1;
    }
  };



  if (loading && !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="animate-spin h-12 w-12 text-accent mb-4" />
        <p className="text-slate-400 font-bold">Memuat pesanan...</p>
      </div>
    );
  }

  const currentStep = order ? getStatusStep(order.status) : 1;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-10">
      {/* Success Header */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-sm border-b border-slate-100 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-2">Pesanan Terkirim!</h1>
        <p className="text-slate-400 text-sm font-medium mb-6">Terima kasih, pesanan Anda sedang diproses.</p>
        
        <div className="inline-block bg-slate-100 px-6 py-3 rounded-2xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Nomor Pesanan</p>
          <p className="text-xl font-black text-slate-900 tracking-tight">{orderNumber}</p>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="px-6 -mt-4">
        <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest text-slate-400">Status Pesanan</h3>
          
          <div className="relative space-y-8">
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
            
            {/* Step 1 */}
            <div className="flex items-start relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
                {currentStep > 1 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <p className={`font-bold text-sm ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-300'}`}>Pesanan Dikirim</p>
                <p className="text-[10px] text-slate-400">{order?.createdAt ? new Date(order.createdAt).toLocaleTimeString() : ''}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
                {currentStep > 2 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                ) : currentStep === 2 ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                ) : null}
              </div>
              <div>
                <p className={`font-bold text-sm ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-300'}`}>Dikonfirmasi Kasir</p>
                <p className="text-[10px] text-slate-400">Sedang disiapkan di dapur</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${currentStep >= 3 ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
                {currentStep === 3 ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                ) : null}
              </div>
              <div>
                <p className={`font-bold text-sm ${currentStep >= 3 ? 'text-slate-900' : 'text-slate-300'}`}>Selesai</p>
                <p className="text-[10px] text-slate-400">Silakan nikmati hidangan Anda</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="px-6 mt-6">
        <div className={`p-6 rounded-3xl border ${order?.paymentMethod === 'qris' ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
          <div className="flex items-center mb-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 ${order?.paymentMethod === 'qris' ? 'bg-blue-500' : 'bg-accent'} text-white`}>
              {order?.paymentMethod === 'qris' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 11v1m5-4h1m-11 0h1m11.364-7.364l-.707.707m-11.314 11.314l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
            </div>
            <h4 className={`font-black text-sm ${order?.paymentMethod === 'qris' ? 'text-blue-900' : 'text-orange-900'}`}>
              {order?.paymentMethod === 'qris' ? 'Pembayaran QRIS Berhasil' : 'Bayar di Kasir'}
            </h4>
          </div>
          <p className={`text-xs font-medium leading-relaxed ${order?.paymentMethod === 'qris' ? 'text-blue-700/80' : 'text-orange-700/80'}`}>
            {order?.paymentMethod === 'qris' 
              ? 'Terima kasih, pembayaran Anda sudah kami terima dan pesanan akan segera diproses oleh tim kami.'
              : 'Silakan menuju ke kasir dan tunjukkan nomor pesanan Anda untuk melakukan pembayaran. Pesanan Anda akan diproses setelah dikonfirmasi oleh kasir.'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 mt-8 space-y-4">
        <button 
          onClick={() => navigate('/')}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center text-lg"
        >
          Pesan Lagi
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
        <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          Sistem Pesan Mandiri © Juta Rasa 2026
        </p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
