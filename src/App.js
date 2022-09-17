import { useState } from 'react'
import Playground from './components/Playground';
import NameInput from './components/NameInput';
import './App.css';


function App() {
  const [name, setName] = useState('')

  const [enter, setEnter] = useState(false)

  return (
    <div className="App">
      {enter ? (<Playground name={name} />) : (<NameInput name={name} setName={setName} setEnter={setEnter} />)} 
    </div>
  );
}

export default App;
