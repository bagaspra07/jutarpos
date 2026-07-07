import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { api } from '../lib/api';
import type { MenuItem } from '../types';
import MenuCard from '../components/MenuCard';
import FloatingCartBar from '../components/FloatingCartBar';

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { tableId, tableName, items: cartItems, addItem, updateQuantity, removeItem } = useCartStore();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If no session, redirect to welcome
    if (!tableId) {
      navigate('/');
      return;
    }

    fetchMenu();
  }, [tableId, navigate]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const data = await api.getMenu();
      setCategories(['Semua', ...data.categories]);
      setMenuItems(data.items);
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil menu');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartQuantity = (menuItemId: number) => {
    const cartItem = cartItems.find(i => i.menuItemId === menuItemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleUpdateQuantity = (item: MenuItem, newQty: number) => {
    if (newQty <= 0) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQty);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center mr-3 shadow-lg shadow-accent/20">
            <span className="text-white font-black text-xl">JR</span>
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-none">Juta Rasa</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Self-Order System</p>
          </div>
        </div>
        
        <div className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600 flex items-center">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          {tableName || `Meja ${tableId}`}
        </div>
      </header>

      {/* Hero / Search */}
      <div className="px-4 pt-6 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari menu favorit Anda..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div 
        className="flex overflow-x-auto px-4 py-2 gap-2 no-scrollbar scroll-smooth"
        ref={scrollContainerRef}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeCategory === cat 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="px-4 mt-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white aspect-[3/4] rounded-3xl border border-slate-100"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-3xl text-center border border-red-100">
            <p className="font-bold mb-2">Waduh! Ada masalah</p>
            <p className="text-sm opacity-80 mb-4">{error}</p>
            <button 
              onClick={fetchMenu}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold active:scale-95 transition-transform"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">Menu tidak ditemukan</p>
            <p className="text-slate-300 text-xs mt-1">Coba kata kunci lain atau pilih kategori yang berbeda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="animate-in fade-in zoom-in-95 duration-500">
                <MenuCard 
                  item={item} 
                  quantity={getCartQuantity(item.id)}
                  onAdd={() => addItem({ menuItemId: item.id, menuItemName: item.name, menuItemPrice: item.price })}
                  onUpdateQuantity={(newQty) => handleUpdateQuantity(item, newQty)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      <FloatingCartBar />
    </div>
  );
};

export default MenuPage;
