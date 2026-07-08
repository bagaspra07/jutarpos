import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { api } from '../lib/api';

const WelcomePage: React.FC = () => {
  const { tableId: tableIdParam } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const setSession = useCartStore((state) => state.setSession);
  const setCustomerName = useCartStore((state) => state.setCustomerName);

  const savedSessionId = useCartStore((state) => state.sessionId);
  const savedTableId = useCartStore((state) => state.tableId);
  const savedCustomerName = useCartStore((state) => state.customerName);

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tableId = tableIdParam ? parseInt(tableIdParam.replace('meja-', ''), 10) : null;

  // Prefill name from storage
  useEffect(() => {
    if (savedCustomerName) {
      setName(savedCustomerName);
    }
  }, [savedCustomerName]);

  // Session detection & auto-join/redirect logic
  useEffect(() => {
    async function checkActiveSession() {
      if (!tableId) return;

      // 1. If we have a saved session for the SAME table in localStorage, check if it's still open
      if (savedTableId === tableId && savedSessionId) {
        setLoading(true);
        try {
          const isOpen = await api.isSessionOpen(savedSessionId);
          if (isOpen) {
            // Still active and valid. Redirect directly to menu!
            navigate('/menu');
            return;
          }
        } catch (err) {
          console.error('Failed to check active session status:', err);
        } finally {
          setLoading(false);
        }
      }

      // 2. If table has changed or the saved session is closed, clear the old session/cart
      if (savedTableId !== tableId || !savedSessionId) {
        useCartStore.getState().clearCart();
        // Reset session fields
        useCartStore.setState({ sessionId: null, tableId: null, tableName: null });
      }

      // 3. Check if there's already an active open session in Supabase for this table
      try {
        const activeSession = await api.getActiveSession(tableId);
        if (activeSession) {
          // An active session exists! We automatically join it.
          // If the customer already has their name saved, skip directly to menu
          if (savedCustomerName) {
            setSession(activeSession.id, tableId, `Meja ${tableId}`);
            navigate('/menu');
          }
        }
      } catch (err) {
        console.error('Failed to look up active session:', err);
      }
    }

    checkActiveSession();
  }, [tableId, savedSessionId, savedTableId, savedCustomerName, navigate, setSession]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableId) {
      setError('Nomor meja tidak valid. Silakan scan ulang QR code di meja Anda.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if there is already an active session in Supabase
      const activeSession = await api.getActiveSession(tableId);
      let sessId = '';
      let tableNameVal = `Meja ${tableId}`;

      if (activeSession) {
        sessId = activeSession.id;
      } else {
        // Otherwise create a new session
        const session = await api.createSession(tableId, name || undefined);
        sessId = session.sessionId;
        tableNameVal = session.tableName;
      }
      
      setSession(sessId, tableId, tableNameVal);
      if (name) setCustomerName(name);
      
      navigate('/menu');
    } catch (err: any) {
      setError(err.message || 'Gagal memulai sesi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!tableId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background text-text-main">
        <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100 text-center">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 11v1m5-4h1m-11 0h1m11.364-7.364l-.707.707m-11.314 11.314l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 font-display">Scan QR Code</h1>
          <p className="text-text-muted mb-0">Silakan scan QR code yang tertempel di meja Anda untuk memulai pemesanan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background text-text-main">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-bold mb-4">
            Meja {tableId}
          </div>
          <h1 className="text-4xl font-black text-text-main mb-2 tracking-tight">Juta Rasa</h1>
          <p className="text-text-muted">Nikmati kelezatan masakan khas nusantara</p>
        </div>

        <form onSubmit={handleStart} className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-accent/5 border border-slate-50">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-bold text-text-muted mb-2 ml-1">
              Nama Anda (Opsional)
            </label>
            <input
              type="text"
              id="name"
              placeholder="Contoh: Bagas"
              className="w-full px-5 py-4 bg-slate-50 border-transparent focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10 rounded-2xl transition-all duration-200 outline-none text-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent hover:bg-orange-600 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg shadow-accent/30 hover:shadow-accent/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center text-lg"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                Lanjut Pesan
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-text-muted text-sm">
          Dengan melanjutkan, Anda menyetujui sistem pemesanan mandiri Juta Rasa.
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
