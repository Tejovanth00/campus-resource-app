import { useState, useEffect } from 'react';
import api from '../api/axios';

interface Resource {
  name: string;
  category: string;
}

interface Booking {
  _id: string;
  resourceId: Resource;
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
        setBookings(res.data.bookings);
      } catch {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'approved') return 'green';
    if (status === 'rejected') return 'red';
    return 'orange';
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!bookings.length) return <p>No bookings yet</p>;

  return (
    <>
      <h1>My Bookings</h1>
      {bookings.map((booking) => (
        <div key={booking._id}>
          <h3>{booking.resourceId.name}</h3>
          <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
          <p>Time: {booking.timeSlot}</p>
          <p>Purpose: {booking.purpose}</p>
          <p style={{ color: getStatusColor(booking.status) }}>
            Status: {booking.status.toUpperCase()}
          </p>
        </div>
      ))}
    </> 
  );
};

export default MyBookings;