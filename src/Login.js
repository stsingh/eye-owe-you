import {Link, useNavigate} from "react-router-dom"
import { useState, useContext } from "react";
import axios from 'axios'
import UserContext from "./UserContext";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false)
    const user = useContext(UserContext);
    const navigate = useNavigate();


    function loginUser(e) {
        e.preventDefault();
        if(validateFormInput()) {
            const data = {email, password};
            axios.post(process.env.REACT_APP_API_URL + "/login", data, {withCredentials:true}).then((response) => {
                if(response.headers["content-length"] > 10) {
                    navigate('/')
                    user.setEmail(response.data.email);
                    setEmail('');
                    setPassword('');
                    setLoginError(false);
                } else {
                    setLoginError(true);
                }
            }).catch(() => {
                setLoginError(true);
            })
        } else {
            setLoginError(true);
        }
    }

    const validateFormInput = () => {
        if (!email && !password) {
            return false;
        }

        if (!email) {
            return false;
        }

        if (!password || password.length < 8) {
            return false;
        }

        return true;
        
    };

    return (
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={e => {loginUser(e)}}>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" value={email} onChange={e => {setEmail(e.target.value)}} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" value={password} onChange={e => {setPassword(e.target.value)}} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                  </div>
                  
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                  {loginError && (
                    <div className="text-red-500">Invalid username or password</div>
                  )}
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <span className="font-medium text-primary-600 hover:underline dark:text-primary-500"><Link to="/register">Sign Up</Link></span>
                  </p>
              </form>
          </div>
      </div>
    )
}

export default Login;