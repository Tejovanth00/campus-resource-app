import React, { useState } from 'react';
import api from '../api/axios';

const BookResource = () => {  
    const [resourceId, setResourceId] = useState('');
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [purpose, setPurpose] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); 
      setLoading(true);// stops page from refreshing
      try {
        const formData = new FormData();
        formData.append('resourceId', resourceId);
        formData.append('date', date);
        formData.append('timeSlot', timeSlot);
        formData.append('purpose', purpose);
        if (image) {
          formData.append('approvalImageUrl', image);
        }
        await api.post('/api/bookings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }

    });
        setLoading(false);
        setSuccess(true);
    
      } catch {
        setError('Something went wrong');
        setLoading(false);
      }
    };

  return <>
  <h1>Book Resource</h1>
  <form onSubmit={handleSubmit}>
    <select value={resourceId} onChange={(e) => setResourceId(e.target.value)}>
      <option value="">Select Resource</option>
      <option value="hall_a">Seminar Hall A</option>
      <option value="auditorium">Auditorium</option>
    </select>
    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
    <input type="text" placeholder="Time Slot" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} />
    <input type="text" placeholder="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
    <input type="file" onChange={handleImageChange} />
    <button type="submit" disabled={loading}>
     {loading ? 'Submitting...' : 'Book'}
    </button>
    {error && <p>{error}</p>}
    {success && <p>Booking successful!</p>}
  </form>
  </>
};
export default BookResource;