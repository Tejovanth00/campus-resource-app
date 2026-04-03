import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Resource {
  _id: string;
  name: string;
  category: string;
  available: boolean;
  checkedOutBy?: { name: string };
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [category, setCategory] = useState('all');

  const fetchResources = async () => {
    try {
      const url = category === 'all' ? '/api/resources' : `/api/resources?category=${category}`;
      const res = await api.get(url);
      setResources(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [category]);

  const handleCheckout = async (id: string) => {
    try {
      await api.patch(`/api/resources/${id}/checkout`);
      fetchResources();
    } catch (err) {
      alert('Already checked out!');
    }
  };

  const handleReturn = async (id: string) => {
    try {
      await api.patch(`/api/resources/${id}/return`);
      fetchResources();
    } catch (err) {
      console.error(err);
    }
  };

  const userName = localStorage.getItem('name');

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Resources</h2>

      {/* Category Filter */}
      <div style={styles.tabs}>
        {['all', 'projector', 'sports', 'hostel'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              ...styles.tab,
              backgroundColor: category === cat ? '#1e1e2e' : '#eee',
              color: category === cat ? 'white' : '#333',
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Resource Cards */}
      <div style={styles.grid}>
        {resources.map((resource) => (
          <div key={resource._id} style={styles.card}>
            <h3 style={styles.cardTitle}>{resource.name}</h3>
            <p style={styles.category}>{resource.category}</p>

            <p style={{
              ...styles.status,
              color: resource.available ? 'green' : 'red',
            }}>
              {resource.available
                ? 'Available'
                : `Checked out by ${resource.checkedOutBy?.name || 'someone'}`}
            </p>

            {resource.available && (
              <button
                onClick={() => handleCheckout(resource._id)}
                style={styles.checkoutBtn}
              >
                Checkout
              </button>
            )}

            {!resource.available && resource.checkedOutBy?.name === userName && (
              <button
                onClick={() => handleReturn(resource._id)}
                style={styles.returnBtn}
              >
                Return
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
  },
  heading: {
    fontSize: '22px',
    marginBottom: '16px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
  },
  tab: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '16px',
  },
  cardTitle: {
    fontSize: '16px',
    marginBottom: '4px',
  },
  category: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '8px',
    textTransform: 'capitalize',
  },
  status: {
    fontSize: '13px',
    marginBottom: '12px',
  },
  checkoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  returnBtn: {
    padding: '8px 16px',
    backgroundColor: '#e67e22',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default Resources;