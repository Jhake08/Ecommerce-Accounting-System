'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Layout/Header';
import StatsCard from '../components/Dashboard/StatsCard';
import RevenueChart from '../components/Dashboard/RevenueChart';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionModal from '../components/Transactions/TransactionModal';
import { Transaction, googleSheetsService } from '../lib/googleSheets';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await googleSheetsService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setModalMode('add');
    setEditingTransaction(null);
    setShowTransactionModal(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setModalMode('edit');
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleSaveTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTransaction = await googleSheetsService.addTransaction(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      setShowTransactionModal(false);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const calculateStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalIncome - totalExpenses;
    const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      pendingTransactions
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
            <p className="text-gray-600">Loading your accounting data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome to AccounTech Pro</h1>
                <p className="text-blue-100 text-lg">Your professional accounting system with Google Sheets integration</p>
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <i className="ri-shield-check-line text-xl"></i>
                    <span>Secure & Professional</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-cloud-line text-xl"></i>
                    <span>Cloud Synced</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-bar-chart-line text-xl"></i>
                    <span>Real-time Analytics</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleAddTransaction}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap shadow-lg"
              >
                <i className="ri-add-line mr-2"></i>
                New Transaction
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Income"
            value={`₱${stats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            change="+12.5%"
            changeType="increase"
            icon="ri-arrow-up-line"
            color="bg-gradient-to-r from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Total Expenses"
            value={`₱${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            change="-8.2%"
            changeType="decrease"
            icon="ri-arrow-down-line"
            color="bg-gradient-to-r from-red-500 to-pink-500"
          />
          <StatsCard
            title="Net Profit"
            value={`₱${stats.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            change="+15.3%"
            changeType="increase"
            icon="ri-money-dollar-circle-line"
            color="bg-gradient-to-r from-blue-500 to-indigo-500"
          />
          <StatsCard
            title="Pending Transactions"
            value={stats.pendingTransactions.toString()}
            change="-2"
            changeType="decrease"
            icon="ri-time-line"
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleAddTransaction}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <i className="ri-add-line text-white"></i>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Add Transaction</div>
                    <div className="text-sm text-gray-600">Record income or expense</div>
                  </div>
                </button>

                <Link href="/bills" className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <i className="ri-file-list-line text-white"></i>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Due Bills</div>
                    <div className="text-sm text-gray-600">Manage payment reminders</div>
                  </div>
                </Link>

                <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <i className="ri-bar-chart-line text-white"></i>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">View Reports</div>
                    <div className="text-sm text-gray-600">Generate financial reports</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
              <div className="space-y-3">
                {[
                  { name: 'Service Revenue', amount: 25000, color: 'bg-green-500', percentage: 45 },
                  { name: 'Office Expenses', amount: 8500, color: 'bg-red-500', percentage: 25 },
                  { name: 'Marketing', amount: 6200, color: 'bg-blue-500', percentage: 18 },
                  { name: 'Utilities', amount: 4100, color: 'bg-yellow-500', percentage: 12 },
                ].map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-600">₱{category.amount.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {category.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <TransactionList
          transactions={transactions.slice(0, 10)}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </main>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
        mode={modalMode}
      />
    </div>
  );
}
