import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types/finance';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CategorySelect } from './CategorySelect';
import { TransactionList } from './TransactionList';
import { LoadingScreen } from './ui/LoadingScreen';

export function TransactionForm() {
  const { loading, error, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    from: '',
    type: 'expense' as Transaction['type'],
    category: '',
    details: '',
    amount: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date(`${formData.date}T${formData.time}`);

    try {
      if (editingId) {
        await updateTransaction(editingId, {
          date: timestamp,
          amount: Number(formData.amount),
          type: formData.type,
          category: formData.category,
          details: formData.details,
          from: formData.from,
        });
        setEditingId(null);
      } else {
        await createTransaction({
          date: timestamp,
          amount: Number(formData.amount),
          type: formData.type,
          category: formData.category,
          details: formData.details,
          from: formData.from,
        });
      }
      resetForm();
    } catch (err) {
      console.error('Transaction error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      from: '',
      type: 'expense',
      category: '',
      details: '',
      amount: '',
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setFormData({
      date: new Date(transaction.date).toISOString().split('T')[0],
      time: new Date(transaction.date).toTimeString().split(' ')[0].slice(0, 5),
      from: transaction.from,
      type: transaction.type,
      category: transaction.category,
      details: transaction.details,
      amount: transaction.amount.toString(),
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error.message}</div>
        </div>
      )}

      <Card>
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Transaction['type'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="debt">Debt</option>
              <option value="investment">Investment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <CategorySelect
              value={formData.category}
              onChange={(category) => setFormData({ ...formData, category })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">From/To</label>
            <input
              type="text"
              required
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={formData.type === 'expense' ? 'Paid to' : 'Received from'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Details</label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingId ? 'Update Transaction' : 'Add Transaction'}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <TransactionList
          transactions={[]}
          onEdit={handleEdit}
          onDelete={deleteTransaction}
        />
      </Card>
    </div>
  );
}