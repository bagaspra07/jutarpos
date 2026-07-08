import React from 'react';
import type { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onUpdateQuantity: (newQty: number) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, quantity, onAdd, onUpdateQuantity }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`bg-white rounded-3xl p-5 flex items-center justify-between gap-4 border border-slate-100 shadow-sm transition-all duration-200 ${!item.isAvailable ? 'opacity-60 grayscale' : 'hover:shadow-md active:scale-[0.995]'}`}>
      <div className="flex-grow text-left">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <h3 className="font-extrabold text-slate-900 text-base leading-snug">{item.name}</h3>
          {!item.isAvailable && (
            <span className="bg-red-50 text-red-600 border border-red-100 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
              Habis
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed max-w-[90%]">{item.description}</p>
        )}
        <span className="font-black text-accent text-base">
          {formatPrice(item.price)}
        </span>
      </div>

      <div className="shrink-0">
        {item.isAvailable && (
          <div className="flex items-center">
            {quantity > 0 ? (
              <div className="flex items-center bg-accent/5 rounded-full p-1 border border-accent/10">
                <button 
                  onClick={() => onUpdateQuantity(quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-accent shadow-sm active:scale-90 transition-transform"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                  </svg>
                </button>
                <span className="px-3.5 font-bold text-slate-900 text-sm">{quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-accent text-white rounded-full shadow-sm active:scale-90 transition-transform"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={onAdd}
                className="bg-accent text-white px-5 py-2.5 rounded-full shadow-lg shadow-accent/20 active:scale-95 transition-all hover:bg-orange-600 font-extrabold text-xs flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                Tambah
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
