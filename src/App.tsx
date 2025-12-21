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

      // Sample lost report IDs (these are actual IDs from the database)
      const sampleLostReports = [
        "61e06ef3-9e9c-4207-a5fa-39dfb9378cbc",
        "c0ba7707-b297-4522-bc7c-89b3420b2abf",
        "c5828a9f-b720-4977-98a8-c1c735bfb171"
      ];
      
      // Sample found report IDs (these are actual IDs from the database)
      const sampleFoundReports = [
        "d9a8cdfc-7fab-488d-97ca-8e896cc84dcc",
        "5dd07192-8be8-478b-9578-b64ae5ac1af7",
        "f3acee1a-f9fb-466d-9ab5-6d98fc5ebeb0"
      ];

      // Set the sample reports in localStorage
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
