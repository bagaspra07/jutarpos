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
    <div className={`bg-white rounded-3xl p-3 flex items-center gap-4 border border-slate-100 shadow-sm transition-all duration-200 ${!item.isAvailable ? 'opacity-60 grayscale' : 'hover:shadow-md active:scale-[0.995]'}`}>
      {/* Left: Image */}
      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100/50 flex items-center justify-center">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <span className="bg-white text-slate-900 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">Habis</span>
          </div>
        )}
      </div>

      {/* Middle: Details */}
      <div className="flex-grow text-left min-w-0">
        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug truncate mb-0.5">{item.name}</h3>
        {item.description && (
          <p className="text-[11px] text-slate-400 line-clamp-1 mb-1.5 leading-relaxed">{item.description}</p>
        )}
        <span className="font-black text-accent text-sm sm:text-base">
          {formatPrice(item.price)}
        </span>
      </div>

      {/* Right: Quantity / Add Action */}
      <div className="shrink-0">
        {item.isAvailable && (
          <div className="flex items-center">
            {quantity > 0 ? (
              <div className="flex items-center bg-accent/5 rounded-full p-0.5 border border-accent/10">
                <button 
                  onClick={() => onUpdateQuantity(quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-accent shadow-sm active:scale-90 transition-transform"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                  </svg>
                </button>
                <span className="px-2 font-bold text-slate-900 text-xs sm:text-sm">{quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center bg-accent text-white rounded-full shadow-sm active:scale-90 transition-transform"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={onAdd}
                className="bg-accent text-white w-9 h-9 rounded-2xl shadow-lg shadow-accent/20 active:scale-95 transition-all hover:bg-rose-700 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
