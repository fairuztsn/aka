export class Node {
    data: number;
    left: Node | null;
    right: Node | null;

    constructor(data: number) {
        this.data = data;
        this.left = null;
        this.right = null;
    }

    get children(): Node[] {
        const children: Node[] = [];
        if (this.left) children.push(this.left);
        if (this.right) children.push(this.right);
        return children;
    }
}

export type TreeObject = {
    name: number | string;
    children?: TreeObject[]
}

export type ExecutionTimes = {
  recursive: number;
  iterative: number;
};

export function contains(root: Node | null, target: number): boolean {

    if (root === null) {
        return false;
    }

    if (root.data === target) {
        return true;
    }

    return contains(root.left, target) || contains(root.right, target);
}

export function insertNode(root: Node | null, data: number): Node {
    if (root === null) {
        return new Node(data);
    } else if (data < root.data) {
        root.left = insertNode(root.left, data);
    } else {
        root.right = insertNode(root.right, data);
    }
    return root;
}

export const insertRandom = (root: Node | null, n: number, rootValue: number): Node | null => {
    if (n <= 0) return null;

    const values = Array.from({ length: n }, (_, i) => i + 1).filter(num => num !== rootValue);;

    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }

    root = insertNode(root, rootValue);

    for (const value of values) {
        root = insertNode(root, value);
    }
    return root;
};

function range(start: number, end: number, step: number = 1): number[] {
    const result: number[] = [];
    if (step > 0) {
        for (let i = start; i < end; i += step) {
            result.push(i);
        }
    } else {
        for (let i = start; i > end; i += step) {
            result.push(i);
        }
    }
    return result;
}

export const ensureXIsDeepest = (root: Node | null, n: number, x: number): Node | null => {
  let rootValue;
  
  if(n > 1) {
    rootValue = Math.max(n-x, x-1) == n-x ? n : 1;
  }else {
    // Maybe unnecessary
    rootValue = 1;
  }

  // const numToInsert = Array.from({length: n}, (_, i) => i + 1).filter(num => num !== x);
  // numToInsert.sort(() => Math.random() - 0.5);

  const numToInsert = ((rootValue === n) 
    ? range(n, 0, -1) 
    : range(1, n + 1)).filter(value => value !== x);

  numToInsert.forEach(num => {
    root = insertNode(root, num);
  });

  root = insertNode(root, x);
  return root;
};

export function convertToTreeObject(root: Node | null): TreeObject {
    if(root == null) {
        return {name: "Empty"}
    }

    const result: TreeObject = {
        name: root.data,
    }

    const children: TreeObject[] = [];

    if(root.left) {
        children.push(convertToTreeObject(root.left))
    }

    if(root.right) {
        children.push(convertToTreeObject(root.right))
    }

    if(children.length > 0) {
        result.children = children
    }

    return result
}

export function convertToNode(treeObject: TreeObject): Node | null {
  const rootNode = new Node(Number(treeObject.name));

  if(treeObject.children) {
    if(treeObject.children.length > 0) {
      rootNode.left = convertToNode(treeObject.children[0]);
    }

    if(treeObject.children.length > 1) {
      rootNode.right = convertToNode(treeObject.children[1]);
    }
  }

  return rootNode;
}

export function findNodeRecursively(root: Node | null, target: number): Node | null {
    if(root === null) {
        return null;
    }

    if(root.data === target) {
        return root;
    }

    const leftResult = findNodeRecursively(root.left, target);
    if(leftResult !== null) {
        return leftResult;
    }

    return findNodeRecursively(root.right, target);
}

export function findNodeIteratively(root: Node | null, target: number): Node | null {
    if(root === null) {
        return null;
    }

    const stack: Node[] = [root];

    while(stack.length > 0) {
        const currentNode = stack.pop();

        if(currentNode && currentNode.data === target) {
            return currentNode;
        }

        if(currentNode && currentNode.right) {
            stack.push(currentNode.right);
        }

        if(currentNode && currentNode.left) {
            stack.push(currentNode.left);
        }
    }

    return null;
}