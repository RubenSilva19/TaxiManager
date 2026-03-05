import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import DriverEarnings from '../pages/DriverEarnings';
import AdminPanel from '../pages/AdminPanel';
import TripHistory from '../pages/TripHistoryPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/:id/panel" element={<AdminPanel />} />
      <Route path="/user/:id/driverEarnings" element={<DriverEarnings />} />
      <Route path="/:id/historico" element={<TripHistory />} />
      <Route path="*" element={<div>404 - Página não encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes;
