import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';

const FloatingCartBar: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  
  if (items.length === 0) return null;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.menuItemPrice * item.quantity), 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <button 
        onClick={() => navigate('/cart')}
        className="w-full bg-slate-900 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between hover:bg-slate-800 active:scale-[0.98] transition-all"
      >
        <div className="flex items-center">
          <div className="relative bg-accent p-2 rounded-2xl mr-4 shadow-lg shadow-accent/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-white text-accent w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-slate-900">
              {itemCount}
            </span>
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Lihat Keranjang</p>
            <p className="text-lg font-black tracking-tight">{formatPrice(subtotal)}</p>
          </div>
        </div>
        
        <div className="flex items-center text-accent font-black">
          <span>Lanjut</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default FloatingCartBar;
