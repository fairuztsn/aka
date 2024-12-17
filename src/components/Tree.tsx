import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

class Node {
    data: number;
    left: Node | null;
    right: Node | null;

    constructor(data: number) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

function insertNode(root: Node | null, data: number): Node {
    if (root === null) {
        return new Node(data);
    } else if (data < root.data) {
        root.left = insertNode(root.left, data);
    } else {
        root.right = insertNode(root.right, data);
    }
    return root;
}

function timer<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => ReturnType<T> {
    return function (...args: Parameters<T>): ReturnType<T> {
        const startTime = Date.now();
        const result = func(...args);
        const endTime = Date.now();
        const elapsedTime = (endTime - startTime) / 1000;
        console.log(`Function '${func.name}' executed in ${elapsedTime.toFixed(4)} seconds`);
        return result;
    };
}

const insertRandom = timer(function (root: Node | null, n: number): Node | null {
    if (n <= 0) return null;

    const values = Array.from({ length: n }, (_, i) => i + 1);

    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }

    for (const value of values) {
        root = insertNode(root, value);
    }
    return root;
});

function ensureXIsDeepest(root: Node | null, n: number, x: number): Node | null {
  const numToInsert = Array.from({length: n}, (_, i) => i + 1).filter(num => num !== x);
  numToInsert.sort(() => Math.random() - 0.5);

  numToInsert.forEach(num => {
    root = insertNode(root, num);
  });

  root = insertNode(root, x);
  return root;
}

type TreeObject = {
    name: number | string;
    children?: TreeObject[]
}

function convert(root: Node | null): TreeObject {
    if(root == null) {
        return {name: "Empty"}
    }

    const result: TreeObject = {
        name: root.data,
    }

    const children: TreeObject[] = [];

    if(root.left) {
        children.push(convert(root.left))
    }

    if(root.right) {
        children.push(convert(root.right))
    }

    if(children.length > 0) {
        result.children = children
    }

    return result
}

type TreeProps = {
  inputSize: number;
  ensureWorst: boolean;
  nodeToFind: number;
};

const Tree: React.FC<TreeProps> = ({ inputSize, ensureWorst, nodeToFind }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 600, height: 400 }); 

  useEffect(() => {
    let root: Node | null = null;
    root = ensureWorst ? ensureXIsDeepest(root, inputSize, nodeToFind) : insertRandom(root, inputSize);
    const treeData = convert(root);
    
    const width = svgRef.current ? svgRef.current.clientWidth : 600; 
    const height = svgRef.current ? svgRef.current.clientHeight : 400; 

    setSvgDimensions({ width, height }); 
    
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

    const treeLayout = d3.tree<TreeObject>().size([innerHeight, innerWidth]);
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
        d3
          .linkHorizontal()
          .x((d: any) => d.y)
          .y((d: any) => d.x)
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

  return <svg ref={svgRef}></svg>;
};

export default Tree;