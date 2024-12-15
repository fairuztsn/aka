package tree

import "fmt"

type Node struct {
	Data  int
	Left  *Node
	Right *Node
}

func CreateNewNode(data int) *Node {
	return &Node{
		Data:  data,
		Left:  nil,
		Right: nil,
	}
}

func FindNodeRecursively(root *Node, x int) *Node {
	if root == nil || root.Data == x {
		return root
	} else if x < root.Data {
		return FindNodeRecursively(root.Left, x)
	}

	return FindNodeRecursively(root.Right, x)
}

func FindNodeIteratively(root *Node, x int) *Node {
	current := root

	for current != nil {
		if x == current.Data {
			return current
		} else if x < current.Data {
			current = current.Left
		} else {
			current = current.Right
		}
	}

	return nil
}

func PrintPreOrder(root *Node) {
	if root != nil {
		fmt.Print(root.Data, " ")
		PrintPreOrder(root.Left)
		PrintPreOrder(root.Right)
	}
}

func InsertNode(root **Node, p *Node) {
	if *root == nil {
		*root = p
	} else if p.Data < (*root).Data {
		InsertNode(&(*root).Left, p)
	} else if p.Data > (*root).Data {
		InsertNode(&(*root).Right, p)
	}
}

func GetRoot() *Node {
	return nil
}
