import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Theme } from '../../types/finance';
import { PhotoUpload } from './PhotoUpload';
import { getCountriesData, getCurrencyForCountry } from '../../utils/countries';

const themes: Theme[] = ['light', 'dark', 'system'];
const countries = getCountriesData();

export function UserProfileForm() {
  const { userProfile, setUserProfile, updateUserProfile, updateCurrency } = useFinanceStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoUrl: '',
    country: 'US',
    currency: 'USD',
    theme: 'system' as Theme,
    monthlyBudgetLimit: '',
    monthlyIncomeTarget: '',
    savingsGoal: '',
    notificationsEnabled: true,
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
        photoUrl: userProfile.photoUrl || '',
        country: userProfile.country,
        currency: userProfile.currency,
        theme: userProfile.theme,
        monthlyBudgetLimit: userProfile.monthlyBudgetLimit?.toString() || '',
        monthlyIncomeTarget: userProfile.monthlyIncomeTarget?.toString() || '',
        savingsGoal: userProfile.savingsGoal?.toString() || '',
        notificationsEnabled: userProfile.notificationsEnabled,
      });
    }
  }, [userProfile]);

  const handleCountryChange = (countryCode: string) => {
    const currency = getCurrencyForCountry(countryCode);
    setFormData(prev => ({
      ...prev,
      country: countryCode,
      currency,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      setUserProfile({
        id: crypto.randomUUID(),
        ...formData,
        monthlyBudgetLimit: formData.monthlyBudgetLimit ? Number(formData.monthlyBudgetLimit) : undefined,
        monthlyIncomeTarget: formData.monthlyIncomeTarget ? Number(formData.monthlyIncomeTarget) : undefined,
        savingsGoal: formData.savingsGoal ? Number(formData.savingsGoal) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // Update currency if it changed
      if (formData.currency !== userProfile.currency) {
        updateCurrency(formData.currency);
      }
      
      updateUserProfile({
        ...formData,
        monthlyBudgetLimit: formData.monthlyBudgetLimit ? Number(formData.monthlyBudgetLimit) : undefined,
        monthlyIncomeTarget: formData.monthlyIncomeTarget ? Number(formData.monthlyIncomeTarget) : undefined,
        savingsGoal: formData.savingsGoal ? Number(formData.savingsGoal) : undefined,
      });
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <PhotoUpload
          currentPhotoUrl={formData.photoUrl}
          onPhotoChange={(photoUrl) => setFormData({ ...formData, photoUrl })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <select
              value={formData.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.emoji} {country.name} ({country.currency})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <select
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value as Theme })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Budget Limit</label>
            <input
              type="number"
              value={formData.monthlyBudgetLimit}
              onChange={(e) => setFormData({ ...formData, monthlyBudgetLimit: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Income Target</label>
            <input
              type="number"
              value={formData.monthlyIncomeTarget}
              onChange={(e) => setFormData({ ...formData, monthlyIncomeTarget: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Savings Goal</label>
            <input
              type="number"
              value={formData.savingsGoal}
              onChange={(e) => setFormData({ ...formData, savingsGoal: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifications"
            checked={formData.notificationsEnabled}
            onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
            Enable Notifications
          </label>
        </div>

        <Button type="submit" variant="primary">
          {userProfile ? 'Update Profile' : 'Create Profile'}
        </Button>
      </form>
    </Card>
  );
}