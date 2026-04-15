import { useState, useEffect } from 'react';
import api from '../api/axios';

interface Resource {
  name?: string;
  category?: string;
}

interface Booking {
  _id: string;
  resourceId: Resource | string;
  date: string;
  timeSlot: string;
  purpose: string;
  approvalImageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/api/bookings/my');
        setBookings(res.data.bookings || []);
      } catch {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: Booking['status']) => {
    if (status === 'approved') return 'green';
    if (status === 'rejected') return 'red';
    return 'orange';
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!bookings.length) return <p>No bookings yet</p>;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
              <p className="mt-2 text-sm text-slate-600">Track your resource reservations and approval status.</p>
            </div>
            <p className="text-sm text-slate-500">
              Showing {bookings.length} booking{bookings.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {bookings.map((booking) => {
            const resourceName =
              typeof booking.resourceId === 'string'
                ? 'Resource details unavailable'
                : booking.resourceId?.name || 'Resource details unavailable';

            return (
              <div key={booking._id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{resourceName}</h2>
                    <p className="mt-2 text-sm text-slate-600">{typeof booking.resourceId === 'string' ? '' : booking.resourceId?.category}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="mt-1 font-semibold text-slate-900">{booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Time Slot</p>
                    <p className="mt-1 font-semibold text-slate-900">{booking.timeSlot || 'N/A'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-slate-500">Purpose</p>
                    <p className="mt-1 text-slate-700">{booking.purpose || 'N/A'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;