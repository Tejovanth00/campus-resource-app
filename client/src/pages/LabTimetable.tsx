import { useEffect, useState } from 'react';
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
  const role = localStorage.getItem('role');

  const fetchSlots = async () => {
    try {
      const res = await api.get(`/api/labs?lab=${selectedLab}`);
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedLab]);

  const handleUpdate = async (id: string, status: string, subject: string, faculty: string) => {
    try {
      await api.patch(`/api/labs/${id}`, { status, subject, faculty });
      setEditSlot(null);
      fetchSlots();
    } catch (err) {
      console.error(err);
    }
  };

  const getSlotsForDay = (day: string) => {
    return slots.filter((slot) => slot.day === day);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Lab Timetable</h2>

      {/* Lab Filter */}
      <div style={styles.tabs}>
        {['CS Lab 1', 'CS Lab 2', 'Electronics Lab'].map((lab) => (
          <button
            key={lab}
            onClick={() => setSelectedLab(lab)}
            style={{
              ...styles.tab,
              backgroundColor: selectedLab === lab ? '#1e1e2e' : '#eee',
              color: selectedLab === lab ? 'white' : '#333',
            }}
          >
            {lab}
          </button>
        ))}
      </div>

      {/* Timetable */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Time Slot</th>
              {days.map((day) => (
                <th key={day} style={styles.th}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM'].map((time) => (
              <tr key={time}>
                <td style={styles.timeCell}>{time}</td>
                {days.map((day) => {
                  const slot = getSlotsForDay(day).find((s) => s.timeSlot === time);
                  return (
                    <td
                      key={day}
                      style={{
                        ...styles.td,
                        backgroundColor: slot?.status === 'cancelled' ? '#f8f8f8' : 'white',
                      }}
                    >
                      {slot ? (
                        <div>
                          <p style={{
                            ...styles.subject,
                            textDecoration: slot.status === 'cancelled' ? 'line-through' : 'none',
                            color: slot.status === 'cancelled' ? '#aaa' : '#333',
                          }}>
                            {slot.subject}
                          </p>
                          <p style={styles.faculty}>{slot.faculty}</p>

                          {role === 'admin' && (
                            <button
                              onClick={() => setEditSlot(slot)}
                              style={styles.editBtn}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      ) : (
                        <p style={styles.free}>Free</p>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal (admin only) */}
      {editSlot && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3 style={{ marginBottom: '16px' }}>Edit Slot</h3>

            <label style={styles.label}>Subject</label>
            <input
              style={styles.input}
              value={editSlot.subject}
              onChange={(e) => setEditSlot({ ...editSlot, subject: e.target.value })}
            />

            <label style={styles.label}>Faculty</label>
            <input
              style={styles.input}
              value={editSlot.faculty}
              onChange={(e) => setEditSlot({ ...editSlot, faculty: e.target.value })}
            />

            <label style={styles.label}>Status</label>
            <select
              style={styles.input}
              value={editSlot.status}
              onChange={(e) => setEditSlot({ ...editSlot, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={() => handleUpdate(editSlot._id, editSlot.status, editSlot.subject, editSlot.faculty)}
                style={styles.saveBtn}
              >
                Save
              </button>
              <button
                onClick={() => setEditSlot(null)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '24px' },
  heading: { fontSize: '22px', marginBottom: '16px' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '24px' },
  tab: { padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { backgroundColor: '#1e1e2e', color: 'white', padding: '10px 14px', textAlign: 'left', whiteSpace: 'nowrap' },
  td: { border: '1px solid #ddd', padding: '10px 14px', verticalAlign: 'top', minWidth: '130px' },
  timeCell: { border: '1px solid #ddd', padding: '10px 14px', fontWeight: 500, whiteSpace: 'nowrap', backgroundColor: '#f5f5f5' },
  subject: { fontSize: '13px', marginBottom: '2px', fontWeight: 500 },
  faculty: { fontSize: '12px', color: '#888' },
  free: { fontSize: '12px', color: '#bbb' },
  editBtn: { marginTop: '6px', padding: '4px 10px', fontSize: '11px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  modal: { position: 'fixed' as const, top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalBox: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '320px' },
  label: { fontSize: '13px', color: '#555', display: 'block', marginBottom: '4px' },
  input: { width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' },
  saveBtn: { padding: '8px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  cancelBtn: { padding: '8px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default LabTimetable;