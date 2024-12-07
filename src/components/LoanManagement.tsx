import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatCurrency } from '../utils/formatters';
import { Loan, LoanType, LoanStatus } from '../types/finance';
import { LoanProfile } from './loans/LoanProfile';

const loanTypes: LoanType[] = ['personal', 'mortgage', 'auto', 'student', 'business', 'other'];
const loanStatuses: LoanStatus[] = ['active', 'paid', 'defaulted'];

export function LoanManagement() {
  const { loans, transactions, fundSources, addLoan, updateLoan, deleteLoan } = useFinanceStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    lender: '',
    type: 'personal' as LoanType,
    originalAmount: '',
    currentBalance: '',
    interestRate: '',
    monthlyPayment: '',
    startDate: '',
    endDate: '',
    status: 'active' as LoanStatus,
    nextPaymentDate: '',
    fundSourceId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateLoan(editingId, {
        name: formData.name,
        lender: formData.lender,
        type: formData.type,
        originalAmount: Number(formData.originalAmount),
        currentBalance: Number(formData.currentBalance),
        interestRate: Number(formData.interestRate),
        monthlyPayment: Number(formData.monthlyPayment),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        nextPaymentDate: formData.nextPaymentDate,
        fundSourceId: formData.fundSourceId || undefined,
      });
      setEditingId(null);
    } else {
      addLoan({
        name: formData.name,
        lender: formData.lender,
        type: formData.type,
        originalAmount: Number(formData.originalAmount),
        currentBalance: Number(formData.currentBalance),
        interestRate: Number(formData.interestRate),
        monthlyPayment: Number(formData.monthlyPayment),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        nextPaymentDate: formData.nextPaymentDate,
        fundSourceId: formData.fundSourceId || undefined,
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      lender: '',
      type: 'personal',
      originalAmount: '',
      currentBalance: '',
      interestRate: '',
      monthlyPayment: '',
      startDate: '',
      endDate: '',
      status: 'active',
      nextPaymentDate: '',
      fundSourceId: '',
    });
  };

  const handleEdit = (loan: Loan) => {
    setEditingId(loan.id);
    setFormData({
      name: loan.name,
      lender: loan.lender,
      type: loan.type,
      originalAmount: loan.originalAmount.toString(),
      currentBalance: loan.currentBalance.toString(),
      interestRate: loan.interestRate.toString(),
      monthlyPayment: loan.monthlyPayment.toString(),
      startDate: loan.startDate,
      endDate: loan.endDate,
      status: loan.status,
      nextPaymentDate: loan.nextPaymentDate,
      fundSourceId: loan.fundSourceId || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  const totalLoanBalance = loans.reduce((sum, loan) => sum + loan.currentBalance, 0);
  const totalMonthlyPayments = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  const activeLoans = loans.filter(loan => loan.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Loan Balance</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalLoanBalance)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Monthly Payments</h3>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalMonthlyPayments)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Loans</h3>
          <p className="text-3xl font-bold text-green-600">{activeLoans}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loans.map((loan) => (
          <div key={loan.id} className="relative group">
            <div className="absolute top-4 right-4 flex space-x-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(loan)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteLoan(loan.id)}
              >
                Delete
              </Button>
             </div>
            <LoanProfile loan={loan} transactions={transactions} />
          </div>
        ))}
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Loan' : 'Add New Loan'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Loan Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Home Mortgage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Lender</label>
              <input
                type="text"
                required
                value={formData.lender}
                onChange={(e) => setFormData({ ...formData, lender: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Bank Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Loan Type</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as LoanType })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {loanTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as LoanStatus })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {loanStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Original Amount</label>
              <input
                type="number"
                required
                value={formData.originalAmount}
                onChange={(e) => setFormData({ ...formData, originalAmount: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Current Balance</label>
              <input
                type="number"
                required
                value={formData.currentBalance}
                onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700">Monthly Payment</label>
              <input
                type="number"
                required
                value={formData.monthlyPayment}
                onChange={(e) => setFormData({ ...formData, monthlyPayment: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Next Payment Date</label>
              <input
                type="date"
                required
                value={formData.nextPaymentDate}
                onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Source</label>
              <select
                value={formData.fundSourceId}
                onChange={(e) => setFormData({ ...formData, fundSourceId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Payment Source</option>
                {fundSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.bankName} - {source.accountName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingId ? 'Update Loan' : 'Add Loan'}
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