import React from 'react';
import { IncomeOverview } from './dashboard/IncomeOverview';
import { ExpenseBreakdown } from './dashboard/ExpenseBreakdown';
import { CashflowChart } from './dashboard/CashflowChart';
import { DebtOverview } from './dashboard/DebtOverview';
import { RecurringPayables } from './dashboard/RecurringPayables';
import { QuickInsights } from './dashboard/QuickInsights';
import { FundSourcesOverview } from './dashboard/FundSourcesOverview';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FundSourcesOverview />
        <IncomeOverview />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseBreakdown />
        <DebtOverview />
      </div>
      
      <CashflowChart />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecurringPayables />
        <QuickInsights />
      </div>
    </div>
  );
}