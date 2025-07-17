'use client';

import { useState, useEffect } from 'react';
import { DueBill } from '../../lib/googleSheets';

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bill: Omit<DueBill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  bill?: DueBill | null;
  mode: 'add' | 'edit';
}

const billCategories = [
  { name: 'Utilities', color: '#10B981', icon: 'ri-flashlight-line' },
  { name: 'Rent', color: '#3B82F6', icon: 'ri-home-line' },
  { name: 'Insurance', color: '#8B5CF6', icon: 'ri-shield-check-line' },
  { name: 'Software', color: '#F59E0B', icon: 'ri-computer-line' },
  { name: 'Internet', color: '#EF4444', icon: 'ri-wifi-line' },
  { name: 'Phone', color: '#EC4899', icon: 'ri-phone-line' },
  { name: 'Maintenance', color: '#14B8A6', icon: 'ri-tools-line' },
  { name: 'Subscription', color: '#6B7280', icon: 'ri-refresh-line' },
];

export default function BillModal({ isOpen, onClose, onSave, bill, mode }: BillModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    dueDate: '',
    category: '',
    status: 'pending' as 'pending' | 'paid' | 'overdue'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (bill && mode === 'edit') {
      setFormData({
        title: bill.title,
        description: bill.description,
        amount: bill.amount.toString(),
        dueDate: bill.dueDate,
        category: bill.category,
        status: bill.status
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        title: '',
        description: '',
        amount: '',
        dueDate: tomorrow.toISOString().split('T')[0],
        category: '',
        status: 'pending'
      });
    }
    setErrors({});
  }, [bill, mode, isOpen]);

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await onSave({
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        category: formData.category,
        status: formData.status
      });
      onClose();
    } catch (error) {
      console.error('Error saving bill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'add' ? 'Add New Bill' : 'Edit Bill'}
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-gray-600 text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter bill title"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter bill description"
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {billCategories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: category.name })}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                      formData.category === category.name
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: category.color }}>
                        <i className={`${category.icon} text-white text-sm`}></i>
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                    errors.dueDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'pending' })}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    formData.status === 'pending'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-time-line text-lg mb-1"></i>
                  <div className="font-medium">Pending</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'paid' })}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    formData.status === 'paid'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-check-line text-lg mb-1"></i>
                  <div className="font-medium">Paid</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'overdue' })}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    formData.status === 'overdue'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-error-warning-line text-lg mb-1"></i>
                  <div className="font-medium">Overdue</div>
                </button>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <i className="ri-loader-4-line animate-spin"></i>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>{mode === 'add' ? 'Add Bill' : 'Update Bill'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}