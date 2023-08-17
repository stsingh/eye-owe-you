import {BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react";
import './App.css';
import Start from './Start'
import Switcher from "./Switcher";
import Login from './Login'
import Register from './Register'
import UserContext from "./UserContext";
import axios from 'axios';
import App from './App'

const Landing = () => {
  const [email, setEmail] = useState('');

  //Get the email to provide as context for all routes
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/user', {withCredentials:true}).then(response => {
      setEmail(response.data.email);
    })
  }, []);

  document.body.className = "dark:bg-gray-800";
  return (
    <UserContext.Provider value={{email, setEmail}}>
      <div className="absolute top-2 left-2"><Switcher/></div>
      <BrowserRouter>
        <div className="grid h-screen place-items-center">
          <div className="flex flex-col items-center justify-center">
            <Routes>
              <Route path="/" element={<Start/>}/>
              <Route path='/home' element={<App/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/register' element={<Register/>}/>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
    
  );
};

export default Landing;