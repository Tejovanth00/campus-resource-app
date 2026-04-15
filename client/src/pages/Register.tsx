// Padhu - Register Page
// Uses Tej's shared axios instance from api/axios.ts
// Submits to POST /api/auth/register, redirects to /login on success
// Role and userType enums match Padhu's User model exactly

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

type Role = 'admin' | 'user';
type UserType = 'faculty' | 'classrep' | 'hosteller';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: Role | '';
  userType: UserType | '';
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    role: '',
    userType: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role || !form.userType) {
      setError('Please select both a role and user type.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/register', form);
      navigate('/login');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#c2ed39';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#e5e7eb';
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgBlob} />
      <div style={styles.bgBlobBottom} />

      <div style={styles.card}>
        {/* Brand */}
        <div style={styles.brandRow}>
          <div style={styles.logoCircle}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={styles.brandName}>CampusRes</span>
        </div>

        <h1 style={styles.heading}>Create account</h1>
        <p style={styles.subheading}>Join to start booking campus resources</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Name */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Padma Priya"
              required
              style={styles.input}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@college.edu"
              required
              style={styles.input}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
              style={styles.input}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          {/* Role + UserType - side by side */}
          <div style={styles.twoCol}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  color: form.role ? '#111' : '#9ca3af',
                }}
                onFocus={focusStyle}
                onBlur={blurStyle}
              >
                <option value="" disabled>Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>User type</label>
              <select
                name="userType"
                value={form.userType}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  color: form.userType ? '#111' : '#9ca3af',
                }}
                onFocus={focusStyle}
                onBlur={blurStyle}
              >
                <option value="" disabled>Select type</option>
                <option value="faculty">Faculty</option>
                <option value="classrep">Class Rep</option>
                <option value="hosteller">Hosteller</option>
              </select>
            </div>
          </div>

          {/* Role hint */}
          <div style={styles.hintBox}>
            <span style={styles.hintIcon}>ℹ</span>
            <span>
              <strong>Class Rep / Faculty</strong> can book halls &amp; borrow equipment.{' '}
              <strong>Hosteller</strong> can borrow hostel items.{' '}
              <strong>Admin</strong> manages approvals.
            </span>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorDot}>●</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = '#b0d930'); }}
            onMouseLeave={e => { if (!loading) (e.currentTarget.style.background = '#c2ed39'); }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  bgBlob: {
    position: 'absolute',
    top: '-100px',
    right: '-100px',
    width: '380px',
    height: '380px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(194,237,57,0.22) 0%, rgba(194,237,57,0) 70%)',
    pointerEvents: 'none',
  },
  bgBlobBottom: {
    position: 'absolute',
    bottom: '-80px',
    left: '-80px',
    width: '260px',
    height: '260px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(194,237,57,0.12) 0%, rgba(194,237,57,0) 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '44px 44px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
    position: 'relative',
    zIndex: 1,
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '28px',
  },
  logoCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: '#c2ed39',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#111',
    letterSpacing: '-0.3px',
  },
  heading: {
    fontSize: '26px',
    fontWeight: 800,
    color: '#111',
    margin: '0 0 6px',
    letterSpacing: '-0.5px',
  },
  subheading: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  twoCol: {
    display: 'flex',
    gap: '14px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    fontSize: '15px',
    color: '#111',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    width: '100%',
    boxSizing: 'border-box',
    appearance: 'none',
  },
  hintBox: {
    background: 'rgba(194,237,57,0.12)',
    border: '1.5px solid rgba(194,237,57,0.4)',
    borderRadius: '10px',
    padding: '11px 14px',
    fontSize: '12px',
    color: '#374151',
    display: 'flex',
    gap: '8px',
    lineHeight: 1.5,
  },
  hintIcon: {
    fontSize: '14px',
    color: '#6b7280',
    flexShrink: 0,
    marginTop: '1px',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1.5px solid #fecaca',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '13px',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  errorDot: {
    fontSize: '8px',
  },
  submitBtn: {
    background: '#c2ed39',
    color: '#111',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: 700,
    transition: 'background 0.15s ease',
    marginTop: '4px',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '24px',
    marginBottom: 0,
  },
  link: {
    color: '#111',
    fontWeight: 700,
    textDecoration: 'none',
    borderBottom: '2px solid #c2ed39',
    paddingBottom: '1px',
  },
};
