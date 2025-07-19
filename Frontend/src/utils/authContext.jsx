import { useContext, createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';
import { useNavigate } from 'react-router-dom';

const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = async () => {
    console.log("sent");
    try {
      const res = await axiosInstance.post('/user/checkAuth');
      setIsLoggedIn(true); 
    } 
    catch (err) {
          try {
            await axiosInstance.post('/user/logout');
            console.log("logedout !!!")
            setIsLoggedIn(false); 
            window.location.href = process.env.VITE_BASE_URL + "/login"; 
          } catch (err) {
            console.log('Logout error:', err);
          }
        
      
      
    }
  };

  useEffect(() => {
    checkAuth(); 
  }, []);

  return (
    <authContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children} 
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);

export default AuthProvider;
