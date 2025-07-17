export const GOOGLE_SHEETS_CONFIG = {
  SPREADSHEET_ID: 'your-spreadsheet-id-here',
  API_KEY: 'your-google-sheets-api-key-here',
  SHEETS: {
    TRANSACTIONS: 'Transactions',
    DUE_BILLS: 'DueBills',
    CATEGORIES: 'Categories'
  }
};

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface DueBill {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

class GoogleSheetsService {
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEETS.TRANSACTIONS}!A:I?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`
      );
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) return [];
      
      return data.values.slice(1).map((row: any[], index: number) => ({
        id: row[0] || `trans_${index}`,
        date: row[1] || '',
        description: row[2] || '',
        category: row[3] || '',
        amount: parseFloat(row[4]) || 0,
        type: row[5] || 'expense',
        status: row[6] || 'completed',
        createdAt: row[7] || new Date().toISOString(),
        updatedAt: row[8] || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return this.getMockTransactions();
    }
  }

  async getDueBills(): Promise<DueBill[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEETS.DUE_BILLS}!A:I?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`
      );
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) return [];
      
      return data.values.slice(1).map((row: any[], index: number) => ({
        id: row[0] || `bill_${index}`,
        title: row[1] || '',
        description: row[2] || '',
        amount: parseFloat(row[3]) || 0,
        dueDate: row[4] || '',
        status: row[5] || 'pending',
        category: row[6] || '',
        createdAt: row[7] || new Date().toISOString(),
        updatedAt: row[8] || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching due bills:', error);
      return this.getMockDueBills();
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: `trans_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const response = await fetch(
        `${this.baseUrl}/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEETS.TRANSACTIONS}!A:I:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [[
              newTransaction.id,
              newTransaction.date,
              newTransaction.description,
              newTransaction.category,
              newTransaction.amount,
              newTransaction.type,
              newTransaction.status,
              newTransaction.createdAt,
              newTransaction.updatedAt
            ]]
          })
        }
      );
      
      if (response.ok) {
        return newTransaction;
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
    
    return newTransaction;
  }

  async addDueBill(bill: Omit<DueBill, 'id' | 'createdAt' | 'updatedAt'>): Promise<DueBill> {
    const newBill: DueBill = {
      ...bill,
      id: `bill_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const response = await fetch(
        `${this.baseUrl}/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEETS.DUE_BILLS}!A:I:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [[
              newBill.id,
              newBill.title,
              newBill.description,
              newBill.amount,
              newBill.dueDate,
              newBill.status,
              newBill.category,
              newBill.createdAt,
              newBill.updatedAt
            ]]
          })
        }
      );
      
      if (response.ok) {
        return newBill;
      }
    } catch (error) {
      console.error('Error adding due bill:', error);
    }
    
    return newBill;
  }

  private getMockTransactions(): Transaction[] {
    return [
      {
        id: 'trans_1',
        date: '2024-01-15',
        description: 'Office Supplies Purchase',
        category: 'Office Expenses',
        amount: 2500.00,
        type: 'expense',
        status: 'completed',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 'trans_2',
        date: '2024-01-14',
        description: 'Client Payment - Website Development',
        category: 'Service Revenue',
        amount: 25000.00,
        type: 'income',
        status: 'completed',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-14T14:20:00Z'
      },
      {
        id: 'trans_3',
        date: '2024-01-13',
        description: 'Internet & Phone Bills',
        category: 'Utilities',
        amount: 3200.00,
        type: 'expense',
        status: 'completed',
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T09:15:00Z'
      },
      {
        id: 'trans_4',
        date: '2024-01-12',
        description: 'Consulting Services',
        category: 'Service Revenue',
        amount: 15000.00,
        type: 'income',
        status: 'pending',
        createdAt: '2024-01-12T16:45:00Z',
        updatedAt: '2024-01-12T16:45:00Z'
      },
      {
        id: 'trans_5',
        date: '2024-01-11',
        description: 'Marketing Campaign',
        category: 'Marketing',
        amount: 8500.00,
        type: 'expense',
        status: 'completed',
        createdAt: '2024-01-11T11:30:00Z',
        updatedAt: '2024-01-11T11:30:00Z'
      }
    ];
  }

  private getMockDueBills(): DueBill[] {
    return [
      {
        id: 'bill_1',
        title: 'Electricity Bill',
        description: 'Monthly electricity bill for office',
        amount: 4500.00,
        dueDate: '2024-01-25',
        status: 'pending',
        category: 'Utilities',
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-10T08:00:00Z'
      },
      {
        id: 'bill_2',
        title: 'Software License Renewal',
        description: 'Annual software license renewal',
        amount: 12000.00,
        dueDate: '2024-01-30',
        status: 'pending',
        category: 'Software',
        createdAt: '2024-01-05T10:00:00Z',
        updatedAt: '2024-01-05T10:00:00Z'
      },
      {
        id: 'bill_3',
        title: 'Office Rent',
        description: 'Monthly office rent payment',
        amount: 18000.00,
        dueDate: '2024-01-20',
        status: 'overdue',
        category: 'Rent',
        createdAt: '2024-01-01T09:00:00Z',
        updatedAt: '2024-01-01T09:00:00Z'
      },
      {
        id: 'bill_4',
        title: 'Insurance Premium',
        description: 'Quarterly insurance premium',
        amount: 6800.00,
        dueDate: '2024-02-05',
        status: 'pending',
        category: 'Insurance',
        createdAt: '2024-01-08T12:00:00Z',
        updatedAt: '2024-01-08T12:00:00Z'
      }
    ];
  }
}

export const googleSheetsService = new GoogleSheetsService();