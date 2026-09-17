import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Plus, ArrowRightLeft, Loader2, CreditCard, Wallet, TrendingUp } from 'lucide-react';

const formatCurrency = (value) => {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(number);
};

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      const accountsData = res.data.accounts;

      const accountsWithBalances = await Promise.all(
        accountsData.map(async (acc) => {
          try {
            const balanceRes = await api.get(`/accounts/balance/${acc._id}`);
            return { ...acc, balance: balanceRes.data.balance };
          } catch {
            return { ...acc, balance: 'Error' };
          }
        })
      );

      setAccounts(accountsWithBalances);
    } catch (error) {
      console.error('Failed to fetch accounts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAccounts();
  }, []);

  const createAccount = async () => {
    try {
      await api.post('/accounts');
      await fetchAccounts();
    } catch {
      alert('Failed to create account');
    }
  };

  const totalBalance = accounts.reduce((sum, account) => {
    const value = Number(account.balance);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-[30px] border border-slate-200 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-violet-600" />
        <p className="text-base font-medium text-slate-600">Loading your accounts...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">Overview</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">Your Accounts</h2>
          <p className="mt-1 text-slate-500">Manage balances, transfers, and account activity.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/transaction"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-600 hover:to-teal-700"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Transfer
          </Link>
          <button
            onClick={createAccount}
            className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
          >
            <Plus className="h-4 w-4" />
            New Account
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Total balance</span>
            <Wallet className="h-5 w-5 text-violet-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{formatCurrency(totalBalance)}</div>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Accounts</span>
            <CreditCard className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{accounts.length}</div>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Performance</span>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">+12.4%</div>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-[30px] border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-slate-100 p-4 text-slate-400">
              <CreditCard className="h-12 w-12" />
            </div>
          </div>
          <h3 className="mb-2 text-2xl font-black text-slate-800">No accounts yet</h3>
          <p className="mx-auto mb-6 max-w-md text-slate-500">
            Create your first account to start sending money and tracking your balance.
          </p>
          <button
            onClick={createAccount}
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700"
          >
            Create First Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((acc, index) => {
            const accentClasses = [
              'from-violet-500 to-indigo-600',
              'from-cyan-500 to-blue-600',
              'from-emerald-500 to-teal-600',
              'from-fuchsia-500 to-pink-600',
            ];

            return (
              <div
                key={acc._id}
                className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.12)]"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentClasses[index % accentClasses.length]}`} />

                <div className="mb-5 flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accentClasses[index % accentClasses.length]} text-white shadow-lg`}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${
                      acc.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {acc.status}
                  </span>
                </div>

                <div className="mb-7">
                  <p className="text-sm font-medium text-slate-500">Available Balance</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">{formatCurrency(acc.balance)}</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-400">Account ID</p>
                  <p className="mt-1 truncate font-mono text-sm text-slate-700" title={acc._id}>
                    {acc._id}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
