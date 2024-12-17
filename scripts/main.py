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
    
    num_to_insert = list(range(1, n + 1))
    num_to_insert.remove(x)  
    random.shuffle(num_to_insert)  

    
    bst = BST()
    for num in num_to_insert:
        bst.insert(num)

    bst.insert(x)

    depth, farthest_node = bst.find_depth_and_farthest()
    return bst, depth, farthest_node

# const insertRandom = timer(function (root: Node | null, n: number): Node | null {
#     if (n <= 0) return null;

#     const values = Array.from({ length: n }, (_, i) => i + 1);

#     for (let i = values.length - 1; i > 0; i--) {
#         const j = Math.floor(Math.random() * (i + 1));
#         [values[i], values[j]] = [values[j], values[i]];
#     }

#     for (const value of values) {
#         root = insertNode(root, value);
#     }
#     return root;
# });

n = int(input("Input size: "))
x = int(input("Enter value to search (x): "))
bst, depth, farthest_node = ensure_x_is_deepest(n, x)

bst.print_by_depth()