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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] h-72 w-72 rounded-full bg-[#c2ed39]/20 blur-3xl"></div>
        <div className="absolute bottom-[-60px] left-[-60px] h-72 w-72 rounded-full bg-slate-900/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white px-8 py-10 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#c2ed39] text-slate-950">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-slate-900">CampusHub</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
        <p className="mt-2 text-sm text-slate-600">Get started and book campus facilities with a single login.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Padma Priya"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c2ed39] focus:ring-2 focus:ring-[#c2ed39]/30"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@college.edu"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c2ed39] focus:ring-2 focus:ring-[#c2ed39]/30"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c2ed39] focus:ring-2 focus:ring-[#c2ed39]/30"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c2ed39] focus:ring-2 focus:ring-[#c2ed39]/30"
              >
                <option value="" disabled>
                  Select role
                </option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="userType" className="block text-sm font-semibold text-slate-700 mb-2">
                User type
              </label>
              <select
                id="userType"
                name="userType"
                value={form.userType}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c2ed39] focus:ring-2 focus:ring-[#c2ed39]/30"
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="faculty">Faculty</option>
                <option value="classrep">Class Rep</option>
                <option value="hosteller">Hosteller</option>
              </select>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Who should register?</p>
            <p className="mt-2">
              Faculty and class reps can reserve halls and equipment; hostellers can borrow items. Admins review approval requests.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[#c2ed39] px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#b0d930] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-slate-950 underline decoration-[#c2ed39]/70 underline-offset-4 hover:text-[#111]">
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
