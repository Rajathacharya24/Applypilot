import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient, setAuthToken } from '../services/apiClient';

const AuthContext = createContext(null);

function decodeUser(token) {
  try {
    const decoded = jwtDecode(token);

    return {
      id: decoded.id || null,
      email: decoded.sub || decoded.email || '',
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const nextToken = response.data?.token || null;

    if (!nextToken) {
      throw new Error('Login failed: missing token');
    }

    setAuthToken(nextToken);
    setTokenState(nextToken);
    setUser(decodeUser(nextToken));

    return response.data;
  };

  const logout = () => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}