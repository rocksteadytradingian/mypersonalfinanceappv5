import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CategorySelect } from './CategorySelect';
import { formatCurrency } from '../utils/formatters';

export function BudgetTracker() {
  const { budgets, addBudget, updateBudget, deleteBudget } = useFinanceStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBudget(editingId, {
        category: formData.category,
        amount: Number(formData.amount),
        period: formData.period,
        spent: 0,
      });
      setEditingId(null);
    } else {
      addBudget({
        category: formData.category,
        amount: Number(formData.amount),
        period: formData.period,
        spent: 0,
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      category: '',
      amount: '',
      period: 'monthly',
    });
  };

  const handleEdit = (budget: { id: string; category: string; amount: number; period: 'monthly'; spent: number }) => {
    setEditingId(budget.id);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
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
          {editingId ? 'Edit Budget' : 'Add New Budget'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700">Period</label>
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: 'monthly' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingId ? 'Update Budget' : 'Add Budget'}
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
        <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
        <div className="space-y-4">
          {budgets.map((budget) => (
            <div key={budget.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{budget.category}</h3>
                <span className="text-sm text-gray-500">{budget.period}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(budget.spent / budget.amount) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Spent: {formatCurrency(budget.spent)}</span>
                <span>Budget: {formatCurrency(budget.amount)}</span>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEdit(budget)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteBudget(budget.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}