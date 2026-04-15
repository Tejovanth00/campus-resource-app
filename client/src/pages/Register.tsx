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