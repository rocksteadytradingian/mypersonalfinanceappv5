import React, { useState } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Investment, InvestmentType, InvestmentStatus } from '../../types/finance';
import { InvestmentProfile } from './InvestmentProfile';

const investmentTypes: InvestmentType[] = ['stocks', 'bonds', 'mutual_funds', 'etf', 'crypto', 'real_estate', 'other'];
const investmentStatuses: InvestmentStatus[] = ['active', 'sold', 'pending'];

export function InvestmentManagement() {
  const { investments, fundSources, addInvestment, updateInvestment, deleteInvestment } = useFinanceStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks' as InvestmentType,
    purchaseDate: '',
    purchasePrice: '',
    currentValue: '',
    quantity: '',
    status: 'active' as InvestmentStatus,
    fundSourceId: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const investmentData = {
      name: formData.name,
      type: formData.type,
      purchaseDate: formData.purchaseDate,
      purchasePrice: Number(formData.purchasePrice),
      currentValue: Number(formData.currentValue),
      quantity: Number(formData.quantity),
      status: formData.status,
      fundSourceId: formData.fundSourceId || undefined,
      notes: formData.notes,
      lastUpdated: new Date(),
    };

    if (editingId) {
      updateInvestment(editingId, investmentData);
      setEditingId(null);
    } else {
      addInvestment(investmentData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'stocks',
      purchaseDate: '',
      purchasePrice: '',
      currentValue: '',
      quantity: '',
      status: 'active',
      fundSourceId: '',
      notes: '',
    });
  };

  const handleEdit = (investment: Investment) => {
    setEditingId(investment.id);
    setFormData({
      name: investment.name,
      type: investment.type,
      purchaseDate: investment.purchaseDate,
      purchasePrice: investment.purchasePrice.toString(),
      currentValue: investment.currentValue.toString(),
      quantity: investment.quantity.toString(),
      status: investment.status,
      fundSourceId: investment.fundSourceId || '',
      notes: investment.notes || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  const totalInvestmentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInvestmentCost = investments.reduce((sum, inv) => sum + (inv.purchasePrice * inv.quantity), 0);
  const totalGainLoss = totalInvestmentValue - totalInvestmentCost;
  const activeInvestments = investments.filter(inv => inv.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Portfolio Value</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalInvestmentValue)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Cost</h3>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalInvestmentCost)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Gain/Loss</h3>
          <p className={`text-3xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totalGainLoss)}
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Investments</h3>
          <p className="text-3xl font-bold text-gray-600">{activeInvestments}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {investments.map((investment) => (
          <div key={investment.id} className="relative group">
            <div className="absolute top-4 right-4 flex space-x-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(investment)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteInvestment(investment.id)}
              >
                Delete
              </Button>
            </div>
            <InvestmentProfile investment={investment} />
          </div>
        ))}
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Investment' : 'Add New Investment'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Investment Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., AAPL Stock"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as InvestmentType })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {investmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
              <input
                type="date"
                required
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
              <input
                type="number"
                required
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.000001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Value</label>
              <input
                type="number"
                required
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as InvestmentStatus })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {investmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fund Source</label>
              <select
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingId ? 'Update Investment' : 'Add Investment'}
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