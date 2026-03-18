import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Experiences from './pages/Experiences';
import CreateExperience from './pages/CreateExperience';
import Mentors from './pages/Mentors';
import MentorDetail from './pages/MentorDetail';
import ExperienceDetail from './pages/ExperienceDetail';
import MyBookings from './pages/MyBookings';
import NotFound from './pages/NotFound';
import './index.css';

function App() {
  const { fetchCurrentUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <Router>
      <div
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/create-experience"
              element={
                isAuthenticated ? <CreateExperience /> : <Navigate to="/login" />
              }
            />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experience/:id" element={<ExperienceDetail />} />
            <Route
              path="/my-bookings"
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" />
              }
            />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/mentor/:id" element={<MentorDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
