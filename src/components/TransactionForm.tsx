import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Transaction, TransactionType } from '../types/finance';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CategorySelect } from './CategorySelect';
import { TransactionList } from './TransactionList';
import { formatCurrency } from '../utils/formatters';

export function TransactionForm() {
  const { 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    fundSources,
    creditCards 
  } = useFinanceStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    from: '',
    type: 'expense' as TransactionType,
    category: '',
    details: '',
    amount: '',
    fundSourceId: '',
    creditCardId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date(`${formData.date}T${formData.time}`);

    const transactionData = {
      date: timestamp,
      amount: Number(formData.amount),
      type: formData.type,
      category: formData.category,
      details: formData.details,
      from: formData.from,
      fundSourceId: formData.fundSourceId,
      creditCardId: formData.type === 'debt' ? formData.creditCardId : undefined,
    };

    if (editingId) {
      updateTransaction(editingId, transactionData);
      setEditingId(null);
    } else {
      addTransaction(transactionData);

      // Update credit card balance if it's a debt transaction
      if (formData.type === 'debt' && formData.creditCardId) {
        const creditCard = creditCards.find(card => card.id === formData.creditCardId);
        if (creditCard) {
          useFinanceStore.getState().updateCreditCard(formData.creditCardId, {
            balance: creditCard.balance + Number(formData.amount)
          });
        }
      }
    }

    resetForm();
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
      fundSourceId: '',
      creditCardId: '',
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
      fundSourceId: transaction.fundSourceId || '',
      creditCardId: transaction.creditCardId || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
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
              onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="debt">Debt</option>
              <option value="investment">Investment</option>
            </select>
          </div>

          {formData.type === 'debt' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Credit Card</label>
              <select
                required
                value={formData.creditCardId}
                onChange={(e) => setFormData({ ...formData, creditCardId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Credit Card</option>
                {creditCards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name} - {card.bank} (Available: {formatCurrency(card.limit - card.balance)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.type === 'expense' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">From Account</label>
              <select
                required
                value={formData.fundSourceId}
                onChange={(e) => setFormData({ ...formData, fundSourceId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Fund Source</option>
                {fundSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.bankName} - {source.accountName} ({formatCurrency(source.balance)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.type === 'income' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">To Account</label>
              <select
                required
                value={formData.fundSourceId}
                onChange={(e) => setFormData({ ...formData, fundSourceId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Fund Source</option>
                {fundSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.bankName} - {source.accountName}
                  </option>
                ))}
              </select>
            </div>
          )}

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
          transactions={transactions.slice().reverse()}
          onEdit={handleEdit}
          onDelete={deleteTransaction}
        />
      </Card>
    </div>
  );
}