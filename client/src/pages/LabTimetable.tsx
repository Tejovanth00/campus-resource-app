import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

interface LabSlot {
  _id: string;
  lab: string;
  day: string;
  timeSlot: string;
  subject: string;
  faculty: string;
  status: string;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const LabTimetable = () => {
  const [slots, setSlots] = useState<LabSlot[]>([]);
  const [selectedLab, setSelectedLab] = useState('CS Lab 1');
  const [editSlot, setEditSlot] = useState<LabSlot | null>(null);
  const role = sessionStorage.getItem('role');

  const fetchSlots = useCallback(async () => {
    try {
      const res = await api.get(`/api/labs?lab=${selectedLab}`);
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [selectedLab]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSlots();
  }, [fetchSlots]);

  const handleUpdate = async (id: string, status: string, subject: string, faculty: string) => {
    try {
      await api.patch(`/api/labs/${id}`, { status, subject, faculty });
      setEditSlot(null);
      fetchSlots();
    } catch (err) {
      console.error(err);
    }
  };

  const getSlotsForDay = (day: string) => slots.filter((slot) => slot.day === day);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Lab Timetable</h2>
              <p className="mt-2 text-sm text-slate-600">Choose a lab to review the weekly schedule.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {['CS Lab 1', 'CS Lab 2', 'Electronics Lab'].map((lab) => (
                <button
                  key={lab}
                  type="button"
                  onClick={() => setSelectedLab(lab)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedLab === lab ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {lab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-950 text-left text-white">
              <tr>
                <th className="border border-slate-200 px-4 py-4">Time Slot</th>
                {days.map((day) => (
                  <th key={day} className="border border-slate-200 px-4 py-4">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM'].map((time) => (
                <tr key={time} className="even:bg-slate-50">
                  <td className="border border-slate-200 px-4 py-4 font-semibold text-slate-900">{time}</td>
                  {days.map((day) => {
                    const slot = getSlotsForDay(day).find((s) => s.timeSlot === time);
                    return (
                      <td key={day} className="border border-slate-200 px-4 py-4 align-top">
                        {slot ? (
                          <div className="space-y-3">
                            <div>
                              <p className={`font-semibold ${slot.status === 'cancelled' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                {slot.subject}
                              </p>
                              <p className="mt-1 text-sm text-slate-600">{slot.faculty}</p>
                            </div>
                            {role === 'admin' && (
                              <button
                                onClick={() => setEditSlot(slot)}
                                className="rounded-full bg-[#c2ed39] px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-[#b0d930]"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">Free</p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Edit Slot</h3>
              <button onClick={() => setEditSlot(null)} className="text-slate-500 transition hover:text-slate-900">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <input
                  value={editSlot.subject}
                  onChange={(e) => setEditSlot({ ...editSlot, subject: e.target.value })}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c2ed39] focus:ring-2 focus:ring-[#c2ed39]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Faculty</label>
                <input
                  value={editSlot.faculty}
                  onChange={(e) => setEditSlot({ ...editSlot, faculty: e.target.value })}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c2ed39] focus:ring-2 focus:ring-[#c2ed39]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select
                  value={editSlot.status}
                  onChange={(e) => setEditSlot({ ...editSlot, status: e.target.value })}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c2ed39] focus:ring-2 focus:ring-[#c2ed39]/30"
                >
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => handleUpdate(editSlot._id, editSlot.status, editSlot.subject, editSlot.faculty)}
                  className="flex-1 rounded-2xl bg-[#c2ed39] px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#b0d930]"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditSlot(null)}
                  className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTimetable;