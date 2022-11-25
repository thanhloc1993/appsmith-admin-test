# Flutter Mobile Appium
## Setting up Environment
### 1. Android
- Installing
  - CI
    - Docker image
    - cmd tool to create Android Emulator 

  - Developer
    - Docker image
    - <https://developer.android.com/studio>

- Creating Emulator
  - By [command line](https://developer.android.com/studio/command-line/avdmanager#commands_and_command_options)
  
  - By [Android Studio](https://developer.android.com/studio/run/managing-avds)

  - Creating an Emulator 
  with name is `Android 11` and API is `30`
  to verify the setup

### 2. IOS (only MacOS)
- Installing
  - Open App Store, 
    search XCode and install.

- Creating Simulator
  - Default Simulators
    `xcrun simctl list` 
  
  - Using command line:
    `xcrun simctl create -h` for more detail

  - Can use default simulators
    to verify the setup

### 3. Flutter
- Installing
  - CI
    - Docker image

  - Developer
    - Docker image
    - <https://flutter.dev/docs/get-started/install>


### 4. Appium
- Document
  - [Getting Started](https://appium.io/docs/en/about-appium/getting-started/?lang=en)

- Installing
  1. `npm install -g appium@next`
  2. `appium driver install xcuitest`
  3. `appium driver install uiautomator2`
  4. `appium plugin install --source=npm @appium/relaxed-caps-plugin`

## Verifying the Setup
1. Verifying the Installation
    `appium-doctor`

2. Starting Appium 
   - Android: `appium server -p 4701 --base-path /wd/hub --plugins=relaxed-caps`
   - iOS: `appium server -p 4801 --base-path /wd/hub --plugins=relaxed-caps`

3. Starting FA service (for Android)
    `node flutter-attach-service.js`

4. Starting Emulator or Simulator
   - Android Emulator
     - `flutter emulator --launch Android_11`
   - iOS Simulator (only MacOS)
      1. `xcrun simctl list`
      to get DEVICE_ID of iPhone 11

      2. `xcrun simctl boot DEVICE_ID`

5. Build a Learner application
   - Android: `make build-learner-e2e-android LEARNER_FLAVOR=manabie_learner_staging`
   - iOS: `make build-learner-e2e-ios LEARNER_FLAVOR=manabie_learner_staging`

6. Run learner login demo in Eibanam
   - Android: `HOST_PROJECT_PATH=$(cd $(dirname cucumber.js) && echo ${PWD}) make run-learner-login-demo PLATFORM=ANDROID`
   - iOS: `HOST_PROJECT_PATH=$(cd $(dirname cucumber.js) && echo ${PWD}) make run-learner-login-demo PLATFORM=IOS`

## Setting up for parallel (self-hosted) - (Working)
1. Creating Emulator and Simulator
   - Creating emulators 
    with Android version
       - Android 11
       - Android 10
       - Android 9
       - Android 8
  
   - Creating simulators 
    with iOS version
       - iOS 14.x
       - iOS 13.x
       - iOS 12.x
       - iOS 11.x

2. Starting appium
   - LinuxOS and MacOS for Android
     `appium -p 47xx`
   - MacOS for iOS
     `appium -p 48xx`
   - Example:
     If we have 4 emulators,
     We will start:
     - `appium -p 4701`
     - `appium -p 4702`
     - `appium -p 4703`
     - `appium -p 4704`

3. Running e2e tests to verify
   1. Run tests with one worker
   2. Run tests with two workers
   3. Verifying by comparing runtime of step 1 and step 2