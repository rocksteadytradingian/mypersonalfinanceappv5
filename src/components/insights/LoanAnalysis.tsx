import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6'];

export function LoanAnalysis() {
  const { loans, transactions, userProfile } = useFinanceStore();
  
  const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.originalAmount, 0);
  const totalCurrentBalance = loans.reduce((sum, loan) => sum + loan.currentBalance, 0);
  const totalPaid = totalLoanAmount - totalCurrentBalance;
  const totalMonthlyPayments = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  const loanData = loans.map(loan => ({
    name: loan.name,
    value: loan.currentBalance,
    originalAmount: loan.originalAmount,
    monthlyPayment: loan.monthlyPayment,
    interestRate: loan.interestRate,
    progress: ((loan.originalAmount - loan.currentBalance) / loan.originalAmount) * 100,
  }));

  const activeLoanCount = loans.filter(loan => loan.status === 'active').length;
  const paidLoanCount = loans.filter(loan => loan.status === 'paid').length;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Loan Analysis</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Total Loan Amount</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalLoanAmount, userProfile?.currency)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Current Balance</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totalCurrentBalance, userProfile?.currency)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalPaid, userProfile?.currency)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Monthly Payments</p>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(totalMonthlyPayments, userProfile?.currency)}
          </p>
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={loanData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {loanData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatCurrency(value as number, userProfile?.currency)} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600">Active Loans</p>
          <p className="text-xl font-bold text-blue-700">{activeLoanCount}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600">Paid Off Loans</p>
          <p className="text-xl font-bold text-green-700">{paidLoanCount}</p>
        </div>
      </div>

      <div className="space-y-4">
        {loanData.map((loan, index) => (
          <div key={loan.name} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-medium">{loan.name}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${loan.progress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Original</p>
                <p className="font-medium">
                  {formatCurrency(loan.originalAmount, userProfile?.currency)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Balance</p>
                <p className="font-medium">
                  {formatCurrency(loan.value, userProfile?.currency)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Monthly</p>
                <p className="font-medium">
                  {formatCurrency(loan.monthlyPayment, userProfile?.currency)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Interest</p>
                <p className="font-medium">{loan.interestRate}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}