import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Campus App</div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/book" style={styles.link}>Book a Hall</Link>
        <Link to="/resources" style={styles.link}>Resources</Link>
        <Link to="/labs" style={styles.link}>Lab Timetable</Link>
        <Link to="/my-bookings" style={styles.link}>My Bookings</Link>
        {role === 'admin' && (
          <Link to="/admin" style={styles.link}>Admin</Link>
        )}
      </div>

      <div style={styles.user}>
        {token && (
          <>
            <span style={styles.name}>Hi, {name}</span>
            <button onClick={handleLogout} style={styles.logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    backgroundColor: '#1e1e2e',
    color: 'white',
  },
  logo: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  name: {
    fontSize: '14px',
    color: '#ccc',
  },
  logout: {
    padding: '6px 14px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default Navbar;