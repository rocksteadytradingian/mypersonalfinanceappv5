import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatCurrency } from '../utils/formatters';
import { TransactionType, RecurringFrequency } from '../types/finance';

export function RecurringTransactions() {
  const { recurringTransactions, addRecurringTransaction, deleteRecurringTransaction } = useFinanceStore();
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as TransactionType,
    category: '',
    details: '',
    frequency: 'monthly' as RecurringFrequency,
    startDate: '',
    from: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRecurringTransaction({
      ...formData,
      amount: Number(formData.amount),
    });
    setFormData({
      amount: '',
      type: 'expense',
      category: '',
      details: '',
      frequency: 'monthly',
      startDate: '',
      from: '',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Recurring Transactions</h2>
        <div className="space-y-4">
          {recurringTransactions.map((transaction) => (
            <div key={transaction.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{transaction.details}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteRecurringTransaction(transaction.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <p>Category: {transaction.category}</p>
                <p>Frequency: {transaction.frequency}</p>
                <p>Start Date: {new Date(transaction.startDate).toLocaleDateString()}</p>
                <p>Last Processed: {transaction.lastProcessed 
                  ? new Date(transaction.lastProcessed).toLocaleDateString()
                  : 'Never'}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Add Recurring Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Details</label>
            <input
              type="text"
              required
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <input
              type="text"
              required
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as RecurringFrequency })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Add Recurring Transaction
          </Button>
        </form>
      </Card>
    </div>
  );
}