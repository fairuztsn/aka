import random
from collections import deque, defaultdict

class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, value):
        if self.root is None:
            self.root = TreeNode(value)
        else:
            self._insert_recursive(self.root, value)

    def _insert_recursive(self, node, value):
        if value < node.value:
            if node.left is None:
                node.left = TreeNode(value)
            else:
                self._insert_recursive(node.left, value)
        else:
            if node.right is None:
                node.right = TreeNode(value)
            else:
                self._insert_recursive(node.right, value)

    def find_depth_and_farthest(self):
        
        def dfs(node, depth):
            if node is None:
                return depth - 1, None
            left_depth, left_node = dfs(node.left, depth + 1)
            right_depth, right_node = dfs(node.right, depth + 1)
            if left_depth > right_depth:
                return left_depth, left_node or node
            else:
                return right_depth, right_node or node

        return dfs(self.root, 0)
    
    def print_by_depth(self):
        if not self.root:
            print("Tree is empty.")
            return

        
        queue = deque([(self.root, 0)])  
        levels = defaultdict(list)  

        while queue:
            node, depth = queue.popleft()
            levels[depth].append(node.value)

            if node.left:
                queue.append((node.left, depth + 1))
            if node.right:
                queue.append((node.right, depth + 1))

        
        for depth, nodes in levels.items():
            print(f"Depth {depth}: {nodes}")

def ensure_x_is_deepest(n, x):
    # Create a list of numbers to insert, ensuring the root is chosen
    # in a way that makes x the deepest node
    if n > 1:
        root_value = n if max(n-x, x-1) == n-x else 1
    else:
        root_value = 1
    
    # Create a list of numbers to insert
    num_to_insert = list(range(n, 0, -1)) if root_value == n else list(range(1, n+1))
    
    # Remove `x` from the list to insert it last
    num_to_insert.remove(x)
    
    # Create a new BST and insert numbers except `x`
    bst = BST()
    for num in num_to_insert:
        bst.insert(num)

    # Insert `x` last, ensuring it is placed in the deepest position
    bst.insert(x)

    # Calculate the depth of the tree and the farthest node
    depth, farthest_node = bst.find_depth_and_farthest()
    
    return bst, depth, farthest_node


n = int(input("n: "))
x = int(input("x: "))
bst, depth, farthest_node = ensure_x_is_deepest(n, x)

bst.print_by_depth()