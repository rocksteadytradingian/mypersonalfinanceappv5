import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Debt } from '../types/finance';

export function DebtTracker() {
  const { debts, transactions, addDebt, updateDebt, deleteDebt } = useFinanceStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateDebt(editingId, {
        name: formData.name,
        amount: Number(formData.amount),
        interestRate: Number(formData.interestRate),
        minimumPayment: Number(formData.minimumPayment),
        dueDate: formData.dueDate,
      });
      setEditingId(null);
    } else {
      addDebt({
        name: formData.name,
        amount: Number(formData.amount),
        interestRate: Number(formData.interestRate),
        minimumPayment: Number(formData.minimumPayment),
        dueDate: formData.dueDate,
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      interestRate: '',
      minimumPayment: '',
      dueDate: '',
    });
  };

  const handleEdit = (debt: Debt) => {
    setEditingId(debt.id);
    setFormData({
      name: debt.name,
      amount: debt.amount.toString(),
      interestRate: debt.interestRate.toString(),
      minimumPayment: debt.minimumPayment.toString(),
      dueDate: debt.dueDate,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const debtTransactions = transactions.filter(t => t.type === 'debt');

  // Sort debts by due date
  const sortedDebts = [...debts].sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Debt</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Monthly Payments</h3>
          <p className="text-3xl font-bold text-yellow-600">{formatCurrency(totalMinPayments)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Debts</h3>
          <p className="text-3xl font-bold text-blue-600">{debts.length}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Upcoming Payments</h2>
        <div className="space-y-4">
          {sortedDebts.map((debt) => {
            const daysUntilDue = Math.ceil(
              (new Date(debt.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            const isOverdue = daysUntilDue < 0;
            
            return (
              <div key={debt.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-medium">{debt.name}</h3>
                    <p className={`text-sm ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                      {isOverdue 
                        ? `Overdue by ${Math.abs(daysUntilDue)} days` 
                        : `Due in ${daysUntilDue} days`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-red-600 font-medium">
                      {formatCurrency(debt.amount)}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(debt)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteDebt(debt.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                  <div>
                    <p className="font-medium">Interest Rate</p>
                    <p>{debt.interestRate}%</p>
                  </div>
                  <div>
                    <p className="font-medium">Min Payment</p>
                    <p>{formatCurrency(debt.minimumPayment)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Due Date</p>
                    <p>{formatDate(new Date(debt.dueDate))}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Recent Debt Transactions</h2>
        <div className="space-y-2">
          {debtTransactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{transaction.details}</p>
                <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
              </div>
              <span className="text-red-600 font-medium">
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Debt' : 'Add New Debt'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Debt Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
            <input
              type="number"
              required
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Payment</label>
            <input
              type="number"
              required
              value={formData.minimumPayment}
              onChange={(e) => setFormData({ ...formData, minimumPayment: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingId ? 'Update Debt' : 'Add Debt'}
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