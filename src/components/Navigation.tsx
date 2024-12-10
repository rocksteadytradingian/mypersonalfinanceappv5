import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4 items-center overflow-x-auto">
            <Link to="/" className="text-xl font-bold text-blue-600 whitespace-nowrap">
              FinanceTracker
            </Link>
            <Link
              to="/"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/' ? 'text-blue-600' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/add"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/add' ? 'text-blue-600' : ''
              }`}
            >
              Add Transaction
            </Link>
            <Link
              to="/records"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/records' ? 'text-blue-600' : ''
              }`}
            >
              Records
            </Link>
            <Link
              to="/recurring"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/recurring' ? 'text-blue-600' : ''
              }`}
            >
              Recurring
            </Link>
            <Link
              to="/budget"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/budget' ? 'text-blue-600' : ''
              }`}
            >
              Budget
            </Link>
            <Link
              to="/debt"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/debt' ? 'text-blue-600' : ''
              }`}
            >
              Debt
            </Link>
            <Link
              to="/credit-cards"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/credit-cards' ? 'text-blue-600' : ''
              }`}
            >
              Credit Cards
            </Link>
            <Link
              to="/loans"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/loans' ? 'text-blue-600' : ''
              }`}
            >
              Loans
            </Link>
            <Link
              to="/investments"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/investments' ? 'text-blue-600' : ''
              }`}
            >
              Investments
            </Link>
            <Link
              to="/fund-sources"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/fund-sources' ? 'text-blue-600' : ''
              }`}
            >
              Fund Sources
            </Link>
            <Link
              to="/insights"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/insights' ? 'text-blue-600' : ''
              }`}
            >
              Insights
            </Link>
            <Link
              to="/reports"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/reports' ? 'text-blue-600' : ''
              }`}
            >
              Reports
            </Link>
            <Link
              to="/profile"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md whitespace-nowrap ${
                location.pathname === '/profile' ? 'text-blue-600' : ''
              }`}
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}