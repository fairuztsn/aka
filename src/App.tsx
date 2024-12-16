import { useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

import './App.css'
import Tree from "./components/Tree"

function App() {
  const [inputSize, setInputSize] = useState(0)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputSizeValue = event.target.value;
    setInputSize(parseFloat(inputSizeValue) || 0);
  };

  return (
    <>
      <div className="card">
        <p>n={inputSize}</p>
        <TextField id="filled-basic" label="Input size (n)" variant="outlined" type='number' onChange={handleChange}/>
      </div>
      <div>
        <Tree inputSize={inputSize}></Tree>
      </div>
    </>
  )
}

export default App
