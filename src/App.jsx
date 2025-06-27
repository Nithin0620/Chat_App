import React from 'react'

import Navbar from './components/Navbar.jsx'
import ProfilePage from "./pages/ProfilePage.jsx"
import Home from "./pages/Home.jsx"
import SettingsPage from "./pages/SettingsPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import VerifyEmail from './pages/VerifyEmail.jsx'

import { useNavigate  ,Route , Routes, Navigate } from 'react-router-dom'

import { Loader } from "lucide-react";
import { toast } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }  
  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser? <Home/> : <Navigate to="/login"/>}/>
        <Route path='/Signup' element={!authUser? <SignupPage/> : <Navigate to="/"/>}/>
        <Route path='/login' element={!authUser? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/login' element={authUser? <ProfilePage/> : <Navigate to="/login"/>}/>
        <Route path='/verifyemail' element={!authUser? <VerifyEmail/> : <Navigate to="/"/>}/>
      </Routes>
    </div>
  )
}

export default App
