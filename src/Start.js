import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from 'react'
import UserContext from './UserContext';

const Start = () => {
  const userInfo = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(userInfo.email) {
      navigate('/home');
    }
  }, [navigate, userInfo.email])
    
  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="p-3 mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"><span className="text-7xl"></span>EyeOweYou</h1>
        <div className="p-3 mb-4 text-xl text-center font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">Never lose sight of the money you borrow or lend again</div>
        <div>
          <div>
              <Link to={'/login'}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" >Get started</button>
              </Link>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-2 text-center dark:text-white" >A MERN-based webapp by&nbsp;<a href="https://stsingh.github.io/" target="_blank" rel="noreferrer">Sahej Singh</a></div>
    </div>
      
  )
}

export default Start;