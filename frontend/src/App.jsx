
import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Sidebar from './components/Sidebar';
import styles from './App.module.css';

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth');

  return (
    <div className={styles.appContainer}>
      {!isAuthPage && <Sidebar />}
      <main className={`${styles.mainContent} ${isAuthPage ? styles.fullWidth : ''}`}>
        <AppRoutes />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
