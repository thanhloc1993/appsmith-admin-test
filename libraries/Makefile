install-plugins:
	cd flutter-driver-x-js && npm run build && cd ..
	cd appium-flutter-driver-x-plugin && npm run build && cd ..
	cd appium-device-manager-plugin && npm run build && cd ..

	appium plugin uninstall relaxed-caps || echo ignore
	appium plugin install --source=npm @appium/relaxed-caps-plugin
	appium plugin uninstall appium-flutter-driver-x || echo ignore
	appium plugin install --source=local appium-flutter-driver-x-plugin
	appium plugin uninstall appium-device-manager || echo ignore
	appium plugin install --source=local appium-device-manager-plugin

run-appium-server:
	ANDROID_SDK_ROOT=$(HOME)/AndroidSdkRoot ANDROID_HOME=$(HOME)/AndroidSdkRoot appium server -ka 800 --use-plugins=relaxed-caps,appium-device-manager,appium-flutter-driver-x  -pa /wd/hub --plugin-device-farm-platform=android