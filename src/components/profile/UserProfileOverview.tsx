import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { calculateTotalIncome, calculateTotalExpenses } from '../../utils/calculations';
import { getCountriesData } from '../../utils/countries';

const countries = getCountriesData();

export function UserProfileOverview() {
  const { userProfile, transactions } = useFinanceStore();
  
  if (!userProfile) {
    return null;
  }

  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const currentSavings = totalIncome - totalExpenses;
  
  const savingsProgress = userProfile.savingsGoal 
    ? (currentSavings / userProfile.savingsGoal) * 100 
    : 0;

  const country = countries.find(c => c.code === userProfile.country);

  return (
    <Card>
      <div className="flex items-start space-x-6 mb-6">
        <div className="flex-shrink-0">
          {userProfile.photoUrl ? (
            <img
              src={userProfile.photoUrl}
              alt={userProfile.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-semibold">{userProfile.name}</h2>
              <p className="text-gray-600">{userProfile.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                {country?.emoji} {country?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Member since</p>
              <p className="font-medium">
                {new Date(userProfile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {userProfile.savingsGoal && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Savings Goal Progress</span>
            <span>{savingsProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${Math.min(savingsProgress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Current: {formatCurrency(currentSavings, userProfile.currency)}</span>
            <span>Goal: {formatCurrency(userProfile.savingsGoal, userProfile.currency)}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userProfile.monthlyBudgetLimit && (
          <div>
            <p className="text-sm text-gray-600">Monthly Budget Limit</p>
            <p className="text-lg font-semibold">
              {formatCurrency(userProfile.monthlyBudgetLimit, userProfile.currency)}
            </p>
          </div>
        )}
        
        {userProfile.monthlyIncomeTarget && (
          <div>
            <p className="text-sm text-gray-600">Monthly Income Target</p>
            <p className="text-lg font-semibold">
              {formatCurrency(userProfile.monthlyIncomeTarget, userProfile.currency)}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <div>
            <p>Currency</p>
            <p className="font-medium text-gray-900">{userProfile.currency}</p>
          </div>
          <div>
            <p>Theme</p>
            <p className="font-medium text-gray-900">
              {userProfile.theme.charAt(0).toUpperCase() + userProfile.theme.slice(1)}
            </p>
          </div>
          <div>
            <p>Notifications</p>
            <p className="font-medium text-gray-900">
              {userProfile.notificationsEnabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}