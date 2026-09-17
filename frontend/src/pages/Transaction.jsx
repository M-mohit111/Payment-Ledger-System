import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, ArrowRightLeft, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';

export default function Transaction() {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const idempotencyKey = crypto.randomUUID();
      await api.post('/transactions', {
        fromAccount,
        toAccount,
        amount: Number(amount),
        idempotencyKey,
      });
      setSuccess('Transaction processed successfully! It may take a few seconds to appear.');
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-violet-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      <div className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <ArrowRightLeft className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">Transfer</p>
            <h2 className="mt-1 text-3xl font-black text-slate-900">Send funds</h2>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              From Account ID
            </label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              placeholder="e.g. 64b2c1..."
              value={fromAccount}
              onChange={e => setFromAccount(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm">
              <ArrowRightLeft className="h-5 w-5 rotate-90" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              To Account ID
            </label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              placeholder="e.g. 64b2c2..."
              value={toAccount}
              onChange={e => setToAccount(e.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Amount
            </label>
            <div className="relative">
              <Wallet className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="number"
                min="1"
                required
                className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-3 text-lg font-bold text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-600 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Processing Transfer...' : 'Confirm Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
}
