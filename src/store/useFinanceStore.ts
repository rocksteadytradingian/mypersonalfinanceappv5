import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget, Debt, RecurringTransaction, CreditCard, FundSource, Investment, UserProfile, Loan } from '../types/finance';

interface FinanceStore {
  transactions: Transaction[];
  budgets: Budget[];
  debts: Debt[];
  recurringTransactions: RecurringTransaction[];
  creditCards: CreditCard[];
  fundSources: FundSource[];
  investments: Investment[];
  loans: Loan[];
  userProfile: UserProfile | null;

  // User Profile Actions
  setUserProfile: (profile: UserProfile | null) => void;
  updateUserProfile: (profile: Partial<Omit<UserProfile, 'id'>>) => void;
  updateCurrency: (currency: string) => void;

  // Transaction Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;

  // Budget Actions
  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, budget: Partial<Omit<Budget, 'id'>>) => void;
  deleteBudget: (id: string) => void;

  // Debt Actions
  setDebts: (debts: Debt[]) => void;
  addDebt: (debt: Debt) => void;
  updateDebt: (id: string, debt: Partial<Omit<Debt, 'id'>>) => void;
  deleteDebt: (id: string) => void;

  // Recurring Transaction Actions
  setRecurringTransactions: (transactions: RecurringTransaction[]) => void;
  addRecurringTransaction: (transaction: RecurringTransaction) => void;
  updateRecurringTransaction: (id: string, transaction: Partial<Omit<RecurringTransaction, 'id'>>) => void;
  deleteRecurringTransaction: (id: string) => void;

  // Credit Card Actions
  setCreditCards: (creditCards: CreditCard[]) => void;
  addCreditCard: (creditCard: CreditCard) => void;
  updateCreditCard: (id: string, creditCard: Partial<Omit<CreditCard, 'id'>>) => void;
  deleteCreditCard: (id: string) => void;

  // Fund Source Actions
  setFundSources: (fundSources: FundSource[]) => void;
  addFundSource: (fundSource: FundSource) => void;
  updateFundSource: (id: string, fundSource: Partial<Omit<FundSource, 'id'>>) => void;
  deleteFundSource: (id: string) => void;

  // Investment Actions
  setInvestments: (investments: Investment[]) => void;
  addInvestment: (investment: Investment) => void;
  updateInvestment: (id: string, investment: Partial<Omit<Investment, 'id'>>) => void;
  deleteInvestment: (id: string) => void;

  // Loan Actions
  setLoans: (loans: Loan[]) => void;
  addLoan: (loan: Loan) => void;
  updateLoan: (id: string, loan: Partial<Omit<Loan, 'id'>>) => void;
  deleteLoan: (id: string) => void;
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      transactions: [],
      budgets: [],
      debts: [],
      recurringTransactions: [],
      creditCards: [],
      fundSources: [],
      investments: [],
      loans: [],
      userProfile: null,

      // User Profile Actions
      setUserProfile: (profile) => set({ userProfile: profile }),
      updateUserProfile: (profile) => set((state) => ({
        userProfile: state.userProfile ? { ...state.userProfile, ...profile } : null
      })),
      updateCurrency: (currency) => set((state) => ({
        userProfile: state.userProfile ? { ...state.userProfile, currency } : null
      })),

      // Transaction Actions
      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (transaction) => set((state) => ({
        transactions: [...state.transactions, transaction]
      })),
      updateTransaction: (id, transaction) => set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...transaction } : t
        ),
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      })),

      // Budget Actions
      setBudgets: (budgets) => set({ budgets }),
      addBudget: (budget) => set((state) => ({
        budgets: [...state.budgets, budget],
      })),
      updateBudget: (id, budget) => set((state) => ({
        budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...budget } : b)),
      })),
      deleteBudget: (id) => set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
      })),

      // Debt Actions
      setDebts: (debts) => set({ debts }),
      addDebt: (debt) => set((state) => ({
        debts: [...state.debts, debt],
      })),
      updateDebt: (id, debt) => set((state) => ({
        debts: state.debts.map((d) => (d.id === id ? { ...d, ...debt } : d)),
      })),
      deleteDebt: (id) => set((state) => ({
        debts: state.debts.filter((d) => d.id !== id),
      })),

      // Recurring Transaction Actions
      setRecurringTransactions: (transactions) => set({ recurringTransactions: transactions }),
      addRecurringTransaction: (transaction) => set((state) => ({
        recurringTransactions: [...state.recurringTransactions, transaction],
      })),
      updateRecurringTransaction: (id, transaction) => set((state) => ({
        recurringTransactions: state.recurringTransactions.map((t) =>
          t.id === id ? { ...t, ...transaction } : t
        ),
      })),
      deleteRecurringTransaction: (id) => set((state) => ({
        recurringTransactions: state.recurringTransactions.filter((t) => t.id !== id),
      })),

      // Credit Card Actions
      setCreditCards: (creditCards) => set({ creditCards }),
      addCreditCard: (creditCard) => set((state) => ({
        creditCards: [...state.creditCards, creditCard],
      })),
      updateCreditCard: (id, creditCard) => set((state) => ({
        creditCards: state.creditCards.map((c) =>
          c.id === id ? { ...c, ...creditCard } : c
        ),
      })),
      deleteCreditCard: (id) => set((state) => ({
        creditCards: state.creditCards.filter((c) => c.id !== id),
      })),

      // Fund Source Actions
      setFundSources: (fundSources) => set({ fundSources }),
      addFundSource: (fundSource) => set((state) => ({
        fundSources: [...state.fundSources, fundSource],
      })),
      updateFundSource: (id, fundSource) => set((state) => ({
        fundSources: state.fundSources.map((f) =>
          f.id === id ? { ...f, ...fundSource } : f
        ),
      })),
      deleteFundSource: (id) => set((state) => ({
        fundSources: state.fundSources.filter((f) => f.id !== id),
      })),

      // Investment Actions
      setInvestments: (investments) => set({ investments }),
      addInvestment: (investment) => set((state) => ({
        investments: [...state.investments, investment],
      })),
      updateInvestment: (id, investment) => set((state) => ({
        investments: state.investments.map((i) =>
          i.id === id ? { ...i, ...investment } : i
        ),
      })),
      deleteInvestment: (id) => set((state) => ({
        investments: state.investments.filter((i) => i.id !== id),
      })),

      // Loan Actions
      setLoans: (loans) => set({ loans }),
      addLoan: (loan) => set((state) => ({
        loans: [...state.loans, loan],
      })),
      updateLoan: (id, loan) => set((state) => ({
        loans: state.loans.map((l) =>
          l.id === id ? { ...l, ...loan } : l
        ),
      })),
      deleteLoan: (id) => set((state) => ({
        loans: state.loans.filter((l) => l.id !== id),
      })),
    }),
    {
      name: 'finance-store',
    }
  )
);