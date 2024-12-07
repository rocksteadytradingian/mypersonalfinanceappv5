import React from 'react';
import { Link } from 'react-router-dom';
import { FundSource, Transaction } from '../../types/finance';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';

interface FundSourceProfileProps {
  source: FundSource;
  transactions: Transaction[];
}

export function FundSourceProfile({ source, transactions }: FundSourceProfileProps) {
  const sourceTransactions = transactions.filter(t => t.fundSourceId === source.id);
  const totalIncome = sourceTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = sourceTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Link to={`/fund-sources/${source.id}`}>
      <Card className="relative overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full" />
        </div>
        
        <div className="relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">{source.accountName}</h2>
              <p className="text-gray-600">{source.bankName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Account Type</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{source.accountType}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(source.balance)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Flow</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(totalIncome - totalExpenses)}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <p>Last Updated: {new Date(source.lastUpdated).toLocaleDateString()}</p>
              <p>{sourceTransactions.length} transactions</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}