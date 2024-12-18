import React, { createContext, useReducer, useContext ,useEffect} from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'REQUEST':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, user: action.payload };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const signup = async (name, email, password) => {
    dispatch({ type: 'REQUEST' });
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) throw new Error('Signup failed');
      const data = await response.json();
      dispatch({ type: 'SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
    }
  };

  const login = async (email, password) => {
    dispatch({ type: 'REQUEST' });
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      dispatch({ type: 'SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
    }
  };

  const logout = async () => {
    dispatch({ type: 'REQUEST' });
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}api/auth/logout`, {
        method: 'POST',
        credentials:'include'
      });
      if (!response.ok) throw new Error('Logout failed');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
    }
  };

  const getProfile = async () => {
    dispatch({ type: 'REQUEST' });
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}api/user/profile`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response) throw new Error('Failed to fetch profile');
      const data = await response.json();
      
      dispatch({ type: 'SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
    }
  };

  const updateUserProfile =async(name, email, password )=>{
    dispatch({ type: 'REQUEST' });
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}api/user/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ name,email, password }),
      });
      if (!response) throw new Error('Failed to fetch profile');
      const data = await response.json();
      console.log(data);
      
      dispatch({ type: 'SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
    }
  }

  // useEffect(() => {
  //   getProfile();
  // }, []);


  return (
    <AuthContext.Provider value={{ ...state, signup, login, logout, getProfile,updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
