import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '@pages/LoginPage/LoginPage.jsx';
import MainPage from '@pages/MainPage/MainPage.jsx';
import ProtectedRoute from '@features/auth-redirect/ProtectedRoute.jsx';
import useAuth from '@app/hooks/useAuth.jsx';

const App = () => {
  const { isAuthenticated, authChecked, checkAuth } = useAuth();

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <MainPage /> : <LoginPage onLoginSuccess={checkAuth} />} 
        />
        <Route 
          path="/main" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
