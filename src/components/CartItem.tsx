import React from 'react';
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (newQty: number) => void;
  onUpdateNote: (note: string) => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onUpdateNote, onRemove }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-3 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex-shrink-0 overflow-hidden">
          {/* In a real app we'd fetch the image from menuItemsCache, but for now we use placeholder or simple icon */}
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-900 leading-tight">{item.menuItemName}</h3>
              <button 
                onClick={onRemove}
                className="text-slate-300 hover:text-red-500 transition-colors p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <p className="text-accent font-black text-sm mt-1">{formatPrice(item.menuItemPrice)}</p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
              <button 
                onClick={() => onUpdateQuantity(item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-slate-600 shadow-sm active:scale-90 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-3 font-bold text-slate-900 text-sm">{item.quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center bg-slate-900 rounded-full text-white shadow-sm active:scale-90 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Subtotal</span>
              <span className="font-black text-slate-900">{formatPrice(item.menuItemPrice * item.quantity)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-dashed border-slate-100">
        <input 
          type="text"
          placeholder="Tambah catatan (contoh: pedas, tanpa bawang...)"
          className="w-full bg-slate-50 border-none focus:ring-0 text-xs py-2 px-3 rounded-xl text-slate-600 italic outline-none focus:bg-white transition-colors"
          value={item.note || ''}
          onChange={(e) => onUpdateNote(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CartItem;
