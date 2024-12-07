import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6'];

export function InvestmentAnalysis() {
  const { investments, userProfile } = useFinanceStore();
  
  const totalValue = investments.reduce((sum, inv) => sum + (inv.currentValue * inv.quantity), 0);
  const totalCost = investments.reduce((sum, inv) => sum + (inv.purchasePrice * inv.quantity), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalReturn = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  const investmentsByType = investments.reduce((acc, inv) => {
    const value = inv.currentValue * inv.quantity;
    const existing = acc.find(item => item.name === inv.type);
    if (existing) {
      existing.value += value;
      existing.originalValue += inv.purchasePrice * inv.quantity;
    } else {
      acc.push({ 
        name: inv.type, 
        value,
        originalValue: inv.purchasePrice * inv.quantity,
      });
    }
    return acc;
  }, [] as { name: string; value: number; originalValue: number }[]);

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Investment Analysis</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalValue, userProfile?.currency)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Return</p>
          <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalReturn.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={investmentsByType}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value }) => `${name} (${((value / totalValue) * 100).toFixed(1)}%)`}
            >
              {investmentsByType.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatCurrency(value as number, userProfile?.currency)} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {investmentsByType.map((type, index) => {
          const gainLoss = type.value - type.originalValue;
          const returnPercentage = (gainLoss / type.originalValue) * 100;

          return (
            <div key={type.name} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-medium capitalize">{type.name.replace('_', ' ')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Value</p>
                  <p className="font-medium">
                    {formatCurrency(type.value, userProfile?.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Gain/Loss</p>
                  <p className={`font-medium ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(gainLoss, userProfile?.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Return</p>
                  <p className={`font-medium ${returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {returnPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}