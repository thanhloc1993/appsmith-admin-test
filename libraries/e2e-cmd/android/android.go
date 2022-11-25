package android

import (
	"fmt"
	"log"
	helpers "manabie/e2e-cmd/helpers"
	"os"
	"os/exec"
	"runtime"
	"strings"

	"github.com/evilsocket/islazy/zip"
)

func InstallAndroidCommandLineTools() {
	androidSdkRootDir := getAndroidSdkRoot()
	fileName, sha256Sum := getAndroidCommandLineToolsInfo()
	url := fmt.Sprintf("https://dl.google.com/android/repository/%s", fileName)
	helpers.DownloadFile(androidSdkRootDir, url, sha256Sum)
	_, err := zip.Unzip(fmt.Sprintf("%s/%s", androidSdkRootDir, fileName), fmt.Sprintf("%s/cmdline-tools", androidSdkRootDir))
	if err != nil {
		log.Fatal(err)
	}
	rmCmd := exec.Command("rm", "-r", fmt.Sprintf("%s/cmdline-tools/tools", androidSdkRootDir))
	rmCmd.Run()

	mvCmd := exec.Command("mv", fmt.Sprintf("%s/cmdline-tools/cmdline-tools", androidSdkRootDir), fmt.Sprintf("%s/cmdline-tools/tools", androidSdkRootDir))
	mvCmdErr := mvCmd.Run()
	if mvCmdErr != nil {
		fmt.Println("error")
		log.Fatal(err)
	}
}

func getAndroidCommandLineToolsInfo() (fileName, sha256Sum string) {
	goos := runtime.GOOS
	switch goos {
	case "darwin":
		fileName = "commandlinetools-mac-8092744_latest.zip"
		sha256Sum = "1de25523d595198d29666f9976eed65d99bbc5e4a3e8e48e5d6c98bb7e9030cc"
	case "linux":
		fileName = "commandlinetools-linux-8092744_latest.zip"
		sha256Sum = "d71f75333d79c9c6ef5c39d3456c6c58c613de30e6a751ea0dbd433e8f8b9cbf"
	default:
		fmt.Printf("Don't support %s.\n", goos)
		os.Exit(1)
	}
	return
}

func InstallAndroidBuildTools() {
	sdkManagerInstall("build-tools;33.0.0-rc1")
}

func InstallAndroidPlatformTools() {
	sdkManagerInstall("platform-tools")
}

func InstallAndroidPlatforms() {
	sdkManagerInstall("platforms;android-30")
}

func InstallAndroidSystemImages() {
	sdkManagerInstall("system-images;android-30;google_apis;x86")
}

func sdkManagerInstall(_package string) {
	call := func() {
		androidSdkRootDir := getAndroidSdkRoot()
		arg0 := fmt.Sprintf("%s/cmdline-tools/tools/bin/sdkmanager", androidSdkRootDir)
		arg1 := _package
		arg2 := fmt.Sprintf("--sdk_root=%s", androidSdkRootDir)

		cmd := exec.Command(arg0, arg1, arg2)
		cmd.Stdin = strings.NewReader("y")
		err := cmd.Run()
		if err != nil {
			log.Fatal(err)
		}
	}
	call()
	call()
}

func getAndroidSdkRoot() string {
	dirname, err := os.UserHomeDir()
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
	return dirname + "/AndroidSdkRoot"
}
