'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import ReportOverview from './ReportOverview';
import FinancialReports from './FinancialReports';
import ChartAnalytics from './ChartAnalytics';
import ReportFilters from './ReportFilters';
import { Transaction, DueBill, googleSheetsService } from '../../lib/googleSheets';

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<DueBill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [reportType, setReportType] = useState<'profit-loss' | 'cash-flow' | 'expense-analysis' | 'tax-summary'>('profit-loss');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [transactionData, billData] = await Promise.all([
        googleSheetsService.getTransactions(),
        googleSheetsService.getDueBills()
      ]);
      setTransactions(transactionData);
      setBills(billData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = (format: 'pdf' | 'excel') => {
    const reportData = {
      period: reportPeriod,
      year: selectedYear,
      month: selectedMonth,
      type: reportType,
      transactions: getFilteredTransactions(),
      generatedAt: new Date().toISOString()
    };

    if (format === 'pdf') {
      console.log('Generating PDF report...', reportData);
    } else {
      console.log('Generating Excel report...', reportData);
    }
  };

  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth();

      if (reportPeriod === 'yearly') {
        return transactionYear === selectedYear;
      } else if (reportPeriod === 'monthly') {
        return transactionYear === selectedYear && transactionMonth === selectedMonth;
      } else {
        const quarter = Math.floor(selectedMonth / 3);
        const transactionQuarter = Math.floor(transactionMonth / 3);
        return transactionYear === selectedYear && transactionQuarter === quarter;
      }
    });
  };

  const scheduleReport = () => {
    console.log('Scheduling automatic report generation...');
  };

  if (isLoading) {
    return (
      <div className=\"min-h-screen bg-gray-50\">
        <Header />
        <div className=\"flex items-center justify-center h-96\">
          <div className=\"text-center\">
            <i className=\"ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4\"></i>
            <p className=\"text-gray-600\">Loading reports data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=\"min-h-screen bg-gray-50\">
      <Header />
      
      <main className=\"p-6 space-y-6\">
        {/* Header Section */}
        <div className=\"bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden\">
          <div className=\"absolute inset-0 bg-black opacity-10\"></div>
          <div className=\"relative z-10\">
            <div className=\"flex items-center justify-between\">
              <div>
                <h1 className=\"text-3xl font-bold mb-2\">Financial Reports & Analytics</h1>
                <p className=\"text-indigo-100 text-lg\">Comprehensive business intelligence and reporting</p>
                <div className=\"flex items-center space-x-6 mt-4\">
                  <div className=\"flex items-center space-x-2\">
                    <i className=\"ri-bar-chart-line text-xl\"></i>
                    <span>Real-time Analytics</span>
                  </div>
                  <div className=\"flex items-center space-x-2\">
                    <i className=\"ri-file-chart-line text-xl\"></i>
                    <span>Custom Reports</span>
                  </div>
                  <div className=\"flex items-center space-x-2\">
                    <i className=\"ri-calendar-check-line text-xl\"></i>
                    <span>Scheduled Reports</span>
                  </div>
                </div>
              </div>
              <div className=\"flex items-center space-x-3\">
                <button
                  onClick={() => generateReport('excel')}
                  className=\"bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors cursor-pointer whitespace-nowrap\"
                >
                  <i className=\"ri-file-excel-line mr-2\"></i>
                  Export Excel
                </button>
                <button
                  onClick={() => generateReport('pdf')}
                  className=\"bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors cursor-pointer whitespace-nowrap\"
                >
                  <i className=\"ri-file-pdf-line mr-2\"></i>
                  Export PDF
                </button>
                <button
                  onClick={scheduleReport}
                  className=\"bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap shadow-lg\"
                >
                  <i className=\"ri-calendar-line mr-2\"></i>
                  Schedule Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Overview */}
        <ReportOverview 
          transactions={getFilteredTransactions()} 
          bills={bills}
          period={reportPeriod}
        />

        {/* Report Filters */}
        <ReportFilters
          reportPeriod={reportPeriod}
          onReportPeriodChange={setReportPeriod}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          reportType={reportType}
          onReportTypeChange={setReportType}
        />

        {/* Charts and Analytics */}
        <ChartAnalytics 
          transactions={getFilteredTransactions()}
          reportType={reportType}
          period={reportPeriod}
        />

        {/* Financial Reports */}
        <FinancialReports
          transactions={getFilteredTransactions()}
          bills={bills}
          reportType={reportType}
          period={reportPeriod}
          year={selectedYear}
          month={selectedMonth}
        />
      </main>
    </div>
  );
}