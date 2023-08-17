import { useState, useEffect, useContext } from 'react';
import './App.css';
import UserContext from './UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function App() {
  //useStates
  const options = ["owes you", "is owed"];
  const [isLoading, setIsLoading] = useState(true);
  const [name,setName] = useState('');
  const [dir, setDir] = useState(options[0]);
  const [money, setMoney] = useState('');
  const[records, setRecords] = useState([]);
  const userInfo = useContext(UserContext);
  const navigate = useNavigate();

  //get records to page
  useEffect(() => {
    const verify = async () => {
      let userEmail = await userInfo.email;
      if(userEmail) {
        const url = process.env.REACT_APP_API_URL + "/records";
        axios.get(url, {withCredentials:true}).then(response => {
          setRecords(response.data);
        });
      } else {
        setTimeout(navigate('/'), 200);
      }
      setIsLoading(false);
    }
    setTimeout(verify, 250);
  }, [navigate, userInfo.email])

  if(isLoading) {
    return(
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status">
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span>
      </div>
    )
  }

  //logout of account
  function logout() {
    axios.post(process.env.REACT_APP_API_URL + '/logout', {}, {withCredentials:true}).then(() => {
      userInfo.setEmail('');
      navigate('/');
    });
  }

  //add new record to user account
  async function addNewRecord(e) {
    const url = process.env.REACT_APP_API_URL + "/records";
    axios.put(url, {name: name, dir: dir, money: money}, {withCredentials:true}).then(response => {
      setRecords([...records, response.data]);
      setName('');
      setDir('');
      setMoney('');
      console.log(response)
    })
  }

  //make sure names are capitalized
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //get balance at top
  let balance = 0;
  for(const record of records) {
      balance += record.money;
  }

  //get display sentence
  function sentence(record) {
    if(record.dir === "owes you") {
      return <div className="text-2xl">{record.name} <span className={'text-green-800'}>{record.dir}</span> ${record?.money?.toFixed(2)}</div>
    }
    return <div className="text-2xl"><span className={'text-red-800'}>You owe</span> {record.name} ${0-record?.money?.toFixed(2)}</div>
  }

  document.body.className = "dark:bg-gray-800";

  return (
    <main>
      <div className="absolute top-2 right-2">
        <div className="flex justify-end ">
          <button className="dark:text-white bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-3 border border-blue-500 hover:border-transparent rounded" onClick={() => logout()}>Log out</button>
        </div>          
     </div>
      <div>
        <span className = "p-2 flex justify-center items-center align-baseline dark:text-white font-bold text-2xl">Spending Power: </span>
      </div>
      <div className='flex justify-center items-center'>
        <h1 className="p-3 mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">${balance?.toFixed(2)}</h1>
      </div>
      <form onSubmit={addNewRecord} className="space-y-3 text-center">
        <div className="gap-1 lg:flex md:flex sm:flex justify-center items-center">
          <div>
            <input type='text' 
                  value={name} 
                  onChange={ev => setName(capitalizeFirstLetter(ev.target.value))} 
                  placeholder='Name' 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
            />
          </div>
          <div>
            <select onChange={(e) => 
                    setDir(e.target.value)} 
                    defaultValue={dir} 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {options.map((option, idx) => (
              <option key={idx}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className='relative rounded-md dark:text-white'>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input type="number" 
                  min="0"
                  step="0.01" 
                  name="price" 
                  id="price"
                  value={money} 
                  onChange={ev => setMoney(ev.target.value)} 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-7 " placeholder="0.00"
                  required/>
          </div>
        </div>
        <div className="flex justify-center">
            <button type='submit' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm block w-fit sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Record</button>
        </div>
      </form>
      
      <div className='text-gray-900 dark:text-white p-6'>
        <h1 className='flex justify-center items-center text-3xl font-bold'>Summary: </h1>
        {records.length > 0 && records.map(record => (
            <div key={record._id} className="flex justify-center items-center p-5 ">
              <div className="justify-start border-b-2 border-y-gray-400 max-w-md">
                {sentence(record)}
              </div>
              <div className="right">
              </div>
            </div>
          ))}
      </div>
      
    </main>
  );
  
}

export default App;
