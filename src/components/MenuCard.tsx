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
    <div className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full transition-all duration-200 ${!item.isAvailable ? 'opacity-60 grayscale' : 'hover:shadow-md active:scale-[0.99]'}`}>
      <div className="relative aspect-square bg-slate-100">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <span className="bg-white text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Habis</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{item.name}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed">{item.description}</p>
        </div>
        
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-black text-accent text-sm whitespace-nowrap">
            {formatPrice(item.price)}
          </span>
          
          {item.isAvailable && (
            <div className="flex items-center">
              {quantity > 0 ? (
                <div className="flex items-center bg-accent/10 rounded-full p-1 border border-accent/20">
                  <button 
                    onClick={() => onUpdateQuantity(quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-accent shadow-sm active:scale-90 transition-transform"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-2.5 font-bold text-slate-900 text-sm">{quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-accent rounded-full text-white shadow-sm active:scale-90 transition-transform"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onAdd}
                  className="bg-accent text-white p-2 rounded-xl shadow-lg shadow-accent/20 active:scale-90 transition-all hover:bg-orange-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
