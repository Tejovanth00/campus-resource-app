import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const PrivateRoute = ({ children, adminOnly = false }: Props) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;