import React from 'react';

interface PaymentMethodCardProps {
  id: 'cashier' | 'qris';
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ id: _id, title, description, icon, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-5 rounded-3xl border-2 text-left transition-all duration-200 mb-4 flex items-center ${
        selected 
          ? 'border-accent bg-accent/5 ring-4 ring-accent/5' 
          : 'border-slate-100 bg-white hover:border-slate-200'
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-colors ${
        selected ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-slate-50 text-slate-400'
      }`}>
        {icon}
      </div>
      
      <div className="flex-grow">
        <h4 className={`font-bold ${selected ? 'text-slate-900' : 'text-slate-600'}`}>{title}</h4>
        <p className="text-xs text-slate-400 font-medium">{description}</p>
      </div>

      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
        selected ? 'border-accent bg-accent' : 'border-slate-200 bg-white'
      }`}>
        {selected && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default PaymentMethodCard;
