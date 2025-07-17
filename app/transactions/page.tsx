
'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import TransactionList from '../../components/Transactions/TransactionList';
import TransactionModal from '../../components/Transactions/TransactionModal';
import TransactionOverview from './TransactionOverview';
import TransactionFilters from './TransactionFilters';
import { Transaction, googleSheetsService } from '../../lib/googleSheets';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [activeFilters, setActiveFilters] = useState({
    type: 'all' as 'all' | 'income' | 'expense',
    status: 'all' as 'all' | 'completed' | 'pending',
    category: 'all'
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, searchTerm, dateRange, activeFilters]);

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

  const applyFilters = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateRange.start) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(dateRange.start));
    }

    if (dateRange.end) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(dateRange.end));
    }

    if (activeFilters.type !== 'all') {
      filtered = filtered.filter(t => t.type === activeFilters.type);
    }

    if (activeFilters.status !== 'all') {
      filtered = filtered.filter(t => t.status === activeFilters.status);
    }

    if (activeFilters.category !== 'all') {
      filtered = filtered.filter(t => t.category === activeFilters.category);
    }

    setFilteredTransactions(filtered);
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

  const handleBulkActions = (action: string, selectedIds: string[]) => {
    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedIds.length} selected transactions?`)) {
          setTransactions(prev => prev.filter(t => !selectedIds.includes(t.id)));
        }
        break;
      case 'mark-completed':
        setTransactions(prev => prev.map(t => 
          selectedIds.includes(t.id) ? { ...t, status: 'completed' as const } : t
        ));
        break;
      case 'mark-pending':
        setTransactions(prev => prev.map(t => 
          selectedIds.includes(t.id) ? { ...t, status: 'pending' as const } : t
        ));
        break;
    }
  };

  const exportTransactions = (format: 'csv' | 'pdf') => {
    const data = filteredTransactions.map(t => ({
      Date: t.date,
      Description: t.description,
      Category: t.category,
      Amount: t.amount,
      Type: t.type,
      Status: t.status
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Transaction Management</h1>
                <p className="text-purple-100 text-lg">Comprehensive transaction tracking and analysis</p>
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <i className="ri-exchange-line text-xl"></i>
                    <span>Real-time Tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-filter-line text-xl"></i>
                    <span>Advanced Filtering</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-download-line text-xl"></i>
                    <span>Export Options</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => exportTransactions('csv')}
                  className="bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-download-line mr-2"></i>
                  Export CSV
                </button>
                <button
                  onClick={handleAddTransaction}
                  className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap shadow-lg"
                >
                  <i className="ri-add-line mr-2"></i>
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Overview */}
        <TransactionOverview transactions={filteredTransactions} />

        {/* Filters */}
        <TransactionFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          transactions={transactions}
        />

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onBulkActions={handleBulkActions}
          showBulkActions={true}
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
