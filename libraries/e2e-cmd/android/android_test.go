package android

import (
	"log"
	"os"
	"testing"
)

func TestInstallPrerequisitesAndroidTools(t *testing.T) {
	InstallAndroidCommandLineTools()
	toolsDir := getAndroidSdkRoot() + "/cmdline-tools/tools"
	checkExist(toolsDir + "/lib")
	checkExist(toolsDir + "/bin")
	checkExist(toolsDir + "/source.properties")
}

func TestInstallAndroidPlatformTools(t *testing.T) {
	InstallAndroidPlatformTools()
	checkExist(getAndroidSdkRoot() + "/platform-tools")
	checkExist(getAndroidSdkRoot() + "/licenses")
}

func TestInstallAndroidBuildTools(t *testing.T) {
	InstallAndroidBuildTools()
	checkExist(getAndroidSdkRoot() + "/build-tools")
}

func TestInstallAndroidSystemImages(t *testing.T) {
	InstallAndroidSystemImages()
	checkExist(getAndroidSdkRoot() + "/system-images")
	checkExist(getAndroidSdkRoot() + "/emulator")
	checkExist(getAndroidSdkRoot() + "/patcher")
}

func TestInstallAndroidPlatforms(t *testing.T) {
	InstallAndroidPlatforms()
	checkExist(getAndroidSdkRoot() + "/platforms")
}

func checkExist(path string) {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		log.Fatalln(err)
	}
}
