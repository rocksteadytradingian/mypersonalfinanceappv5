import React from 'react';
import { Transaction } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Button } from './ui/Button';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

export function TransactionList({ transactions, onEdit, onDelete, readOnly = false }: TransactionListProps) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
        >
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{transaction.category}</span>
              <span
                className={`font-medium ${
                  transaction.type === 'expense' || transaction.type === 'debt' 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}
              >
                {transaction.type === 'expense' || transaction.type === 'debt' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <p>{transaction.details}</p>
              <p>{formatDate(transaction.date)}</p>
            </div>
          </div>
          {!readOnly && (
            <div className="ml-4 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(transaction)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(transaction.id)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}