import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

interface Resource {
  _id: string;
  name: string;
  category: string;
  available: boolean;
  checkedOutBy?: { name: string };
}

interface ApprovedBooking {
  _id: string;
  resourceId: {
    _id?: string;
    name?: string;
    category?: string;
  } | string;
  status: 'approved';
  returnedAt?: Date;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [approvedBookings, setApprovedBookings] = useState<ApprovedBooking[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchResources = useCallback(async () => {
    try {
      const url = category === 'all' ? '/api/resources' : `/api/resources?category=${category}`;
      const res = await api.get(url);
      const resourceList = Array.isArray(res.data) ? res.data : [];
      setResources(resourceList);
      console.log('Resources loaded:', resourceList);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setResources([]);
    }
  }, [category]);

  const fetchApprovedBookings = useCallback(async () => {
    try {
      const res = await api.get('/api/bookings/my');
      const bookings = Array.isArray(res.data?.bookings) ? res.data.bookings : [];
      const approved = bookings.filter(
        (b: any) => b.status === 'approved' && !b.returnedAt
      ) || [];
      setApprovedBookings(approved);
      console.log('Approved bookings loaded:', approved);
    } catch (err) {
      console.error('Error fetching approved bookings:', err);
      setApprovedBookings([]);
    }
  }, []);

  useEffect(() => {
    fetchResources();
    fetchApprovedBookings();
  }, [fetchResources, fetchApprovedBookings]);

  const handleCheckout = async (id: string) => {
    try {
      setLoading(true);
      await api.patch(`/api/resources/${id}/checkout`);
      fetchResources();
    } catch {
      alert('Already checked out!');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id: string) => {
    try {
      setLoading(true);
      await api.patch(`/api/resources/${id}/return`);
      fetchResources();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnApprovalBased = async (bookingId: string) => {
    try {
      setLoading(true);
      const response = await api.patch('/api/bookings/return', { bookingId });
      console.log('Return response:', response.data);
      await fetchApprovedBookings();
      await fetchResources();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to return resource';
      alert(errorMsg);
      console.error('Return error:', err);
    } finally {
      setLoading(false);
    }
  };

  const userName = sessionStorage.getItem('name');
  
  const userHasBooking = (resourceId: string) =>
    approvedBookings.some(b => {
      const bResourceId = typeof b.resourceId === 'string' ? b.resourceId : (b.resourceId?._id || '');
      return bResourceId === resourceId;
    });
  
  const getUserBookingId = (resourceId: string) => {
    const booking = approvedBookings.find(b => {
      const bResourceId = typeof b.resourceId === 'string' ? b.resourceId : (b.resourceId?._id || '');
      return bResourceId === resourceId;
    });
    return booking?._id || '';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Resources</h2>
              <p className="mt-2 text-sm text-slate-600">Browse campus assets, categories, and availability.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  fetchResources();
                  fetchApprovedBookings();
                }}
                disabled={loading}
                className="rounded-full px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-900 hover:bg-slate-300 disabled:opacity-50 transition"
              >
                🔄 Refresh
              </button>
              {['all', 'equipment', 'approval-based', 'recreational'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === cat ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {cat === 'all' ? 'All' : cat.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => {
            const isApprovalBased = resource.category === 'approval-based';
            const isCheckedOutByMe = resource.checkedOutBy?.name === userName;
            const userHasApprovedBooking = userHasBooking(resource._id);

            return (
              <div key={resource._id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{resource.name}</h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.15em] text-slate-500">{resource.category}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${resource.available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {resource.available ? 'Available' : 'Checked out'}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {resource.available
                    ? isApprovalBased
                      ? 'Book this resource via the Book Resource page. Admin approval required.'
                      : 'This resource is ready to book.'
                    : isApprovalBased && userHasApprovedBooking
                    ? 'You have approval to use this resource.'
                    : `Checked out by ${resource.checkedOutBy?.name || 'someone'}`}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {/* Checkout button — only for non-approval-based resources */}
                  {resource.available && !isApprovalBased && (
                    <button
                      onClick={() => handleCheckout(resource._id)}
                      disabled={loading}
                      className="rounded-2xl bg-[#c2ed39] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-[#b0d930] disabled:opacity-50"
                    >
                      Checkout
                    </button>
                  )}

                  {/* Return button — for whoever has non-approval resource checked out */}
                  {!resource.available && isCheckedOutByMe && !isApprovalBased && (
                    <button
                      onClick={() => handleReturn(resource._id)}
                      disabled={loading}
                      className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                    >
                      Return
                    </button>
                  )}

                  {/* Return button — for approval-based resources */}
                  {isApprovalBased && userHasApprovedBooking && (
                    <button
                      onClick={() => handleReturnApprovalBased(getUserBookingId(resource._id))}
                      disabled={loading}
                      className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                    >
                      Return
                    </button>
                  )}

                  {/* Link to book approval-based resource */}
                  {resource.available && isApprovalBased && !userHasApprovedBooking && (
                    <a 
                      href="/book"
                      className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Book via Request →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Resources;