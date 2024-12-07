import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatCurrency } from '../utils/formatters';
import { CreditCard } from '../types/finance';
import { CreditCardProfile } from './credit-cards/CreditCardProfile';

export function CreditCardManagement() {
  const { creditCards, transactions, addCreditCard, updateCreditCard, deleteCreditCard } = useFinanceStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bank: '',
    limit: '',
    cutOffDate: '',
    balance: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCreditCard(editingId, {
        name: formData.name,
        bank: formData.bank,
        limit: Number(formData.limit),
        cutOffDate: Number(formData.cutOffDate),
        balance: Number(formData.balance),
      });
      setEditingId(null);
    } else {
      addCreditCard({
        name: formData.name,
        bank: formData.bank,
        limit: Number(formData.limit),
        cutOffDate: Number(formData.cutOffDate),
        balance: Number(formData.balance),
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      bank: '',
      limit: '',
      cutOffDate: '',
      balance: '',
    });
  };

  const handleEdit = (card: CreditCard) => {
    setEditingId(card.id);
    setFormData({
      name: card.name,
      bank: card.bank,
      limit: card.limit.toString(),
      cutOffDate: card.cutOffDate.toString(),
      balance: card.balance.toString(),
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  const totalCreditLimit = creditCards.reduce((sum, card) => sum + card.limit, 0);
  const totalBalance = creditCards.reduce((sum, card) => sum + card.balance, 0);
  const totalAvailable = totalCreditLimit - totalBalance;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Credit Limit</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalCreditLimit)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Balance</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(totalBalance)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Available</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalAvailable)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {creditCards.map((card) => (
          <div key={card.id} className="relative group">
            <div className="absolute top-4 right-4 flex space-x-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(card)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteCreditCard(card.id)}
              >
                Delete
              </Button>
            </div>
            <CreditCardProfile card={card} transactions={transactions} />
          </div>
        ))}
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Credit Card' : 'Add New Credit Card'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Rewards Platinum"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bank</label>
            <input
              type="text"
              required
              value={formData.bank}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Chase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Credit Limit</label>
            <input
              type="number"
              required
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cut-off Date</label>
            <input
              type="number"
              required
              value={formData.cutOffDate}
              onChange={(e) => setFormData({ ...formData, cutOffDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              max="31"
              placeholder="Day of month (1-31)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Current Balance</label>
            <input
              type="number"
              required
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingId ? 'Update Credit Card' : 'Add Credit Card'}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}