import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { format } from 'date-fns';

export function InvestmentDetails() {
  const { id } = useParams<{ id: string }>();
  const { investments, fundSources } = useFinanceStore();
  
  const investment = investments.find(i => i.id === id);
  const fundSource = investment?.fundSourceId 
    ? fundSources.find(f => f.id === investment.fundSourceId)
    : null;

  if (!investment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Investment Not Found</h2>
        <Link to="/investments" className="text-blue-600 hover:text-blue-800">
          Return to Investments
        </Link>
      </div>
    );
  }

  const totalValue = investment.currentValue * investment.quantity;
  const totalCost = investment.purchasePrice * investment.quantity;
  const gainLoss = totalValue - totalCost;
  const gainLossPercentage = ((gainLoss / totalCost) * 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{investment.name}</h1>
        <Link to="/investments">
          <Button variant="secondary">Back to Investments</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Current Value</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalValue)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Cost</h3>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalCost)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Gain/Loss</h3>
          <p className={`text-3xl font-bold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(gainLoss)}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="text-lg font-semibold capitalize">
              {investment.type.replace('_', ' ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className={`text-lg font-semibold ${
              investment.status === 'active' 
                ? 'text-green-600' 
                : investment.status === 'sold'
                  ? 'text-blue-600'
                  : 'text-yellow-600'
            }`}>
              {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Purchase Date</p>
            <p className="text-lg font-semibold">
              {format(new Date(investment.purchaseDate), 'MMM d, yyyy')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-lg font-semibold">
              {format(new Date(investment.lastUpdated), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Performance</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Return</span>
              <span className={`text-sm font-medium ${
                gainLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {gainLossPercentage.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  gainLossPercentage >= 0 ? 'bg-green-600' : 'bg-red-600'
                }`}
                style={{ 
                  width: `${Math.min(Math.abs(gainLossPercentage), 100)}%`,
                  marginLeft: gainLossPercentage < 0 ? 'auto' : undefined,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Quantity</p>
              <p className="text-lg font-semibold">{investment.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Purchase Price</p>
              <p className="text-lg font-semibold">
                {formatCurrency(investment.purchasePrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Price</p>
              <p className="text-lg font-semibold">
                {formatCurrency(investment.currentValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Price Change</p>
              <p className={`text-lg font-semibold ${
                investment.currentValue >= investment.purchasePrice 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {((investment.currentValue - investment.purchasePrice) / investment.purchasePrice * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {fundSource && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Fund Source</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{fundSource.bankName}</p>
              <p className="text-sm text-gray-600">{fundSource.accountName}</p>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(fundSource.balance)}</p>
          </div>
        </Card>
      )}

      {investment.notes && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <p className="text-gray-700 whitespace-pre-line">{investment.notes}</p>
        </Card>
      )}
    </div>
  );
}