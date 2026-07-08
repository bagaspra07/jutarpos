import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { api } from '../lib/api';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    orderNote, 
    customerName, 
    setCustomerName, 
    sessionId, 
    tableId, 
    tableName,
    clearCart 
  } = useCartStore();

  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [onlineSettings, setOnlineSettings] = useState({
    service_charge_enabled: true,
    service_charge_amount: 1000
  });

  useEffect(() => {
    api.getOnlineSettings()
      .then(setOnlineSettings)
      .catch(() => {});
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (item.menuItemPrice * item.quantity), 0);
  const serviceFee = items.length > 0 && onlineSettings.service_charge_enabled 
    ? Number(onlineSettings.service_charge_amount) 
    : 0;
  const taxAmount = Math.floor(subtotal * 0.1);
  const total = subtotal + serviceFee + taxAmount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleOrder = async () => {
    if (!sessionId) {
      setError('Sesi tidak valid. Silakan scan ulang QR code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        sessionId,
        items: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          note: item.note
        })),
        orderNote: orderNote || undefined,
        paymentMethod: 'cashier' as const
      };

      const result = await api.createOrder(orderData);
      clearCart();
      navigate(`/confirmation/${result.orderNumber}`);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim pesanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 px-4 py-4 border-b border-slate-100 flex items-center">
        <button 
          onClick={() => navigate('/cart')}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 active:scale-90 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-grow text-center pr-10">
          <h1 className="text-lg font-black text-slate-900 tracking-tight">Pembayaran</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tableName || `Meja ${tableId}`}</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-grow px-4 py-6 overflow-y-auto">
        {/* Order Summary Collapsed */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 mb-6 overflow-hidden">
          <button 
            onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
              </svg>
              <span className="font-bold">Ringkasan Pesanan</span>
              <span className="ml-2 bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-black">{items.length} Item</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOrderSummaryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isOrderSummaryOpen && (
            <div className="px-4 pb-4 animate-in slide-in-from-top duration-300">
              <div className="space-y-3 pt-2 border-t border-slate-50">
                {items.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between text-sm">
                    <div className="flex-grow">
                      <span className="text-slate-900 font-medium">{item.menuItemName}</span>
                      <span className="text-slate-400 ml-2 font-bold text-xs">x{item.quantity}</span>
                    </div>
                    <span className="text-slate-900 font-bold">{formatPrice(item.menuItemPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customer Name */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
          <label className="block text-sm font-bold text-slate-900 mb-3 ml-1">
            Nama Pemesan
          </label>
          <input
            type="text"
            className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-accent/10 rounded-2xl p-4 text-slate-900 font-bold outline-none transition-all"
            placeholder="Masukkan nama Anda"
            value={customerName || ''}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        {/* Payment Method Info */}
        <div className="mb-6">
          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-accent/20 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="font-black text-sm text-orange-900 mb-1">Bayar di Kasir</p>
              <p className="text-xs text-orange-700/80 leading-relaxed">Setelah pesanan dikirim, silakan menuju ke kasir untuk melakukan pembayaran. Tunjukkan nomor pesanan Anda kepada kasir.</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Price Summary */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Total Tagihan</span>
              <span className="text-slate-900 font-bold">{formatPrice(total)}</span>
            </div>
            <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
              <span className="text-slate-900 font-black text-lg">Total Pembayaran</span>
              <span className="text-accent font-black text-xl">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white p-4 pb-8 border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <button 
          onClick={handleOrder}
          disabled={loading || items.length === 0}
          className="w-full py-4 bg-accent text-white font-bold rounded-2xl shadow-xl shadow-accent/30 flex items-center justify-center text-lg active:scale-[0.98] transition-all hover:bg-orange-600 disabled:bg-slate-200 disabled:shadow-none"
        >
          {loading ? (
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              Kirim Pesanan
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
