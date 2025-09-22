import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const { user, token, login, register, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (!token) {
    return (
      <Login 
        onLogin={login}
        onRegister={register}  // Add this line - this was missing!
        showRegister={showRegister}
        onShowRegister={() => setShowRegister(true)}
        onHideRegister={() => setShowRegister(false)}
      />
    );
  }

  return <Dashboard user={user} onLogout={logout} />;
}

export default App;