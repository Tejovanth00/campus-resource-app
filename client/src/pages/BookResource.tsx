import React, { useState, useEffect } from 'react';
import api from '../api/axios';

interface ResourceOption {
  _id: string;
  name: string;
  category: string;
  available: boolean;
}

const BookResource = () => {
  const [resources, setResources] = useState<ResourceOption[]>([]);
  const [resourceId, setResourceId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [purpose, setPurpose] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/api/resources');
        setResources(res.data);
      } catch (err) {
        console.error(err);
        setError('Unable to load resources');
      }
    };

    fetchResources();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

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
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      setResourceId('');
      setDate('');
      setTimeSlot('');
      setPurpose('');
      setImage(null);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Book Resource</h1>
      <form onSubmit={handleSubmit}>
        <select value={resourceId} onChange={(e) => setResourceId(e.target.value)}>
          <option value="">Select Resource</option>
          {resources.map((resource) => (
            <option key={resource._id} value={resource._id}>
              {resource.name} {resource.available ? '' : '(Unavailable)'}
            </option>
          ))}
        </select>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="text" placeholder="Time Slot" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} />
        <input type="text" placeholder="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        <input type="file" onChange={handleImageChange} />
        <button type="submit" disabled={loading || !resourceId}>
          {loading ? 'Submitting...' : 'Book'}
        </button>
        {error && <p>{error}</p>}
        {success && <p>Booking successful!</p>}
      </form>
    </>
  );
};

export default BookResource;
