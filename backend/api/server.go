// api/server.go
package api

import (
	"fmt"
	"log"
	"net/http"
)

func StartServer() {
	http.HandleFunc("/create-node", CreateNodeHandler)
	http.HandleFunc("/get-root", GetRootHandler)

	fmt.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
