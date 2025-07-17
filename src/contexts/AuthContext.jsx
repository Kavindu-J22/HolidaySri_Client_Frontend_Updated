import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { authAPI } from '../config/api';

// Initial state
const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, loading: false };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          // Verify token with backend
          const response = await authAPI.getCurrentUser();
          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: {
              user: response.data.user,
              token,
            },
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        // Token is invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: { user, token },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.register(userData);
      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: { user, token },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Google sign in
  const signInWithGoogle = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const googleData = {
        googleId: user.uid,
        email: user.email,
        name: user.displayName,
        profileImage: user.photoURL,
      };

      const response = await authAPI.googleAuth(googleData);

      if (response.data.requiresRegistration) {
        // New Google user needs to complete registration
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return {
          success: false,
          requiresRegistration: true,
          googleData: response.data.googleData,
          message: response.data.message,
        };
      } else {
        // Existing user, login successful
        const { token, user: userData } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user: userData, token },
        });

        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Google sign in failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
    } catch (error) {
      console.error('Firebase signout error:', error);
    }

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Update state
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Send OTP
  const sendOTP = async (email, name) => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      const response = await authAPI.sendOTP(email, name);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Verify OTP
  const verifyOTP = async (email, otp) => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      const response = await authAPI.verifyOTP(email, otp);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Update user data
  const updateUser = (userData) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: userData });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    signInWithGoogle,
    logout,
    sendOTP,
    verifyOTP,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
