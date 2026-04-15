// Padhu - Admin Dashboard
// Uses Tej's shared axios instance (api/axios.ts) — token auto-attached
// Calls Padhu's own backend routes:
//   GET  /api/bookings/all           → lists all pending bookings
//   GET  /api/bookings/pending-count → badge count
//   PATCH /api/bookings/:id/status   → approve or reject
// Tej's Booking model fields used: resourceName, date, timeSlot, userId (populated name), approvalImageUrl, status
// Does NOT touch Navbar (Sushma's) or PrivateRoute (Sushma's)

import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

interface BookingUser {
  _id: string;
  name: string;
  email: string;
}

interface ResourceInfo {
  name: string;
  category: string;
}

interface Booking {
  _id: string;
  resourceId: ResourceInfo;
  date: string;
  timeSlot: string;
  purpose: string;
  approvalImageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  userId: BookingUser;
}

type FilterTab = 'pending' | 'approved' | 'rejected' | 'all';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterTab>('pending');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [bookingsRes, countRes] = await Promise.all([
        api.get('/api/bookings/all'),
        api.get('/api/bookings/pending-count'),
      ]);
      setBookings(bookingsRes.data.bookings);
      setPendingCount(countRes.data.count);
    } catch {
      setError('Failed to load bookings. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    try {
      await api.patch(`/api/bookings/${id}/status`, { status });
      setBookings(prev =>
        prev.map(b => (b._id === id ? { ...b, status } : b))
      );
      setPendingCount(prev => Math.max(0, prev - 1));
    } catch {
      alert('Action failed. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter(b =>
    filter === 'all' ? true : b.status === filter
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getImageUrl = (filename: string) => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${base}/uploads/${filename}`;
  };

  return (
    <div style={styles.page}>
      {/* Green blob top-right, same as Login/Register */}
      <div style={styles.bgBlob} />

      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>Review and manage hall booking requests</p>
          </div>
          {pendingCount > 0 && (
            <div style={styles.badgePill}>
              <span style={styles.badgeDot} />
              {pendingCount} pending
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div style={styles.tabs}>
          {(['pending', 'approved', 'rejected', 'all'] as FilterTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                ...styles.tab,
                ...(filter === tab ? styles.tabActive : {}),
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'pending' && pendingCount > 0 && (
                <span style={styles.tabBadge}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={styles.centerState}>
            <div style={styles.loadingSpinner} />
            <p style={styles.stateText}>Loading bookings...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={styles.errorBox}>
            <span style={{ fontSize: '8px' }}>●</span>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div style={styles.centerState}>
            <div style={styles.emptyIcon}>📋</div>
            <p style={styles.stateText}>
              No {filter === 'all' ? '' : filter} bookings found.
            </p>
          </div>
        )}

        {/* Booking cards grid */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div style={styles.grid}>
            {filteredBookings.map(booking => (
              <div key={booking._id} style={styles.card}>
                {/* Status strip */}
                <div style={{
                  ...styles.statusStrip,
                  background:
                    booking.status === 'approved' ? '#c2ed39' :
                    booking.status === 'rejected' ? '#fee2e2' :
                    '#fef9c3',
                }}>
                  <span style={{
                    ...styles.statusLabel,
                    color:
                      booking.status === 'approved' ? '#2d4a00' :
                      booking.status === 'rejected' ? '#dc2626' :
                      '#854d0e',
                  }}>
                    {booking.status === 'approved' && '✓ '}
                    {booking.status === 'rejected' && '✕ '}
                    {booking.status === 'pending' && '◷ '}
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  <h3 style={styles.resourceName}>{booking.resourceId?.name || 'Unknown resource'}</h3>
                  <div style={styles.metaRow}>
                    <span style={styles.metaItem}>
                      <span style={styles.metaIcon}>👤</span>
                      {booking.userId?.name || 'Unknown user'}
                    </span>
                    <span style={styles.metaDivider}>·</span>
                    <span style={styles.metaItem}>
                      <span style={styles.metaIcon}>📅</span>
                      {formatDate(booking.date)}
                    </span>
                  </div>
                  <div style={styles.metaRow}>
                    <span style={styles.metaItem}>
                      <span style={styles.metaIcon}>🕐</span>
                      {booking.timeSlot}
                    </span>
                  </div>
                  {booking.purpose && (
                    <p style={styles.purpose}>"{booking.purpose}"</p>
                  )}

                  {booking.approvalImageUrl && (
                    <div style={styles.imageContainer}>
                      <p style={styles.imageLabel}>Approval form</p>
                      <img
                        src={getImageUrl(booking.approvalImageUrl)}
                        alt="Approval form"
                        style={styles.approvalThumb}
                        onClick={() => setPreviewImage(getImageUrl(booking.approvalImageUrl))}
                        title="Click to enlarge"
                      />
                    </div>
                  )}

                  {booking.status === 'pending' && (
                    <div style={styles.actions}>
                      <button
                        onClick={() => handleAction(booking._id, 'approved')}
                        disabled={actionLoading === booking._id}
                        style={{
                          ...styles.approveBtn,
                          opacity: actionLoading === booking._id ? 0.6 : 1,
                          cursor: actionLoading === booking._id ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {actionLoading === booking._id ? '...' : '✓ Approve'}
                      </button>
                      <button
                        onClick={() => handleAction(booking._id, 'rejected')}
                        disabled={actionLoading === booking._id}
                        style={{
                          ...styles.rejectBtn,
                          opacity: actionLoading === booking._id ? 0.6 : 1,
                          cursor: actionLoading === booking._id ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {actionLoading === booking._id ? '...' : '✕ Reject'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image preview modal */}
      {previewImage && (
        <div style={styles.modalOverlay} onClick={() => setPreviewImage(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setPreviewImage(null)}>✕</button>
            <img src={previewImage} alt="Approval form preview" style={styles.modalImage} />
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f9fafb',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  bgBlob: {
    position: 'fixed',
    top: '-120px',
    right: '-120px',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(194,237,57,0.25) 0%, rgba(194,237,57,0) 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '36px 28px 60px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '28px',
    flexWrap: 'wrap' as const,
    gap: '12px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#111',
    margin: '0 0 4px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  badgePill: {
    background: '#c2ed39',
    color: '#2d4a00',
    borderRadius: '100px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },
  badgeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#2d4a00',
    display: 'inline-block',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '28px',
    flexWrap: 'wrap' as const,
  },
  tab: {
    padding: '9px 20px',
    borderRadius: '100px',
    border: '1.5px solid #e5e7eb',
    background: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    color: '#6b7280',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    transition: 'all 0.15s ease',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  tabActive: {
    background: '#111',
    color: '#fff',
    borderColor: '#111',
  },
  tabBadge: {
    background: '#c2ed39',
    color: '#2d4a00',
    borderRadius: '100px',
    padding: '1px 7px',
    fontSize: '11px',
    fontWeight: 800,
  },
  centerState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    gap: '12px',
  },
  loadingSpinner: {
    width: '36px',
    height: '36px',
    border: '3px solid #e5e7eb',
    borderTopColor: '#c2ed39',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  stateText: {
    fontSize: '15px',
    color: '#9ca3af',
    margin: 0,
  },
  emptyIcon: {
    fontSize: '40px',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1.5px solid #fecaca',
    borderRadius: '12px',
    padding: '16px 20px',
    fontSize: '14px',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    border: '1.5px solid #f0f0f0',
  },
  statusStrip: {
    padding: '10px 18px',
  },
  statusLabel: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  cardBody: {
    padding: '18px 20px',
  },
  resourceName: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#111',
    margin: '0 0 10px',
    letterSpacing: '-0.3px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '5px',
    flexWrap: 'wrap' as const,
  },
  metaItem: {
    fontSize: '13px',
    color: '#4b5563',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  metaIcon: {
    fontSize: '13px',
  },
  metaDivider: {
    color: '#d1d5db',
    fontSize: '13px',
  },
  purpose: {
    fontSize: '13px',
    color: '#6b7280',
    fontStyle: 'italic',
    margin: '10px 0 0',
    borderLeft: '3px solid #c2ed39',
    paddingLeft: '10px',
    lineHeight: 1.5,
  },
  imageContainer: {
    marginTop: '14px',
  },
  imageLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b7280',
    margin: '0 0 6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  approvalThumb: {
    width: '100%',
    height: '140px',
    objectFit: 'cover' as const,
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    cursor: 'zoom-in',
    display: 'block',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
  },
  approveBtn: {
    flex: 1,
    padding: '11px',
    borderRadius: '10px',
    border: 'none',
    background: '#c2ed39',
    color: '#2d4a00',
    fontSize: '14px',
    fontWeight: 700,
    transition: 'background 0.15s',
  },
  rejectBtn: {
    flex: 1,
    padding: '11px',
    borderRadius: '10px',
    border: '1.5px solid #fecaca',
    background: '#fff',
    color: '#dc2626',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '24px',
  },
  modalBox: {
    background: '#fff',
    borderRadius: '20px',
    padding: '16px',
    maxWidth: '700px',
    width: '100%',
    position: 'relative',
  },
  modalClose: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    borderRadius: '10px',
    display: 'block',
    maxHeight: '80vh',
    objectFit: 'contain' as const,
  },
};