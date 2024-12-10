import React, { useState, useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatCurrency } from '../utils/formatters';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { TransactionList } from './TransactionList';
import { Transaction, FundSource, CreditCard, Debt, Budget, RecurringTransaction } from '../types/finance';

type ReportType = 'fund-sources' | 'credit-cards' | 'debts' | 'budget' | 'recurring' | 'records' | 'transactions';

interface FundSourceReport extends FundSource {
  transactions: Transaction[];
  income: number;
  expenses: number;
  netFlow: number;
}

interface CreditCardReport extends CreditCard {
  transactions: Transaction[];
  charges: number;
}

interface DebtReport extends Debt {
  transactions: Transaction[];
  payments: number;
}

interface BudgetReport extends Budget {
  transactions: Transaction[];
  spent: number;
  remaining: number;
}

interface RecurringReport extends RecurringTransaction {
  transactions: Transaction[];
  occurrences: number;
  total: number;
}

interface TransactionReport {
  data: Transaction[];
  summary: {
    income: number;
    expenses: number;
    debt: number;
  };
}

type ReportData = 
  | { type: 'fund-sources'; data: FundSourceReport[] }
  | { type: 'credit-cards'; data: CreditCardReport[] }
  | { type: 'debts'; data: DebtReport[] }
  | { type: 'budget'; data: BudgetReport[] }
  | { type: 'recurring'; data: RecurringReport[] }
  | { type: 'transactions'; data: Transaction[]; summary: TransactionReport['summary'] };

export function Reports() {
  const { 
    transactions, 
    fundSources, 
    creditCards, 
    debts, 
    budgets, 
    recurringTransactions,
    userProfile 
  } = useFinanceStore();

  const [reportType, setReportType] = useState<ReportType>('transactions');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const filteredData = useMemo<ReportData | null>(() => {
    if (!dateRange.startDate || !dateRange.endDate) return null;

    const start = startOfDay(new Date(dateRange.startDate));
    const end = endOfDay(new Date(dateRange.endDate));

    const isInRange = (date: Date) => 
      isWithinInterval(new Date(date), { start, end });

    const filteredTransactions = transactions.filter(t => 
      isInRange(new Date(t.date))
    );

    switch (reportType) {
      case 'fund-sources': {
        const fundSourceStats = fundSources.map(source => {
          const sourceTransactions = filteredTransactions.filter(t => 
            t.fundSourceId === source.id
          );
          const income = sourceTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          const expenses = sourceTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
          
          return {
            ...source,
            transactions: sourceTransactions,
            income,
            expenses,
            netFlow: income - expenses,
          };
        });
        return { type: 'fund-sources', data: fundSourceStats };
      }

      case 'credit-cards': {
        const creditCardStats = creditCards.map(card => {
          const cardTransactions = filteredTransactions.filter(t => 
            t.creditCardId === card.id
          );
          const charges = cardTransactions.reduce((sum, t) => sum + t.amount, 0);
          
          return {
            ...card,
            transactions: cardTransactions,
            charges,
          };
        });
        return { type: 'credit-cards', data: creditCardStats };
      }

      case 'debts': {
        const debtStats = debts.map(debt => {
          const debtTransactions = filteredTransactions.filter(t => 
            t.type === 'debt' && t.details.includes(debt.name)
          );
          const payments = debtTransactions.reduce((sum, t) => sum + t.amount, 0);
          
          return {
            ...debt,
            transactions: debtTransactions,
            payments,
          };
        });
        return { type: 'debts', data: debtStats };
      }

      case 'budget': {
        const budgetStats = budgets.map(budget => {
          const categoryTransactions = filteredTransactions.filter(t => 
            t.category === budget.category
          );
          const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
          
          return {
            ...budget,
            transactions: categoryTransactions,
            spent,
            remaining: budget.amount - spent,
          };
        });
        return { type: 'budget', data: budgetStats };
      }

      case 'recurring': {
        const recurringStats = recurringTransactions.map(recurring => {
          const matchingTransactions = filteredTransactions.filter(t => 
            t.details.includes('(Recurring)') && 
            t.category === recurring.category &&
            t.amount === recurring.amount
          );
          
          return {
            ...recurring,
            transactions: matchingTransactions,
            occurrences: matchingTransactions.length,
            total: matchingTransactions.reduce((sum, t) => sum + t.amount, 0),
          };
        });
        return { type: 'recurring', data: recurringStats };
      }

      case 'transactions':
      case 'records':
        return { 
          type: 'transactions', 
          data: filteredTransactions,
          summary: {
            income: filteredTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0),
            expenses: filteredTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0),
            debt: filteredTransactions
              .filter(t => t.type === 'debt')
              .reduce((sum, t) => sum + t.amount, 0),
          }
        };
    }
  }, [reportType, dateRange, transactions, fundSources, creditCards, debts, budgets, recurringTransactions]);

  const renderReport = () => {
    if (!filteredData) return null;

    switch (filteredData.type) {
      case 'fund-sources':
        return (
          <div className="space-y-4">
            {filteredData.data.map(source => (
              <Card key={source.id}>
                <h3 className="text-lg font-semibold mb-4">{source.bankName} - {source.accountName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Income</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(source.income)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expenses</p>
                    <p className="text-lg font-semibold text-red-600">
                      {formatCurrency(source.expenses)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Net Flow</p>
                    <p className={`text-lg font-semibold ${source.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(source.netFlow)}
                    </p>
                  </div>
                </div>
                <TransactionList 
                  transactions={source.transactions}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  readOnly={true}
                />
              </Card>
            ))}
          </div>
        );

      case 'credit-cards':
        return (
          <div className="space-y-4">
            {filteredData.data.map(card => (
              <Card key={card.id}>
                <h3 className="text-lg font-semibold mb-4">{card.bank} - {card.name}</h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Total Charges</p>
                  <p className="text-lg font-semibold text-red-600">
                    {formatCurrency(card.charges)}
                  </p>
                </div>
                <TransactionList 
                  transactions={card.transactions}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  readOnly={true}
                />
              </Card>
            ))}
          </div>
        );

      case 'debts':
        return (
          <div className="space-y-4">
            {filteredData.data.map(debt => (
              <Card key={debt.id}>
                <h3 className="text-lg font-semibold mb-4">{debt.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Debt</p>
                    <p className="text-lg font-semibold text-red-600">
                      {formatCurrency(debt.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payments Made</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(debt.payments)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatCurrency(debt.amount - debt.payments)}
                    </p>
                  </div>
                </div>
                <TransactionList 
                  transactions={debt.transactions}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  readOnly={true}
                />
              </Card>
            ))}
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-4">
            {filteredData.data.map(budget => (
              <Card key={budget.id}>
                <h3 className="text-lg font-semibold mb-4">{budget.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatCurrency(budget.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Spent</p>
                    <p className="text-lg font-semibold text-red-600">
                      {formatCurrency(budget.spent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className={`text-lg font-semibold ${budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(budget.remaining)}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className={`h-2.5 rounded-full ${
                      budget.remaining >= 0 ? 'bg-blue-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%` }}
                  />
                </div>
                <TransactionList 
                  transactions={budget.transactions}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  readOnly={true}
                />
              </Card>
            ))}
          </div>
        );

      case 'recurring':
        return (
          <div className="space-y-4">
            {filteredData.data.map(recurring => (
              <Card key={recurring.id}>
                <h3 className="text-lg font-semibold mb-4">{recurring.details}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Frequency</p>
                    <p className="text-lg font-semibold">{recurring.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Occurrences</p>
                    <p className="text-lg font-semibold">{recurring.occurrences}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(recurring.total)}
                    </p>
                  </div>
                </div>
                <TransactionList 
                  transactions={recurring.transactions}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  readOnly={true}
                />
              </Card>
            ))}
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-4">
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(filteredData.summary.income)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-lg font-semibold text-red-600">
                    {formatCurrency(filteredData.summary.expenses)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Debt Payments</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatCurrency(filteredData.summary.debt)}
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <TransactionList 
                transactions={filteredData.data}
                onEdit={() => {}}
                onDelete={() => {}}
                readOnly={true}
              />
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="fund-sources">Fund Sources</option>
              <option value="credit-cards">Credit Cards</option>
              <option value="debts">Debts</option>
              <option value="budget">Budget</option>
              <option value="recurring">Recurring Transactions</option>
              <option value="transactions">Transactions</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </Card>

      {renderReport()}
    </div>
  );
}