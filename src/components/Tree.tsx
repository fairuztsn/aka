import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as TreeUtils from "../utils/tree"
import timer from "../utils/timer";

type TreeProps = {
  inputSize: number;
  ensureWorst: boolean;
  nodeToFind: number;
};

const executeWithTimer = (root: TreeUtils.Node | null, nodeToFind: number) => {
  const recursiveSearch = timer(TreeUtils.findNodeRecursively);
  const iterativeSearch = timer(TreeUtils.findNodeIteratively);

  const recursiveResult = recursiveSearch(root, nodeToFind);
  const iterativeResult = iterativeSearch(root, nodeToFind);

  return {
    recursive: recursiveResult.time,
    iterative: iterativeResult.time,
  };
};

const Tree: React.FC<TreeProps> = ({ inputSize, ensureWorst, nodeToFind }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [execTime, setExecTime] = useState<TreeUtils.ExecutionTimes>({ recursive: 0, iterative: 0 });

  useEffect(() => {
    let root: TreeUtils.Node | null = null;
    root = ensureWorst ? TreeUtils.ensureXIsDeepest(root, inputSize, nodeToFind) : TreeUtils.insertRandom(root, inputSize, nodeToFind);
    const treeData = TreeUtils.convertToTreeObject(root);

    setExecTime(executeWithTimer(root, nodeToFind));

    const width = svgRef.current ? svgRef.current.clientWidth : 600; 
    const height = svgRef.current ? svgRef.current.clientHeight : 400; 
    
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 90, bottom: 30, left: 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const treeLayout = d3.tree<TreeUtils.TreeObject>().size([innerHeight, innerWidth]);
    const rootHierarchy = d3.hierarchy(treeData);

    treeLayout(rootHierarchy);

    g.selectAll(".link")
      .data(rootHierarchy.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-width", 1.5)
      .attr(
      "d",
      // @ts-ignore
      d3.linkHorizontal()
        // @ts-ignore
        .x((d: { source: any; target: any; index: number }) => d.y)
        // @ts-ignore
        .y((d: { source: any; target: any; index: number }) => d.x)
    );

    
    const nodes = g
      .selectAll(".node")
      .data(rootHierarchy.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`);

    nodes
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d: any) => (d.children ? "#555" : "#999"));

    nodes
      .append("text")
      .attr("dy", 3)
      .attr("x", (d: any) => (d.children ? -10 : 10))
      .style("text-anchor", (d: any) => (d.children ? "end" : "start"))
      .text((d: any) => d.data.name);

    return () => {
      svg.selectAll("*").remove(); 
    };
  }, [inputSize, ensureWorst, nodeToFind]); 

  return <>
    <svg ref={svgRef}></svg> 
    <p>Recursive: {`${execTime.recursive}`}ms</p>
    <p>Iterative: {`${execTime.iterative}`}ms</p>
  </>;
};

export default Tree;