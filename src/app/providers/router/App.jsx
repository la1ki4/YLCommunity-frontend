import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '@pages/LoginPage/LoginPage.jsx';
import MainPage from '@pages/MainPage/MainPage.jsx';
import ProtectedRoute from '@features/auth-redirect/ProtectedRoute.jsx';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route 
        path="/main" 
        element={
        <ProtectedRoute>
          <MainPage />
        </ProtectedRoute>
        } 
      />
    </Routes>
  </BrowserRouter>
);

export default App;
