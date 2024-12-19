import React, { useState, ReactElement, useRef, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

import './App.css'
import Tree from "./components/Tree"
import { ExecutionTimes } from './utils/tree';

function App() {
  const [inputSize, setInputSize] = useState(0);
  const [nodeToFind, setNodeToFind] = useState(0);
  const [inputNodeErr, setInputNodeErr] = useState<string>("");
  const [inputSizeErr, setInputSizeErr] = useState<string>("");
  const [tree, setTree] = useState<ReactElement | null>();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleInputSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputSizeValue = parseInt(event.target.value);
    if(inputSizeValue <= 0) {
      setInputSizeErr("Input size cannot be less than or equal to zero.")
    }else {
      setInputSizeErr("");
      setInputSize(inputSizeValue || 0);
    }
  };

  const handleNodeToFindChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nodeValue = parseInt(event.target.value);
    if(nodeValue > 0 && nodeValue <= inputSize) {
      setInputNodeErr("");
      setNodeToFind(nodeValue);
    }else {
      setInputNodeErr(`Node to find must larger than 0 and less or equal than ${inputSize}`);
      setNodeToFind(0);
    }
  }

  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && buttonRef.current) {
        buttonRef.current.click();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyPress);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyPress);
    };
  }, []);

  const handleGenerateTree = () => {
    if(!(nodeToFind > 0 && nodeToFind <= inputSize)) {
      setInputNodeErr(`Node to find must larger than 0 and less or equal than ${inputSize}`);
      setNodeToFind(0);
    }
    
    if(inputSize <= 0) {
      setInputSizeErr("Input size cannot be less than or equal to zero.")
    }

    if(inputSize > 0 && (nodeToFind >= 1 && nodeToFind <= inputSize)) {
      setTree(<div className="tree-section">
        <div className="tree-container">
          <div className="tree-card">
            <h2>Best Case (Example)</h2>      
              <Tree
                inputSize={inputSize}
                nodeToFind={nodeToFind}
                ensureWorst={false}
              />
              
          </div>
          <div className="tree-card">
            <h2>Worst Case</h2>     
              <Tree
                inputSize={inputSize}
                nodeToFind={nodeToFind}
                ensureWorst={true}
              />
          </div>
        </div>
      </div>);
    }
  }

  return (
    <>
      <div className="app-container" >
      <div className="input-section">
        <p>n = {inputSize}</p>
        <div className="input-fields">
          <TextField
            id="input-size"
            label="Input size (n)"
            variant="outlined"
            type="number"
            error={inputSizeErr !== ""}
            helperText={inputSizeErr}
            onChange={handleInputSizeChange}
          />
          <TextField
            id="node-to-find"
            label="Node to find"
            variant="outlined"
            type="number"
            onChange={handleNodeToFindChange}
            error={inputNodeErr !== ""}
            helperText={inputNodeErr}
          />
          <Button variant="contained" onClick={() => {handleGenerateTree()}} ref={buttonRef}>
            Generate
          </Button>
        </div>
        <a href="#" onClick={(e) => e.preventDefault()}>
          Click here to input manually
        </a>
      </div>
      {tree}
    </div>
    </>
  )
}

export default App
