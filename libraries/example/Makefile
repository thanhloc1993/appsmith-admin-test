build-android:
	cd flutter_application && flutter build apk --profile
	mv flutter_application/build/app/outputs/flutter-apk/app-profile.apk flutter-driver-x-test


build-ios:
	cd flutter_application && flutter build ios --simulator
	mv flutter_application/build/ios/iphonesimulator/Runner.app flutter-driver-x-test/

run-web:
	cd flutter_application && flutter run -d web-server --release --web-port=8080

android-test:
	cd flutter-driver-x-test && APP=${PWD}/flutter-driver-x-test/app-profile.apk  PLATFORM=android npm run appium

ios-test:
	cd flutter-driver-x-test && APP=${PWD}/flutter-driver-x-test/Runner.app  PLATFORM=ios npm run appium

web-test:
	cd flutter-driver-x-test && URL=localhost:8080 PLATFORM=web npm run appium