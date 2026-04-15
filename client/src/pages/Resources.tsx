import { useCallback, useEffect, useState } from 'react';
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

  const fetchResources = useCallback(async () => {
    try {
      const url = category === 'all' ? '/api/resources' : `/api/resources?category=${category}`;
      const res = await api.get(url);
      setResources(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [category]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResources();
  }, [fetchResources]);

  const handleCheckout = async (id: string) => {
    try {
      await api.patch(`/api/resources/${id}/checkout`);
      fetchResources();
    } catch {
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

  const userName = sessionStorage.getItem('name');

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
          {resources.map((resource) => (
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
                  ? 'This resource is ready to book.'
                  : `Checked out by ${resource.checkedOutBy?.name || 'someone'}`}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {resource.available && (
                  <button
                    onClick={() => handleCheckout(resource._id)}
                    className="rounded-2xl bg-[#c2ed39] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-[#b0d930]"
                  >
                    Checkout
                  </button>
                )}
                {!resource.available && resource.checkedOutBy?.name === userName && (
                  <button
                    onClick={() => handleReturn(resource._id)}
                    className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Return
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;