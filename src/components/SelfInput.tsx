import { Button, TextField } from "@mui/material";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tree from "./Tree";
import * as TreeUtils from "../utils/tree"
import timer from "../utils/timer";

const measureTimeExecutions = (root: TreeUtils.Node | null, nodeToFind: number): ReactElement => {
    let recursiveResult: {result: TreeUtils.Node | null, time: number} = { result: null, time: -1 };
    let iterativeResult: {result: TreeUtils.Node | null, time: number} = { result: null, time: -1 };

    const recursiveSearch = timer(TreeUtils.findNodeRecursively);
    const iterativeSearch = timer(TreeUtils.findNodeIteratively);

    try {
        recursiveResult = recursiveSearch(root, nodeToFind);
    } catch (error) {
        if (error instanceof RangeError) {
            console.error("Maximum recursion depth exceeded");
        } else {
            throw error;
        }
    }

    iterativeResult = iterativeSearch(root, nodeToFind);

    return (
        <>
            <p>Result (finding Node({nodeToFind})): {!recursiveResult.result || !iterativeResult.result ? "not found" : "found"}</p>
            <p>Recursive: {recursiveResult.time >= 0 ? `${recursiveResult.time}ns` : `Maximum recursion depth exceeded`}</p>
            <p>Iterative: {`${iterativeResult.time}ns`}</p>
        </>
    );
};

const SelfInput = () => {
    const navigate = useNavigate();

    const [root, setRoot] = useState<TreeUtils.Node | null>(null);
    const [tree, setTree] = useState<ReactElement | null>();

    const [nodeToFind, setNodeToFind] = useState<number | null>(null);
    const [inputNodeErr, setInputNodeErr] = useState<string>("");

    const [nodeSequence, setNodeSequence] = useState<number[]>([]);
    const [inputNodeSequenceErr, setInputNodeSequenceErr] = useState<string>("");

    const [executionResult, setExecutionResult] = useState<ReactElement | null>(null);

    const buttonRef = useRef<HTMLButtonElement>(null);
    
    const handleNodeToFindChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nodeValue = parseInt(event.target.value);
        setNodeToFind(nodeValue);
    };

    const handleInputNodesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numbers = (event.target.value)
                        .replace(/[^\d\s]/g, '')
                        .trim()  
                        .split(/\s+/)  
                        .map(num => parseInt(num))  
                        .filter(value => !isNaN(value));  

        setNodeSequence(numbers);
    };

    const findNode = () => {
        if(nodeSequence.length == 0) {
            setInputNodeSequenceErr(`Node sequence must not be empty.`);
            setNodeSequence([]);
        }else {
            setInputNodeSequenceErr("");
        }

        if(!nodeToFind) {
            setInputNodeErr(`Node to find must not be empty`);
            setNodeToFind(0);
        }else {
            setInputNodeErr("");
        }

        if(nodeSequence.length > 0 && nodeToFind) {
            setTree(
            <div className="tree-section">
                <div className="tree-container">
                <div className="tree-card">
                    <h2>Tree</h2>      
                    <Tree
                        inputSize={nodeSequence.length}
                        nodeToFind={nodeToFind}
                        ensureWorst={false}
                        nodeSequence={nodeSequence}
                        setRootFunction={setRoot}
                    />
                </div>
                </div>
            </div>
            );

            const result = measureTimeExecutions(root, nodeToFind!);
            setExecutionResult(result);
        }
    };

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

    return (
      <>
      <div className="app-container" >
      <div className="input-section">
        <p>n = {nodeSequence.length}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <TextField
              id="input-nodes"
              label="Input nodes"
              variant="outlined"
              type="text"
              error={inputNodeSequenceErr !== ""}
              helperText={inputNodeSequenceErr}
              placeholder="1 2 3 4 ... n"
              onChange={handleInputNodesChange}
              fullWidth
              multiline
            maxRows={4}
            />
            
            <TextField
              id="node-to-find"
              label="Node to find"
              variant="outlined"
              type="number"
              error={inputNodeErr !== ""}
              helperText={inputNodeErr}
              onChange={handleNodeToFindChange}
              fullWidth
            />
            
            <Button variant="contained" onClick={() => {
                findNode()
              }} 
              ref={buttonRef}>
              Find!
            </Button>
          </div>
        <br />
        <a href="#" onClick={(e) => {
          e.preventDefault();
          navigate("/");
          }}>
          Click here to input automatically ⚙️
        </a>
      </div>
      {tree}
      {executionResult && (
          <div className="execution-result">
              <h3>Execution Result</h3>
              {executionResult}
          </div>
      )}
    </div>
    </>
    );
};

export default SelfInput;