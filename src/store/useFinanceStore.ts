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
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateCurrency: (currency: string) => void;

  // Transaction Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Budget Actions
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  // Debt Actions
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;

  // Recurring Transaction Actions
  addRecurringTransaction: (transaction: Omit<RecurringTransaction, 'id'>) => void;
  updateRecurringTransaction: (id: string, transaction: Partial<RecurringTransaction>) => void;
  deleteRecurringTransaction: (id: string) => void;
  processRecurringTransactions: () => void;

  // Credit Card Actions
  addCreditCard: (creditCard: Omit<CreditCard, 'id'>) => void;
  updateCreditCard: (id: string, creditCard: Partial<CreditCard>) => void;
  deleteCreditCard: (id: string) => void;

  // Fund Source Actions
  addFundSource: (fundSource: Omit<FundSource, 'id'>) => void;
  updateFundSource: (id: string, fundSource: Partial<FundSource>) => void;
  deleteFundSource: (id: string) => void;

  // Investment Actions
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;

  // Loan Actions
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  updateLoan: (id: string, loan: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
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
      addTransaction: (transaction) => {
        const newTransaction = { ...transaction, id: crypto.randomUUID() };
        set((state) => ({ transactions: [...state.transactions, newTransaction] }));
      },
      updateTransaction: (id, transaction) => set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...transaction } : t
        ),
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      })),

      // Budget Actions
      addBudget: (budget) => set((state) => ({
        budgets: [...state.budgets, { ...budget, id: crypto.randomUUID() }],
      })),
      updateBudget: (id, budget) => set((state) => ({
        budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...budget } : b)),
      })),
      deleteBudget: (id) => set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
      })),

      // Debt Actions
      addDebt: (debt) => set((state) => ({
        debts: [...state.debts, { ...debt, id: crypto.randomUUID() }],
      })),
      updateDebt: (id, debt) => set((state) => ({
        debts: state.debts.map((d) => (d.id === id ? { ...d, ...debt } : d)),
      })),
      deleteDebt: (id) => set((state) => ({
        debts: state.debts.filter((d) => d.id !== id),
      })),

      // Recurring Transaction Actions
      addRecurringTransaction: (transaction) => set((state) => ({
        recurringTransactions: [
          ...state.recurringTransactions,
          { ...transaction, id: crypto.randomUUID() },
        ],
      })),
      updateRecurringTransaction: (id, transaction) => set((state) => ({
        recurringTransactions: state.recurringTransactions.map((t) =>
          t.id === id ? { ...t, ...transaction } : t
        ),
      })),
      deleteRecurringTransaction: (id) => set((state) => ({
        recurringTransactions: state.recurringTransactions.filter((t) => t.id !== id),
      })),
      processRecurringTransactions: () => {
        const state = get();
        const today = new Date();
        
        state.recurringTransactions.forEach((recurring) => {
          const lastOccurrence = new Date(recurring.lastProcessed || recurring.startDate);
          const nextDue = new Date(lastOccurrence);
          
          switch (recurring.frequency) {
            case 'daily':
              nextDue.setDate(nextDue.getDate() + 1);
              break;
            case 'weekly':
              nextDue.setDate(nextDue.getDate() + 7);
              break;
            case 'monthly':
              nextDue.setMonth(nextDue.getMonth() + 1);
              break;
            case 'yearly':
              nextDue.setFullYear(nextDue.getFullYear() + 1);
              break;
          }

          if (nextDue <= today) {
            state.addTransaction({
              date: new Date(),
              amount: recurring.amount,
              type: recurring.type,
              category: recurring.category,
              details: `${recurring.details} (Recurring)`,
              from: recurring.from,
            });

            set((state) => ({
              recurringTransactions: state.recurringTransactions.map((t) =>
                t.id === recurring.id
                  ? { ...t, lastProcessed: today.toISOString() }
                  : t
              ),
            }));
          }
        });
      },

      // Credit Card Actions
      addCreditCard: (creditCard) => set((state) => ({
        creditCards: [...state.creditCards, { ...creditCard, id: crypto.randomUUID() }],
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
      addFundSource: (fundSource) => set((state) => ({
        fundSources: [...state.fundSources, { ...fundSource, id: crypto.randomUUID() }],
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
      addInvestment: (investment) => set((state) => ({
        investments: [...state.investments, { ...investment, id: crypto.randomUUID() }],
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
      addLoan: (loan) => set((state) => ({
        loans: [...state.loans, { ...loan, id: crypto.randomUUID() }],
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

// Process recurring transactions periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    useFinanceStore.getState().processRecurringTransactions();
  }, 1000 * 60 * 60); // Every hour
}