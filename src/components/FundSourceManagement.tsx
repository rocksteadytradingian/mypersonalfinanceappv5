import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAccountTypes } from '../hooks/useAccountTypes';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatCurrency } from '../utils/formatters';
import { FundSource, AccountType } from '../types/finance';
import { FundSourceProfile } from './fund-sources/FundSourceProfile';
import { startOfMonth, endOfMonth } from 'date-fns';

export function FundSourceManagement() {
  const { fundSources, transactions, addFundSource, updateFundSource, deleteFundSource } = useFinanceStore();
  const { accountTypes, addAccountType } = useAccountTypes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewAccountType, setShowNewAccountType] = useState(false);
  const [newAccountType, setNewAccountType] = useState('');
  const [formData, setFormData] = useState({
    bankName: '',
    accountName: '',
    accountType: accountTypes[0],
    balance: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateFundSource(editingId, {
        bankName: formData.bankName,
        accountName: formData.accountName,
        accountType: formData.accountType as AccountType,
        balance: Number(formData.balance),
        lastUpdated: new Date(),
      });
      setEditingId(null);
    } else {
      addFundSource({
        bankName: formData.bankName,
        accountName: formData.accountName,
        accountType: formData.accountType as AccountType,
        balance: Number(formData.balance),
        lastUpdated: new Date(),
      });
    }
    resetForm();
  };

  const handleNewAccountType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccountType.trim()) {
      addAccountType(newAccountType.trim());
      setFormData({ ...formData, accountType: newAccountType.trim().toLowerCase() });
      setNewAccountType('');
      setShowNewAccountType(false);
    }
  };

  const resetForm = () => {
    setFormData({
      bankName: '',
      accountName: '',
      accountType: accountTypes[0],
      balance: '',
    });
  };

  const handleEdit = (source: FundSource) => {
    setEditingId(source.id);
    setFormData({
      bankName: source.bankName,
      accountName: source.accountName,
      accountType: source.accountType,
      balance: source.balance.toString(),
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  const totalBalance = fundSources.reduce((sum, source) => sum + source.balance, 0);
  
  // Calculate current month's income and expenses
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const currentMonthIncome = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return (
        t.type === 'income' &&
        transactionDate >= monthStart &&
        transactionDate <= monthEnd
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const currentMonthExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return (
        t.type === 'expense' &&
        transactionDate >= monthStart &&
        transactionDate <= monthEnd
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Balance</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalBalance)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Current Month Income</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(currentMonthIncome)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {monthStart.toLocaleDateString()} - {monthEnd.toLocaleDateString()}
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Current Month Expenses</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(currentMonthExpenses)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {monthStart.toLocaleDateString()} - {monthEnd.toLocaleDateString()}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fundSources.map((source) => (
          <div key={source.id} className="relative group">
            <div className="absolute top-4 right-4 flex space-x-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(source)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteFundSource(source.id)}
              >
                Delete
              </Button>
            </div>
            <FundSourceProfile source={source} transactions={transactions} />
          </div>
        ))}
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Fund Source' : 'Add New Fund Source'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              type="text"
              required
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Chase Bank"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Account Name</label>
            <input
              type="text"
              required
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Primary Checking"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <div className="mt-1 flex space-x-2">
              {!showNewAccountType ? (
                <>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value as AccountType })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {accountTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowNewAccountType(true)}
                  >
                    Add New
                  </Button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={newAccountType}
                    onChange={(e) => setNewAccountType(e.target.value)}
                    placeholder="New account type"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNewAccountType}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowNewAccountType(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
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
              step="0.01"
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingId ? 'Update Fund Source' : 'Add Fund Source'}
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