import { useState, useEffect } from 'react';
import './App.css';
import Switcher from "./Switcher";

function App() {
  //useStates
  const options = ["owes you", "is owed"];
  const [name,setName] = useState('');
  const [dir, setDir] = useState(options[0]);
  const [money, setMoney] = useState(0.01);
  const[records, setRecords] = useState([]);

  //get records to page
  useEffect(() => {
    getRecords().then(setRecords);
  }, [])

  //method to get balances for each person

  
  //get records from mongodb
  async function getRecords() {
    const url = process.env.REACT_APP_API_URL + "/records";
    const response = await fetch(url);
    return await response.json();
  }

  //add a new record to the database
  const addNewRecord = async (e) => {
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/record";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {"Content-type":"application/json"},
        body: JSON.stringify({name, dir, money})
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      const responseData = await response.json();
      console.log(responseData.message); // Message from the server
    } catch (error) {
      console.error('Error updating money:', error.message);
    }
  };

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
      return <div className="text-2xl">{record.name} <span className={'text-green-800'}>{record.dir}</span> ${record.money.toFixed(2)}</div>
    }
    return <div className="text-2xl"><span className={'text-red-800'}>You owe</span> {record.name} ${0-record.money.toFixed(2)}</div>
  }

  document.body.className = "dark:bg-gray-800";
  return (
    <main className="content-center">
      <div>
        <div className="absolute top-0 right-0 w-10"><Switcher/></div>
      </div>
      <span className = "p-2 flex justify-center items-center align-baseline dark:text-white font-bold text-2xl">Spending Power: </span>
      <div className='flex justify-center items-center'>
        <h1 className="p-3 mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">${balance.toFixed(2)}</h1>
      </div>
      <form onSubmit={addNewRecord} className="space-y-3">
        <div className="gap-1 flex justify-center items-center">
          <input type='text' 
                 value={name} 
                 onChange={ev => setName(capitalizeFirstLetter(ev.target.value))} 
                 placeholder='Name' 
                 className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 required
          />
          <select onChange={(e) => 
                  setDir(e.target.value)} 
                  defaultValue={dir} 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {options.map((option, idx) => (
            <option key={idx}>{option}</option>
            ))}
          </select>
          <div className='dark:text-white'>
          $
            <input type="number" 
                   value={money} 
                   onChange={ev => setMoney(ev.target.value)} 
                   className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required
            />
          </div>
        </div>
        <div className="flex justify-center">
            <button type='submit' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm block w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Record</button>
        </div>
      </form>
      <div className='mb-3 space-y-2 p-5 mb-4 text-gray-900 dark:text-white'>
        <h1 className='flex justify-center items-center text-3xl font-bold'>Summary: </h1>
        <ul className='list-disc'>
          {records.length > 0 && records.map(record => (
            <li><div key = {record._id} className ='gap-3 flex p-5'>
              {sentence(record)}
            </div></li>
          ))}
        </ul>
        
      </div>

      
    </main>
  );
}

export default App;
