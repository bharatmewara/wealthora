import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('adminToken') || null,
  loading: true,
  error: null
};

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  RESTORE_SESSION: 'RESTORE_SESSION'
};

function authReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        loading: false
      };
    case ACTIONS.LOGIN_ERROR:
      return { ...state, isAuthenticated: false, user: null, error: action.payload, loading: false };
    case ACTIONS.LOGOUT:
      return { ...state, isAuthenticated: false, user: null, token: null, error: null, loading: false };
    case ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false
      };
    default:
      return state;
  }
}

// Decode JWT payload without verifying signature (verification happens server-side)
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      const decoded = decodeToken(token);
      // Check token is not expired
      if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
        dispatch({
          type: ACTIONS.RESTORE_SESSION,
          payload: {
            token,
            user: { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role }
          }
        });
      } else {
        // Token expired — clear it
        localStorage.removeItem('adminToken');
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    } else {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/login`,
        { email, password }
      );
      const { token, user } = response.data;
      localStorage.setItem('adminToken', token);
      dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { token, user } });
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      dispatch({ type: ACTIONS.LOGIN_ERROR, payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    dispatch({ type: ACTIONS.LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
