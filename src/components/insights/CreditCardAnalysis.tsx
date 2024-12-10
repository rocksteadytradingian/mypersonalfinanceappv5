import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CardData {
  name: string;
  balance: number;
  available: number;
  utilization: number;
}

export function CreditCardAnalysis() {
  const { creditCards } = useFinanceStore();
  
  const totalLimit = creditCards.reduce((sum, card) => sum + card.limit, 0);
  const totalBalance = creditCards.reduce((sum, card) => sum + card.balance, 0);
  const totalAvailable = totalLimit - totalBalance;
  const utilizationRate = (totalBalance / totalLimit) * 100;

  const cardData = creditCards.map(card => ({
    name: card.name,
    balance: card.balance,
    available: card.limit - card.balance,
    utilization: (card.balance / card.limit) * 100,
  }));

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'utilization') {
      return `${value.toFixed(1)}%`;
    }
    return formatCurrency(value);
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Credit Card Analysis</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Total Credit Limit</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalLimit)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Balance</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totalBalance)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Credit Utilization</span>
          <span>{utilizationRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              utilizationRate > 75 
                ? 'bg-red-600' 
                : utilizationRate > 50 
                  ? 'bg-yellow-600' 
                  : 'bg-green-600'
            }`}
            style={{ width: `${utilizationRate}%` }}
          />
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cardData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatTooltipValue(value, name),
                name === 'utilization' ? 'Utilization Rate' : name.charAt(0).toUpperCase() + name.slice(1)
              ]}
            />
            <Bar dataKey="balance" stackId="a" fill="#EF4444" name="Balance" />
            <Bar dataKey="available" stackId="a" fill="#10B981" name="Available" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {cardData.map((card: CardData) => (
          <div key={card.name} className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-2">{card.name}</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Balance</p>
                <p className="font-medium text-red-600">
                  {formatCurrency(card.balance)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Available</p>
                <p className="font-medium text-green-600">
                  {formatCurrency(card.available)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Utilization</p>
                <p className="font-medium">{card.utilization.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}