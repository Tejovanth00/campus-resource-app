import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface Booking {
  _id: string;
  resourceId: {
    name: string;
    category: string;
  };
  date: string;
  timeSlot: string;
  status: string;
}

const Home = () => {
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, statsRes] = await Promise.all([
          api.get('/api/bookings/my'),
          api.get('/api/bookings/stats'),
        ]);

        const bookings = Array.isArray(bookingsRes.data?.bookings) ? bookingsRes.data.bookings : [];
        setRecentBookings(bookings.slice(0, 3));
        setStats(statsRes.data || { totalBookings: 0, pendingBookings: 0, approvedBookings: 0 });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setFetchError('Unable to load dashboard data. Please login again or refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c2ed39]"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#c2ed39] text-[#1e1e2e] px-5 py-3 rounded-lg font-semibold hover:bg-[#b0d930] transition-colors"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Campus Resource Hub</h1>
          <p className="text-gray-600">Manage your resource bookings and access campus facilities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#c2ed39]">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[#c2ed39] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-400">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approvedBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/book"
            className="bg-[#c2ed39] hover:bg-[#b0d930] text-black p-6 rounded-lg shadow-sm transition-colors group"
          >
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold">Book Resource</h3>
                <p className="text-sm opacity-90">Reserve halls & equipment</p>
              </div>
            </div>
          </Link>

          <Link
            to="/my-bookings"
            className="bg-white hover:bg-gray-50 text-gray-900 p-6 rounded-lg shadow-sm transition-colors border group"
          >
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3 text-gray-600 group-hover:text-[#c2ed39] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <div>
                <h3 className="font-semibold">My Bookings</h3>
                <p className="text-sm text-gray-600">View your reservations</p>
              </div>
            </div>
          </Link>

          <Link
            to="/resources"
            className="bg-white hover:bg-gray-50 text-gray-900 p-6 rounded-lg shadow-sm transition-colors border group"
          >
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3 text-gray-600 group-hover:text-[#c2ed39] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div>
                <h3 className="font-semibold">Resources</h3>
                <p className="text-sm text-gray-600">Browse available items</p>
              </div>
            </div>
          </Link>

          <Link
            to="/labs"
            className="bg-white hover:bg-gray-50 text-gray-900 p-6 rounded-lg shadow-sm transition-colors border group"
          >
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3 text-gray-600 group-hover:text-[#c2ed39] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div>
                <h3 className="font-semibold">Lab Timetable</h3>
                <p className="text-sm text-gray-600">Check lab schedules</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{typeof booking.resourceId === 'string' ? booking.resourceId : booking.resourceId?.name || 'Unknown resource'}</h3>
                    <p className="text-sm text-gray-600">{typeof booking.resourceId === 'string' ? 'Resource ID' : booking.resourceId?.category || 'No category'} • {booking.date} • {booking.timeSlot}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recent bookings found.</p>
          )}
          <div className="mt-4">
            <Link
              to="/my-bookings"
              className="text-[#c2ed39] hover:text-[#b0d930] font-medium transition-colors"
            >
              View all bookings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;