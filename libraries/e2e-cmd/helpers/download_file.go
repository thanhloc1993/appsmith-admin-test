package helpers

import (
	"crypto/sha256"
	"encoding/hex"
	"os"

	grab "github.com/cavaliergopher/grab/v3"
)

func DownloadFile(outDir, url, sha256Sum string) {
	_ = os.Mkdir(outDir, os.ModePerm)

	req, err := grab.NewRequest(outDir, url)
	if err != nil {
		panic(err)
	}

	// set request checksum
	sum, err := hex.DecodeString(sha256Sum)
	if err != nil {
		panic(err)
	}
	req.SetChecksum(sha256.New(), sum, true)

	// download and validate file
	resp := grab.DefaultClient.Do(req)
	if err := resp.Err(); err != nil {
		panic(err)
	}
}
