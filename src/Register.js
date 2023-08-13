import {Link, useNavigate} from "react-router-dom"
import { useState, useContext } from "react";
import axios from 'axios'
import UserContext from "./UserContext";


function Register() {
    //var defs
    const [formInput, setFormInput] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    
    const [formError, setFormError] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    const user = useContext(UserContext);
    
    //helper funcs for input validation and submission
    const handleUserInput = (name, value) => {
        setFormInput({
            ...formInput,
            [name]: value,
        });
    };

    function registerUser(e) {
        e.preventDefault();
        if(validateFormInput(e)) {
            const email = formInput.email
            const password = formInput.password
            const data = {email, password};
            axios.post(process.env.REACT_APP_API_URL + "/register", data, {withCredentials:true}).then((response) => {
                user.setEmail(response.data.email);
                setFormInput({email:'', password:'', confirmPassword:''});
                setFormError({email:'', password:'', confirmPassword:''});
                navigate('/');
            });
        } else {
            console.log('Invalid Params')
        }
        
    }

    const validateFormInput = (event) => {
        event.preventDefault();
        let inputError = {
            email: "",
            password: "",
            confirmPassword: "",
        };

        if (!formInput.email && !formInput.password) {
            setFormError({
            ...inputError,
            email: "Enter valid email address",
            password: "Password should not be empty",
            });
            return false
        }

        if (!formInput.email) {
            setFormError({
            ...inputError,
            email: "Enter valid email address",
            });
            return false
        }

        if (formInput.confirmPassword !== formInput.password) {
            setFormError({
            ...inputError,
            confirmPassword: "Password and confirm password should be same",
            });
            return false;
        }

        if (!formInput.password || formInput.password.length < 8) {
            setFormError({
            ...inputError,
            password: "Password should be 8 characters or longer",
            });
            return false
        }

        setFormError(inputError);
        return true
    };

    return (
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={e => {registerUser(e)}}>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" value={formInput.email} onChange={({ target }) => {handleUserInput(target.name, target.value);}} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""/>
                      <p className="error-message text-red-500">{formError.email}</p>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" value={formInput.password} onChange={({ target }) => {handleUserInput(target.name, target.value);}} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                      <p className="error-message text-red-500">{formError.password}</p>
                  </div>
                  <div>
                      <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                      <input type="password" name="confirmPassword" id="confirm-password" value={formInput.confirmPassword} onChange={({ target }) => {handleUserInput(target.name, target.value);}} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                      <p className="error-message text-red-500">{formError.confirmPassword}</p>
                  </div>
                  
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create account</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <span className="font-medium text-primary-600 hover:underline dark:text-primary-500"><span className="font-medium text-primary-600 hover:underline dark:text-primary-500"><Link to="/login">Login here</Link></span></span>
                  </p>
              </form>
          </div>
      </div>
    )
}

export default Register;