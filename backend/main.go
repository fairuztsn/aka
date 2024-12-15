package main

import (
	"aka/tree"
	"fmt"
	"time"
)

func main() {
	var root *tree.Node = tree.CreateNewNode(1)

	for i := 0; i < 1000; i++ {
		node := tree.CreateNewNode(i)
		tree.InsertNode(&root, node)
	}

	start := time.Now()
	temp := tree.FindNodeIteratively(root, 9999)
	elapsed := time.Since(start)

	if temp != nil {
		fmt.Println("Found bro")
	} else {
		fmt.Println("Not found bro")
	}
	// Cetak waktu eksekusi dalam milidetik
	fmt.Printf("Execution time: %.3f milliseconds\n", float64(elapsed)/float64(time.Millisecond))

	// Cetak waktu eksekusi dalam nanodetik
	fmt.Printf("Execution time: %d nanoseconds\n", elapsed.Nanoseconds())
}
