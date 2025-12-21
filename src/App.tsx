import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import routes from './routes';
import Header from '@/components/layouts/Header';
import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  useEffect(() => {
    // Enable dark mode by default
    document.documentElement.classList.add('dark');

    // Initialize localStorage with sample "My Reports" data if not already set
    const initializeMyReports = () => {
      // Check if already initialized
      if (localStorage.getItem('myReportsInitialized') === 'true') {
        return;
      }

      // Get some recent item IDs from the database to simulate user's reports
      // These will be the first few items that were added
      const sampleLostReports = [
        // These IDs will exist from our initial seed data
      ];
      
      const sampleFoundReports = [
        // These IDs will exist from our initial seed data
      ];

      // For demo purposes, we'll add a few sample IDs
      // In a real app, these would be actual report IDs from the user's submissions
      if (!localStorage.getItem('myLostReports')) {
        localStorage.setItem('myLostReports', JSON.stringify(sampleLostReports));
      }
      
      if (!localStorage.getItem('myFoundReports')) {
        localStorage.setItem('myFoundReports', JSON.stringify(sampleFoundReports));
      }

      // Mark as initialized
      localStorage.setItem('myReportsInitialized', 'true');
    };

    initializeMyReports();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
};

export default App;
