'use client';

import { useState } from 'react';
import { DueBill } from '../../lib/googleSheets';

interface BillsListProps {
  bills: DueBill[];
  onEdit: (bill: DueBill) => void;
  onDelete: (id: string) => void;
  onMarkAsPaid: (id: string) => void;
}

export default function BillsList({ bills, onEdit, onDelete, onMarkAsPaid }: BillsListProps) {
  const [sortBy, setSortBy] = useState<'dueDate' | 'amount' | 'title'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'overdue' | 'paid'>('all');

  const sortedAndFilteredBills = bills
    .filter(bill => filterStatus === 'all' || bill.status === filterStatus)
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'amount') {
        aValue = parseFloat(aValue.toString());
        bValue = parseFloat(bValue.toString());
      }
      
      if (sortBy === 'dueDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field: 'dueDate' | 'amount' | 'title') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return `₱${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getStatusColor = (status: string, dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    
    if (status === 'paid') {
      return 'bg-green-100 text-green-800';
    } else if (status === 'overdue' || (status === 'pending' && due < today)) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string, dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    
    if (status === 'paid') {
      return 'ri-check-line';
    } else if (status === 'overdue' || (status === 'pending' && due < today)) {
      return 'ri-error-warning-line';
    } else {
      return 'ri-time-line';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `${diffDays} days left`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bills & Payment Reminders</h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
              {['all', 'pending', 'overdue', 'paid'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as 'all' | 'pending' | 'overdue' | 'paid')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Bill</span>
                    <i className={`ri-arrow-${sortBy === 'title' ? (sortOrder === 'asc' ? 'up' : 'down') : 'up-down'}-line text-sm`}></i>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    <i className={`ri-arrow-${sortBy === 'amount' ? (sortOrder === 'asc' ? 'up' : 'down') : 'up-down'}-line text-sm`}></i>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('dueDate')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Due Date</span>
                    <i className={`ri-arrow-${sortBy === 'dueDate' ? (sortOrder === 'asc' ? 'up' : 'down') : 'up-down'}-line text-sm`}></i>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAndFilteredBills.map((bill, index) => (
                <tr 
                  key={bill.id} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{bill.title}</div>
                      <div className="text-sm text-gray-500">{bill.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                          {bill.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatAmount(bill.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{formatDate(bill.dueDate)}</div>
                      <div className={`text-xs font-medium ${
                        bill.status === 'paid' ? 'text-green-600' :
                        new Date(bill.dueDate) < new Date() ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {bill.status !== 'paid' && getDaysUntilDue(bill.dueDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bill.status, bill.dueDate)}`}>
                      <i className={`${getStatusIcon(bill.status, bill.dueDate)} mr-1`}></i>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {bill.status !== 'paid' && (
                        <button
                          onClick={() => onMarkAsPaid(bill.id)}
                          className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                          title="Mark as Paid"
                        >
                          <i className="ri-check-line text-sm"></i>
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(bill)}
                        className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <i className="ri-edit-line text-sm"></i>
                      </button>
                      <button
                        onClick={() => onDelete(bill.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedAndFilteredBills.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-file-list-line text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
            <p className="text-gray-500">
              {filterStatus === 'all' 
                ? 'Start by adding your first bill reminder' 
                : `No ${filterStatus} bills found`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}