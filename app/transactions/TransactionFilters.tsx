
'use client';

import { Transaction } from '../../lib/googleSheets';

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  activeFilters: {
    type: 'all' | 'income' | 'expense';
    status: 'all' | 'completed' | 'pending';
    category: string;
  };
  onFiltersChange: (filters: any) => void;
  transactions: Transaction[];
}

export default function TransactionFilters({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  activeFilters,
  onFiltersChange,
  transactions
}: TransactionFiltersProps) {
  const uniqueCategories = Array.from(new Set(transactions.map(t => t.category)));

  const clearFilters = () => {
    onSearchChange('');
    onDateRangeChange({ start: '', end: '' });
    onFiltersChange({
      type: 'all',
      status: 'all',
      category: 'all'
    });
  };

  const hasActiveFilters = searchTerm || dateRange.start || dateRange.end || 
    activeFilters.type !== 'all' || activeFilters.status !== 'all' || activeFilters.category !== 'all';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer whitespace-nowrap"
          >
            <i className="ri-close-line mr-1"></i>
            Clear All Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Transactions
          </label>
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by description or category..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          />
        </div>

        {/* Quick Date Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Filters
          </label>
          <div className="space-y-2">
            <button
              onClick={() => {
                const today = new Date();
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                onDateRangeChange({
                  start: startOfMonth.toISOString().split('T')[0],
                  end: today.toISOString().split('T')[0]
                });
              }}
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              This Month
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                onDateRangeChange({
                  start: lastMonth.toISOString().split('T')[0],
                  end: endOfLastMonth.toISOString().split('T')[0]
                });
              }}
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Last Month
            </button>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Transaction Type
          </label>
          <div className="flex space-x-2">
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => onFiltersChange({ ...activeFilters, type: type as any })}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeFilters.type === type
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Status
          </label>
          <div className="flex space-x-2">
            {['all', 'completed', 'pending'].map((status) => (
              <button
                key={status}
                onClick={() => onFiltersChange({ ...activeFilters, status: status as any })}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeFilters.status === status
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Category
          </label>
          <select
            value={activeFilters.category}
            onChange={(e) => onFiltersChange({ ...activeFilters, category: e.target.value })}
            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Search: {searchTerm}
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-close-line text-xs"></i>
                </button>
              </span>
            )}
            {activeFilters.type !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Type: {activeFilters.type}
                <button
                  onClick={() => onFiltersChange({ ...activeFilters, type: 'all' })}
                  className="ml-1 w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-close-line text-xs"></i>
                </button>
              </span>
            )}
            {activeFilters.status !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Status: {activeFilters.status}
                <button
                  onClick={() => onFiltersChange({ ...activeFilters, status: 'all' })}
                  className="ml-1 w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-close-line text-xs"></i>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
