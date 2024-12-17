import React, { useState, useRef, useEffect, ReactElement } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

import './App.css'
import Tree from "./components/Tree"

function App() {
  const [inputSize, setInputSize] = useState(0)
  const [nodeToFind, setNodeToFind] = useState(0);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [inputNodeErr, setInputNodeErr] = useState<string>("");
  const [tree, setTree] = useState<ReactElement>();

  const handleInputSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputSizeValue = event.target.value;
    setInputSize(parseFloat(inputSizeValue) || 0);
  };

  const handleNodeToFindChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nodeValue = parseInt(event.target.value);
    if(nodeValue > 0 && nodeValue <= inputSize) {
      setInputNodeErr("");
      setNodeToFind(nodeValue);
    }else{
      setInputNodeErr(`Must larger than 0 and less or equal than ${inputSize}`);
      setNodeToFind(0);
    }
  }

  // const handleTreeParamChange = () => {
  //   if (nodeToFind > 0 && nodeToFind <= inputSize) {
  //     setTreeParams({ inputSize, nodeToFind });
  //   } else {
  //     alert("Please fix the errors before generating the tree.");
  //   }
  // }

  // useEffect(() => {
  //   if (treeRef.current) {
  //     const { width, height } = treeRef.current.getBoundingClientRect();
  //     setTreeDimensions({ width, height });
  //   }
  // }, [treeParams]);

  const handleGenerateTree = () => {
    setTree(<div className="tree-section">
        <div className="tree-container">
          <div className="tree-card">
            <h2>Best Case</h2>      
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

  return (
    <>
      <div className="app-container">
      <div className="input-section">
        <p>n = {inputSize}</p>
        <div className="input-fields">
          <TextField
            id="input-size"
            label="Input size (n)"
            variant="outlined"
            type="number"
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
          <Button variant="contained" onClick={handleGenerateTree}>
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
