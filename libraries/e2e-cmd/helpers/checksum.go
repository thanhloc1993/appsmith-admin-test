package helpers

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"os"
)

func Checksum(filePath string, expectSha256Sum string) bool {
	f, err := os.Open(filePath)
	if err != nil {
		f.Close()
		fmt.Println(err)
		os.Exit(1)
	}
	defer f.Close()

	hash := sha256.New()
	if _, err := io.Copy(hash, f); err != nil {
		f.Close()
		fmt.Println(err)
		os.Exit(1)
	}

	hashString := hex.EncodeToString(hash.Sum(nil))

	return expectSha256Sum == hashString
}
