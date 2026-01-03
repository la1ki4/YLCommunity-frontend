import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '@pages/LoginPage/LoginPage.jsx';
import MainPage from '@pages/MainPage/MainPage.jsx';
import EventsPage from '@pages/EventsPage/EventsPage.jsx';
import '@app/styles/nullstyle.css'
import ProtectedRoute from '@features/auth-redirect/ProtectedRoute.jsx';
import useAuth from '@features/auth/model/useAuth.jsx';
import PostCreationPage from '@pages/PostCreationPage/PostCreationPage.jsx'

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
          <Route
              path="/post"
              element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <PostCreationPage />
                  </ProtectedRoute>
              }
          />
          <Route
              path="/events"
              element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <EventsPage />
                  </ProtectedRoute>
              }
          />
          <Route
              path="/chat"
              element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <EventsPage />
                  </ProtectedRoute>
              }
          />
          <Route
              path="/friends"
              element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <EventsPage />
                  </ProtectedRoute>
              }
          />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
