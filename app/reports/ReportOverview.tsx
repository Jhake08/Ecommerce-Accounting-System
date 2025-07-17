'use client';

import { Transaction, DueBill } from '../../lib/googleSheets';

interface ReportOverviewProps {
  transactions: Transaction[];
  bills: DueBill[];
  period: 'monthly' | 'quarterly' | 'yearly';
}

export default function ReportOverview({ transactions, bills, period }: ReportOverviewProps) {
  const calculateMetrics = () => {
    const totalRevenue = transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

    const outstandingBills = bills
      .filter(b => b.status !== 'paid')
      .reduce((sum, b) => sum + b.amount, 0);

    const averageTransactionValue = transactions.length > 0 
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
      : 0;

    const expenseCategories = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc: any, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const topExpenseCategory = Object.entries(expenseCategories)
      .sort(([,a]: any, [,b]: any) => b - a)[0];

    return {
      totalRevenue,
      totalExpenses,
      netIncome,
      profitMargin,
      outstandingBills,
      averageTransactionValue,
      topExpenseCategory: topExpenseCategory ? {
        name: topExpenseCategory[0],
        amount: topExpenseCategory[1] as number
      } : null,
      transactionCount: transactions.length
    };
  };

  const metrics = calculateMetrics();

  const formatCurrency = (amount: number) => {
    return `₱${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'monthly': return 'This Month';
      case 'quarterly': return 'This Quarter';
      case 'yearly': return 'This Year';
      default: return 'Period';
    }
  };

  return (
    <div className=\"space-y-6\">
      {/* Key Performance Indicators */}
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
        <div className=\"bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1\">
          <div className=\"flex items-center justify-between\">
            <div className=\"flex-1\">
              <p className=\"text-sm font-medium text-gray-600 mb-1\">Total Revenue</p>
              <p className=\"text-2xl font-bold text-gray-900 mb-2\">{formatCurrency(metrics.totalRevenue)}</p>
              <div className=\"flex items-center space-x-1\">
                <i className=\"ri-arrow-up-line text-green-500 text-sm\"></i>
                <span className=\"text-sm font-medium text-green-600\">{getPeriodLabel()}</span>
              </div>
            </div>
            <div className=\"w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500\">
              <i className=\"ri-money-dollar-circle-line text-white text-xl\"></i>
            </div>
          </div>
        </div>

        <div className=\"bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1\">
          <div className=\"flex items-center justify-between\">
            <div className=\"flex-1\">
              <p className=\"text-sm font-medium text-gray-600 mb-1\">Total Expenses</p>
              <p className=\"text-2xl font-bold text-gray-900 mb-2\">{formatCurrency(metrics.totalExpenses)}</p>
              <div className=\"flex items-center space-x-1\">
                <i className=\"ri-arrow-down-line text-red-500 text-sm\"></i>
                <span className=\"text-sm font-medium text-red-600\">{getPeriodLabel()}</span>
              </div>
            </div>
            <div className=\"w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500\">
              <i className=\"ri-shopping-cart-line text-white text-xl\"></i>
            </div>
          </div>
        </div>

        <div className=\"bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1\">
          <div className=\"flex items-center justify-between\">
            <div className=\"flex-1\">
              <p className=\"text-sm font-medium text-gray-600 mb-1\">Net Income</p>
              <p className={`text-2xl font-bold mb-2 ${metrics.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.netIncome >= 0 ? '+' : '-'}{formatCurrency(metrics.netIncome)}
              </p>
              <div className=\"flex items-center space-x-1\">
                <i className={`ri-trending-${metrics.netIncome >= 0 ? 'up' : 'down'}-line text-${metrics.netIncome >= 0 ? 'blue' : 'red'}-500 text-sm`}></i>
                <span className={`text-sm font-medium text-${metrics.netIncome >= 0 ? 'blue' : 'red'}-600`}>
                  {formatPercentage(metrics.profitMargin)} Margin
                </span>
              </div>
            </div>
            <div className=\"w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500\">
              <i className=\"ri-line-chart-line text-white text-xl\"></i>
            </div>
          </div>
        </div>

        <div className=\"bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1\">
          <div className=\"flex items-center justify-between\">
            <div className=\"flex-1\">
              <p className=\"text-sm font-medium text-gray-600 mb-1\">Outstanding Bills</p>
              <p className=\"text-2xl font-bold text-gray-900 mb-2\">{formatCurrency(metrics.outstandingBills)}</p>
              <div className=\"flex items-center space-x-1\">
                <i className=\"ri-alert-line text-orange-500 text-sm\"></i>
                <span className=\"text-sm font-medium text-orange-600\">Pending Payment</span>
              </div>
            </div>
            <div className=\"w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500\">
              <i className=\"ri-file-list-line text-white text-xl\"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">
        <div className=\"bg-white rounded-2xl p-6 shadow-lg border border-gray-100\">
          <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Transaction Analytics</h3>
          <div className=\"space-y-4\">
            <div className=\"flex items-center justify-between p-3 bg-purple-50 rounded-xl\">
              <div className=\"flex items-center space-x-3\">
                <div className=\"w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center\">
                  <i className=\"ri-database-line text-white\"></i>
                </div>
                <div>
                  <p className=\"text-sm text-gray-600\">Total Transactions</p>
                  <p className=\"font-semibold text-gray-900\">{metrics.transactionCount}</p>
                </div>
              </div>
              <div className=\"text-right\">
                <p className=\"text-sm text-gray-600\">Avg. Value</p>
                <p className=\"font-semibold text-purple-600\">{formatCurrency(metrics.averageTransactionValue)}</p>
              </div>
            </div>

            {metrics.topExpenseCategory && (
              <div className=\"flex items-center justify-between p-3 bg-red-50 rounded-xl\">
                <div className=\"flex items-center space-x-3\">
                  <div className=\"w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center\">
                    <i className=\"ri-pie-chart-line text-white\"></i>
                  </div>
                  <div>
                    <p className=\"text-sm text-gray-600\">Top Expense Category</p>
                    <p className=\"font-semibold text-gray-900\">{metrics.topExpenseCategory.name}</p>
                  </div>
                </div>
                <div className=\"text-right\">
                  <p className=\"font-semibold text-red-600\">{formatCurrency(metrics.topExpenseCategory.amount)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className=\"bg-white rounded-2xl p-6 shadow-lg border border-gray-100\">
          <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Financial Health Score</h3>
          <div className=\"text-center\">
            <div className=\"relative w-32 h-32 mx-auto mb-4\">
              <svg className=\"w-32 h-32 transform -rotate-90\" viewBox=\"0 0 36 36\">
                <path
                  d=\"M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831\"
                  fill=\"none\"
                  stroke=\"#E5E7EB\"
                  strokeWidth=\"3\"
                />
                <path
                  d=\"M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831\"
                  fill=\"none\"
                  stroke={metrics.profitMargin >= 20 ? '#10B981' : metrics.profitMargin >= 10 ? '#F59E0B' : '#EF4444'}
                  strokeWidth=\"3\"
                  strokeDasharray={`${Math.min(Math.max(metrics.profitMargin, 0), 100)}, 100`}
                />
              </svg>
              <div className=\"absolute inset-0 flex items-center justify-center\">
                <div className=\"text-center\">
                  <p className=\"text-2xl font-bold text-gray-900\">{Math.round(Math.max(metrics.profitMargin, 0))}</p>
                  <p className=\"text-xs text-gray-600\">Health Score</p>
                </div>
              </div>
            </div>
            <div className=\"space-y-2\">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                metrics.profitMargin >= 20 ? 'bg-green-100 text-green-800' :
                metrics.profitMargin >= 10 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {metrics.profitMargin >= 20 ? 'Excellent' :
                 metrics.profitMargin >= 10 ? 'Good' : 'Needs Improvement'}
              </div>
              <p className=\"text-xs text-gray-600\">Based on profit margin and cash flow</p>
            </div>
          </div>
        </div>

        <div className=\"bg-white rounded-2xl p-6 shadow-lg border border-gray-100\">
          <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Quick Actions</h3>
          <div className=\"space-y-3\">
            <button className=\"w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer\">
              <div className=\"w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center\">
                <i className=\"ri-file-chart-line text-white\"></i>
              </div>
              <div className=\"text-left\">
                <div className=\"font-medium text-gray-900\">Generate Report</div>
                <div className=\"text-sm text-gray-600\">Create detailed financial report</div>
              </div>
            </button>

            <button className=\"w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors cursor-pointer\">
              <div className=\"w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center\">
                <i className=\"ri-mail-line text-white\"></i>
              </div>
              <div className=\"text-left\">
                <div className=\"font-medium text-gray-900\">Email Report</div>
                <div className=\"text-sm text-gray-600\">Send to stakeholders</div>
              </div>
            </button>

            <button className=\"w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors cursor-pointer\">
              <div className=\"w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center\">
                <i className=\"ri-calendar-check-line text-white\"></i>
              </div>
              <div className=\"text-left\">
                <div className=\"font-medium text-gray-900\">Schedule Reports</div>
                <div className=\"text-sm text-gray-600\">Automate delivery</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}