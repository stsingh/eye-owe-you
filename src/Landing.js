import {BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react";
import './App.css';
import Switcher from "./Switcher";
import Login from './Login'
import Register from './Register'
import UserContext from "./UserContext";
import axios from 'axios';
import App from './App'

const Landing = () => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/user', {withCredentials:true}).then(response => {
      setEmail(response.data.email);
    })
  }, []);

  function logout() {
    axios.post(process.env.REACT_APP_API_URL + '/logout', {}, {withCredentials:true}).then(() => {
      setEmail('');
    });
  }

  document.body.className = "dark:bg-gray-800";
  return (
    <UserContext.Provider value={{email, setEmail}}>
          
          <div className="absolute top-2 left-2"><Switcher/></div>
          
          <BrowserRouter>
              <div>
                {!!email && (
                  <div>
                    <div className="absolute top-2 right-2">
                      <div className="flex justify-end ">
                        <button className="dark:text-white bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-3 border border-blue-500 hover:border-transparent rounded" onClick={() => logout()}>Log out</button>
                      </div>
                      
                    </div>
                    <App/>
                    
                  </div>
                )} 
                {!email && (
                  <div className="grid h-screen place-items-center">
                    <div className="flex flex-col items-center justify-center">
                      <Routes>
                        <Route path='/' element={<App/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/register' element={<Register/>}/>
                      </Routes>
                    </div>
                  </div>
                )}
              </div>
              
            
          </BrowserRouter>
        
        
        <div className="absolute inset-x-0 bottom-2 text-center dark:text-white" >A MERN-based webapp by&nbsp;<a href="https://stsingh.github.io/" target="_blank" rel="noreferrer">Sahej Singh</a></div>
    </UserContext.Provider>
    
  );
};

export default Landing;