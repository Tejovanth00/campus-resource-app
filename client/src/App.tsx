import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BookResource from './pages/BookResource';
import MyBookings from './pages/MyBookings';
import Resources from './pages/Resources';
import LabTimetable from './pages/LabTimetable';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/" element={
          <PrivateRoute><Home /></PrivateRoute>
        } />
        <Route path="/book" element={
          <PrivateRoute><BookResource /></PrivateRoute>
        } />
        <Route path="/my-bookings" element={
          <PrivateRoute><MyBookings /></PrivateRoute>
        } />
        <Route path="/resources" element={
          <PrivateRoute><Resources /></PrivateRoute>
        } />
        <Route path="/labs" element={
          <PrivateRoute><LabTimetable /></PrivateRoute>
        } />

        {/* Admin only */}
        <Route path="/admin" element={
          <PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>
        } />

      </Routes>
    </Router>
  );
};

export default App;