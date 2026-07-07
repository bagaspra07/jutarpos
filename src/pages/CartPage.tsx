import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import CartItem from '../components/CartItem';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    updateQuantity, 
    updateNote, 
    removeItem, 
    orderNote, 
    setOrderNote,
    tableId,
    tableName
  } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + (item.menuItemPrice * item.quantity), 0);
  const serviceFee = items.length > 0 ? 1000 : 0;
  const taxAmount = Math.floor(subtotal * 0.1);
  const total = subtotal + serviceFee + taxAmount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 px-4 py-4 border-b border-slate-100 flex items-center">
        <button 
          onClick={() => navigate('/menu')}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 active:scale-90 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-grow text-center pr-10">
          <h1 className="text-lg font-black text-slate-900 tracking-tight">Keranjang Pesanan</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tableName || `Meja ${tableId}`}</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-grow px-4 py-6 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Keranjang Kosong</h2>
            <p className="text-slate-400 text-sm mb-8">Wah, keranjangmu masih kosong nih. Yuk, pilih menu favoritmu dulu!</p>
            <button 
              onClick={() => navigate('/menu')}
              className="px-8 py-3 bg-accent text-white font-bold rounded-2xl shadow-lg shadow-accent/20 active:scale-95 transition-all"
            >
              Lihat Menu
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="mb-8">
              {items.map((item) => (
                <CartItem 
                  key={item.menuItemId}
                  item={item}
                  onUpdateQuantity={(qty) => updateQuantity(item.menuItemId, qty)}
                  onUpdateNote={(note) => updateNote(item.menuItemId, note)}
                  onRemove={() => removeItem(item.menuItemId)}
                />
              ))}
            </div>

            {/* Global Note */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
              <label className="block text-sm font-bold text-slate-900 mb-3 ml-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Catatan Pesanan (Optional)
              </label>
              <textarea 
                className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-accent/10 rounded-2xl p-4 text-sm text-slate-600 italic outline-none min-h-[100px] resize-none focus:bg-white transition-all"
                placeholder="Ada pesan tambahan untuk dapur? Tulis di sini ya..."
                value={orderNote || ''}
                onChange={(e) => setOrderNote(e.target.value)}
              ></textarea>
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
              <h3 className="font-bold text-slate-900 mb-4 ml-1 uppercase text-xs tracking-widest text-slate-400">Rincian Pembayaran</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Biaya Layanan</span>
                  <span className="text-slate-900 font-bold">{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">PPN (10%)</span>
                  <span className="text-slate-900 font-bold">{formatPrice(taxAmount)}</span>
                </div>
                <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-slate-900 font-black text-lg">Total</span>
                  <span className="text-accent font-black text-xl">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer CTA */}
      {items.length > 0 && (
        <div className="bg-white p-4 pb-8 border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <button 
            onClick={handleCheckout}
            className="w-full py-4 bg-accent text-white font-bold rounded-2xl shadow-xl shadow-accent/30 flex items-center justify-center text-lg active:scale-[0.98] transition-all hover:bg-orange-600"
          >
            Lanjut ke Pembayaran
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
