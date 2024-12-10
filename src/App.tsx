import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionRecords } from './components/TransactionRecords';
import { BudgetTracker } from './components/BudgetTracker';
import { DebtTracker } from './components/DebtTracker';
import { InsightsPanel } from './components/InsightsPanel';
import { RecurringTransactions } from './components/RecurringTransactions';
import { CreditCardManagement } from './components/CreditCardManagement';
import { CreditCardDetails } from './components/credit-cards/CreditCardDetails';
import { LoanManagement } from './components/LoanManagement';
import { LoanDetails } from './components/loans/LoanDetails';
import { InvestmentManagement } from './components/investments/InvestmentManagement';
import { InvestmentDetails } from './components/investments/InvestmentDetails';
import { FundSourceManagement } from './components/FundSourceManagement';
import { FundSourceDetails } from './components/fund-sources/FundSourceDetails';
import { Reports } from './components/Reports';
import { UserProfile } from './components/UserProfile';
import { Navigation } from './components/Navigation';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<TransactionForm />} />
            <Route path="/records" element={<TransactionRecords />} />
            <Route path="/recurring" element={<RecurringTransactions />} />
            <Route path="/budget" element={<BudgetTracker />} />
            <Route path="/debt" element={<DebtTracker />} />
            <Route path="/credit-cards" element={<CreditCardManagement />} />
            <Route path="/credit-cards/:id" element={<CreditCardDetails />} />
            <Route path="/loans" element={<LoanManagement />} />
            <Route path="/loans/:id" element={<LoanDetails />} />
            <Route path="/investments" element={<InvestmentManagement />} />
            <Route path="/investments/:id" element={<InvestmentDetails />} />
            <Route path="/fund-sources" element={<FundSourceManagement />} />
            <Route path="/fund-sources/:id" element={<FundSourceDetails />} />
            <Route path="/insights" element={<InsightsPanel />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;