import { useState } from 'react'
import Playground from './components/Playground';
import NameInput from './components/NameInput';
import './App.css';


function App() {
  const [name, setName] = useState('')
  const [color, setColor] = useState()
  const [enter, setEnter] = useState(false)

  return (
    <div className="App">
      {enter ? (<Playground name={name} color={color} />) : (<NameInput name={name} setName={setName} setEnter={setEnter} setColor={setColor} />)} 
    </div>
  );
}

export default App;
