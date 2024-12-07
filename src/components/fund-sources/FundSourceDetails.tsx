import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TransactionList } from '../TransactionList';
import { formatCurrency } from '../../utils/formatters';

export function FundSourceDetails() {
  const { id } = useParams<{ id: string }>();
  const { fundSources, transactions } = useFinanceStore();
  
  const source = fundSources.find(s => s.id === id);
  const sourceTransactions = transactions.filter(t => t.fundSourceId === id);
  
  const totalIncome = sourceTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = sourceTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (!source) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Fund Source Not Found</h2>
        <Link to="/fund-sources" className="text-blue-600 hover:text-blue-800">
          Return to Fund Sources
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{source.accountName}</h1>
        <Link to="/fund-sources">
          <Button variant="secondary">Back to Fund Sources</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Current Balance</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(source.balance)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Account Details</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-500">Bank Name</p>
            <p className="text-gray-900">{source.bankName}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Account Type</p>
            <p className="text-gray-900 capitalize">{source.accountType}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Last Updated</p>
            <p className="text-gray-900">{new Date(source.lastUpdated).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Net Flow</p>
            <p className={`text-gray-900 ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalIncome - totalExpenses)}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <TransactionList 
          transactions={sourceTransactions} 
          onEdit={() => {}} 
          onDelete={() => {}} 
          readOnly={true}
        />
      </Card>
    </div>
  );
}