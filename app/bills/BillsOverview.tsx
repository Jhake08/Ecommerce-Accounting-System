'use client';

import { DueBill } from '../../lib/googleSheets';

interface BillsOverviewProps {
  bills: DueBill[];
}

export default function BillsOverview({ bills }: BillsOverviewProps) {
  const calculateStats = () => {
    const totalAmount = bills
      .filter(bill => bill.status !== 'paid')
      .reduce((sum, bill) => sum + bill.amount, 0);
    
    const overdueBills = bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      const today = new Date();
      return bill.status === 'overdue' || (bill.status === 'pending' && dueDate < today);
    });
    
    const dueSoon = bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      return bill.status === 'pending' && dueDate >= today && dueDate <= nextWeek;
    });

    const paidThisMonth = bills.filter(bill => {
      const today = new Date();
      const billDate = new Date(bill.updatedAt);
      return bill.status === 'paid' && 
             billDate.getMonth() === today.getMonth() && 
             billDate.getFullYear() === today.getFullYear();
    });

    return {
      totalAmount,
      overdueBills: overdueBills.length,
      dueSoon: dueSoon.length,
      paidThisMonth: paidThisMonth.length
    };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Outstanding</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">₱{stats.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <div className="flex items-center space-x-1">
              <i className="ri-money-dollar-circle-line text-blue-500 text-sm"></i>
              <span className="text-sm font-medium text-blue-600">Unpaid Bills</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500">
            <i className="ri-money-dollar-circle-line text-white text-xl"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Overdue Bills</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{stats.overdueBills}</p>
            <div className="flex items-center space-x-1">
              <i className="ri-error-warning-line text-red-500 text-sm"></i>
              <span className="text-sm font-medium text-red-600">Needs Attention</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500">
            <i className="ri-error-warning-line text-white text-xl"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Due This Week</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{stats.dueSoon}</p>
            <div className="flex items-center space-x-1">
              <i className="ri-alarm-line text-yellow-500 text-sm"></i>
              <span className="text-sm font-medium text-yellow-600">Coming Up</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-500">
            <i className="ri-alarm-line text-white text-xl"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Paid This Month</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{stats.paidThisMonth}</p>
            <div className="flex items-center space-x-1">
              <i className="ri-check-line text-green-500 text-sm"></i>
              <span className="text-sm font-medium text-green-600">Completed</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500">
            <i className="ri-check-line text-white text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
}