import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Invoice {
  date: string;
  desc: string;
  amount: string;
  status: string;
}

const InvoiceTab: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const formatCurrency = (amount: string) => {
  const numericAmount = Number(
    amount.replace(/[^0-9.-]+/g, '')
  );

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(numericAmount);
};
  
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user?.token) {
        setError('Please log in to view invoices');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/invoices`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setInvoices(data);
        } else {
          const errorData = await res.json();
          setError(errorData.message || 'Failed to fetch invoices');
        }
      } catch (err) {
        console.error('Fetch Invoices Error:', err);
        setError('An error occurred while fetching invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Description', 'Amount', 'Status'],
      ...invoices.map((inv) => [inv.date, inv.desc, inv.amount, inv.status]),
    ]
      .map((row) => row.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoices.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-loos-wide text-3xl text-orange">Billing History</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-6 py-3 bg-orange text-black rounded-xl"
          onClick={handleExport}
        >
          <Download className="w-5 h-5" />
          Export Statements
        </motion.button>
      </div>
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4 p-4 border-b border-white/10 font-loos-wide">
          <span>Date</span>
          <span>Description</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-white/10">
          {loading && (
            <div className="p-4 text-center font-aeroport text-white/80">Loading invoices...</div>
          )}
          {error && (
            <div className="p-4 text-center font-aeroport text-red-500">{error}</div>
          )}
          {!loading && !error && invoices.length === 0 && (
            <div className="p-4 text-center font-aeroport text-white/80">No invoices found</div>
          )}
          {!loading &&
            !error &&
            invoices.map((invoice, index) => (
              <motion.div
                key={index}
                whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                className="grid grid-cols-4 p-4 cursor-pointer transition-all"
              >
                <span className="font-aeroport">{invoice.date}</span>
                <span className="font-aeroport">{invoice.desc}</span>
                <span className="font-loos-wide text-orange">{formatCurrency(invoice.amount)}</span>
                <span className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${invoice.status === 'Paid' ? 'bg-green-400' : 'bg-red-400'}`} />
                  {invoice.status}
                </span>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceTab;
