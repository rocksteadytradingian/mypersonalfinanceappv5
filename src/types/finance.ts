export type TransactionType = 'expense' | 'income' | 'debt' | 'investment' | 'loan';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type AccountType = string;
export type LoanType = 'personal' | 'mortgage' | 'auto' | 'student' | 'business' | 'other';
export type LoanStatus = 'active' | 'paid' | 'defaulted';
export type InvestmentType = 'stocks' | 'bonds' | 'mutual_funds' | 'etf' | 'crypto' | 'real_estate' | 'other';
export type InvestmentStatus = 'active' | 'sold' | 'pending';
export type Theme = 'light' | 'dark' | 'system';
export type Currency = string;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  country: string;
  currency: Currency;
  theme: Theme;
  monthlyBudgetLimit?: number;
  monthlyIncomeTarget?: number;
  savingsGoal?: number;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  category: string;
  details: string;
  from: string;
  creditCardId?: string;
  fundSourceId?: string;
  loanId?: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly';
  spent: number;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  details: string;
  frequency: RecurringFrequency;
  startDate: string;
  lastProcessed?: string;
  from: string;
}

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  limit: number;
  cutOffDate: number;
  balance: number;
}

export interface FundSource {
  id: string;
  bankName: string;
  accountName: string;
  accountType: AccountType;
  balance: number;
  lastUpdated: Date;
}

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  quantity: number;
  status: InvestmentStatus;
  fundSourceId?: string;
  notes?: string;
  lastUpdated: Date;
}

export interface Loan {
  id: string;
  name: string;
  lender: string;
  type: LoanType;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  startDate: string;
  endDate: string;
  status: LoanStatus;
  nextPaymentDate: string;
  fundSourceId?: string;
}