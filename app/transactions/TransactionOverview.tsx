'use client';

import { Transaction } from '../../lib/googleSheets';

interface TransactionOverviewProps {
  transactions: Transaction[];
}

export default function TransactionOverview({ transactions }: TransactionOverviewProps) {
  const calculateStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingAmount = transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);

    const thisMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const now = new Date();
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear();
    });

    const monthlyIncome = thisMonthTransactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = thisMonthTransactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      pendingAmount,
      monthlyIncome,
      monthlyExpenses,
      monthlyNet: monthlyIncome - monthlyExpenses,
      totalTransactions: transactions.length
    };
  };

  const stats = calculateStats();

  const netProfitClass = stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600';
  const netProfitIcon = stats.netProfit >= 0 ? 'up' : 'down';
  const netProfitIconColor = stats.netProfit >= 0 ? 'green' : 'red';
  const netProfitBgGradient = stats.netProfit >= 0 ? 'from-blue-500 to-indigo-500' : 'from-orange-500 to-red-500';

  const formatCurrency = (amount: number) => {
    return `₱${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const getChangeIndicator = (current: number, isPositive: boolean) => {
    const percentage = Math.floor(Math.random() * 20) + 5;
    return {
      value: `${isPositive ? '+' : '-'}${percentage}%`,
      isPositive
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(stats.totalIncome)}</p>
            <div className="flex items-center space-x-1">
              <i className="ri-arrow-up-line text-green-500 text-sm"></i>
              <span className="text-sm font-medium text-green-600">+15.3% from last month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500">
            <i className="ri-arrow-up-line text-white text-xl"></i>
          </div>
        </div>
      </div>

      <div className=\"bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1\">
        <div className=\"flex items-center justify-between\">
          <div className=\"flex-1\">
            <p className=\"text-sm font-medium text-gray-600 mb-1\">Total Expenses</p>
            <p className=\"text-2xl font-bold text-gray-900 mb-2\">{formatCurrency(stats.totalExpenses)}</p>
            <div className=\"flex items-center space-x-1\">
              <i className=\"ri-arrow-down-line text-red-500 text-sm\"></i>
              <span className=\"text-sm font-medium text-red-600\">-8.2% from last month</span>
            </div>
          </div>
          <div className=\"w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500\">
            <i className=\"ri-arrow-down-line text-white text-xl\"></i>
          </div>
        </div>
      </div>

      <div className=\"bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1\">
        <div className=\"flex items-center justify-between\">
          <div className=\"flex-1\">
            <p className=\"text-sm font-medium text-gray-600 mb-1\">Net Profit</p>
  const netProfitClass = stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600';

            <p className={"text-2xl font-bold mb-2 " + netProfitClass}>
              {stats.netProfit >= 0 ? '+' : '-'}{formatCurrency(stats.netProfit)}
            </p>
            <div className=\"flex items-center space-x-1\">
              <i className={`ri-trending-${stats.netProfit >= 0 ? 'up' : 'down'}-line text-${stats.netProfit >= 0 ? 'green' : 'red'}-500 text-sm`}></i>
              <span className={`text-sm font-medium text-${stats.netProfit >= 0 ? 'green' : 'red'}-600`}>
                {stats.netProfit >= 0 ? '+' : '-'}12.5% growth
              </span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-${stats.netProfit >= 0 ? 'blue' : 'orange'}-500 to-${stats.netProfit >= 0 ? 'indigo' : 'red'}-500`}>
            <i className=\"ri-money-dollar-circle-line text-white text-xl\"></i>
          </div>
        </div>
      </div>

      <div className=\"bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1\">
        <div className=\"flex items-center justify-between\">
          <div className=\"flex-1\">
            <p className=\"text-sm font-medium text-gray-600 mb-1\">Pending Amount</p>
            <p className=\"text-2xl font-bold text-gray-900 mb-2\">{formatCurrency(stats.pendingAmount)}</p>
            <div className=\"flex items-center space-x-1\">
              <i className=\"ri-time-line text-yellow-500 text-sm\"></i>
              <span className=\"text-sm font-medium text-yellow-600\">Awaiting completion</span>
            </div>
          </div>
          <div className=\"w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-500\">
            <i className=\"ri-time-line text-white text-xl\"></i>
          </div>
        </div>
      </div>

      {/* Monthly Overview Cards */}
      <div className=\"lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100\">
        <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">This Month Overview</h3>
        <div className=\"grid grid-cols-2 gap-4\">
          <div className=\"text-center p-4 bg-green-50 rounded-xl\">
            <i className=\"ri-arrow-up-line text-2xl text-green-500 mb-2\"></i>
            <p className=\"text-sm text-gray-600 mb-1\">Monthly Income</p>
            <p className=\"text-xl font-bold text-green-600\">{formatCurrency(stats.monthlyIncome)}</p>
          </div>
          <div className=\"text-center p-4 bg-red-50 rounded-xl\">
            <i className=\"ri-arrow-down-line text-2xl text-red-500 mb-2\"></i>
            <p className=\"text-sm text-gray-600 mb-1\">Monthly Expenses</p>
            <p className=\"text-xl font-bold text-red-600\">{formatCurrency(stats.monthlyExpenses)}</p>
          </div>
        </div>
        <div className=\"mt-4 p-4 bg-blue-50 rounded-xl text-center\">
          <p className=\"text-sm text-gray-600 mb-1\">Monthly Net</p>
          <p className={`text-2xl font-bold ${stats.monthlyNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.monthlyNet >= 0 ? '+' : '-'}{formatCurrency(stats.monthlyNet)}
          </p>
        </div>
      </div>

      {/* Transaction Statistics */}
      <div className=\"lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100\">
        <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Transaction Statistics</h3>
        <div className=\"grid grid-cols-3 gap-4\">
          <div className=\"text-center p-4 bg-purple-50 rounded-xl\">
            <i className=\"ri-database-line text-2xl text-purple-500 mb-2\"></i>
            <p className=\"text-sm text-gray-600 mb-1\">Total Transactions</p>
            <p className=\"text-xl font-bold text-purple-600\">{stats.totalTransactions}</p>
          </div>
          <div className=\"text-center p-4 bg-blue-50 rounded-xl\">
            <i className=\"ri-check-line text-2xl text-blue-500 mb-2\"></i>
            <p className=\"text-sm text-gray-600 mb-1\">Completed</p>
            <p className=\"text-xl font-bold text-blue-600\">
              {transactions.filter(t => t.status === 'completed').length}
            </p>
          </div>
          <div className=\"text-center p-4 bg-yellow-50 rounded-xl\">
            <i className=\"ri-time-line text-2xl text-yellow-500 mb-2\"></i>
            <p className=\"text-sm text-gray-600 mb-1\">Pending</p>
            <p className=\"text-xl font-bold text-yellow-600\">
              {transactions.filter(t => t.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}