import { useState } from 'react';
import './App.css';
import Switcher from "./Switcher";

function App() {
  const options = ["owes you", "is owed"];
  const [name,setName] = useState('');
  const [dir, setDir] = useState(options[0]);
  const [money, setMoney] = useState(0.01);

  document.body.className = "dark:bg-gray-800";

  function addNewRecord(e) {
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/record";
    console.log(url);
    console.log(JSON.stringify({name,dir,money}))
    const myList = document.querySelector("ul");

    fetch(url, {
      method: "POST",
      headers: {"Content-type":"application/json"},
      body: JSON.stringify({name, dir, money})
    }).then((response) => response.json())
    .then((data) => {
      console.log(data)
    })
    .catch(console.error);
  }

  return (
    <main>
      <div>
        <div className="absolute top-0 right-0 w-10"><Switcher/></div>
      </div>
      <div>
        <h1 className="p-6 mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">$400<span>.00</span></h1>
      </div>
      <form onSubmit={addNewRecord} className="space-y-3">
        <div className="gap-1 flex justify-center items-center">
          <input type='text' 
                 value={name} 
                 onChange={ev => setName(ev.target.value)} 
                 placeholder='John Doe' 
                 className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
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
            />
          </div>
        </div>
        <div className="flex justify-center items-center">
            <button type='submit' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm block w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Record</button>
        </div>
      </form>

      <div className='mb-3 space-y-2 p-5 mb-4 text-4xl leading-none tracking-tight text-gray-900 dark:text-white'>
        <div className='gap-3 flex p-5'>
          <div>
            <div className='name'>John Doe</div>
          </div>
          <div>
            <div className="dir">is owed</div>
          </div>
          <div>
            <div className='owes'>$3</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
