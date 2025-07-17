'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import BillsOverview from './BillsOverview';
import BillsList from './BillsList';
import BillModal from './BillModal';
import { DueBill, googleSheetsService } from '../../lib/googleSheets';

export default function BillsPage() {
  const [bills, setBills] = useState<DueBill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBillModal, setShowBillModal] = useState(false);
  const [editingBill, setEditingBill] = useState<DueBill | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    setIsLoading(true);
    try {
      const data = await googleSheetsService.getDueBills();
      setBills(data);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBill = () => {
    setModalMode('add');
    setEditingBill(null);
    setShowBillModal(true);
  };

  const handleEditBill = (bill: DueBill) => {
    setModalMode('edit');
    setEditingBill(bill);
    setShowBillModal(true);
  };

  const handleSaveBill = async (billData: Omit<DueBill, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newBill = await googleSheetsService.addDueBill(billData);
      setBills(prev => [newBill, ...prev]);
      setShowBillModal(false);
    } catch (error) {
      console.error('Error saving bill:', error);
    }
  };

  const handleDeleteBill = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      setBills(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleMarkAsPaid = (id: string) => {
    setBills(prev => prev.map(bill => 
      bill.id === id ? { ...bill, status: 'paid' as const } : bill
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
            <p className="text-gray-600">Loading your bills...</p>
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
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Due Bills Management</h1>
                <p className="text-red-100 text-lg">Track and manage all your upcoming payments</p>
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <i className="ri-alarm-line text-xl"></i>
                    <span>Payment Reminders</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-calendar-check-line text-xl"></i>
                    <span>Due Date Tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-notification-line text-xl"></i>
                    <span>Smart Alerts</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleAddBill}
                className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap shadow-lg"
              >
                <i className="ri-add-line mr-2"></i>
                Add New Bill
              </button>
            </div>
          </div>
        </div>

        {/* Bills Overview */}
        <BillsOverview bills={bills} />

        {/* Bills List */}
        <BillsList
          bills={bills}
          onEdit={handleEditBill}
          onDelete={handleDeleteBill}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </main>

      {/* Bill Modal */}
      <BillModal
        isOpen={showBillModal}
        onClose={() => setShowBillModal(false)}
        onSave={handleSaveBill}
        bill={editingBill}
        mode={modalMode}
      />
    </div>
  );
}