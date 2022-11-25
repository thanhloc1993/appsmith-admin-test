package helpers

import (
	"fmt"
	"os"
	"testing"
)

func TestChecksum(t *testing.T) {
	// Given
	dir, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
	}

	filepath := fmt.Sprintf("%s/%s", dir, "checksum_test.txt")
	expectSha256Sum := "9ed7c6b817df401e74c8cfd28e4ed0f719879c0d9c77989973f4d60191b7e875"

	// When
	result := Checksum(filepath, expectSha256Sum)
	
	// Then
	if !result {
		t.Fatal("the sha256sum doesn't match")
	}

}
