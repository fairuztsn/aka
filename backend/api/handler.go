package api

import (
	"aka/tree"
	"encoding/json"
	"net/http"
)

func CreateNodeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var newNode tree.Node
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newNode)

	if err != nil {
		http.Error(w, "Error reading JSON body", http.StatusBadRequest)
		return
	}

	node := tree.CreateNewNode(newNode.Data)

	// if tree.GetRoot() == nil {
	// 	tree.GetRoot() = node
	// }

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(node)
}

func GetRootHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	root := tree.GetRoot()
	if root == nil {
		http.Error(w, "No root node found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(root)
}
