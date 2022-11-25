# Document for using Appium Flutter driver X

## Prerequisite

- Installing:

  1. Appium 2.0
  2. Run `make install plugins`

- Running appium server:
  - `make run-appium-server`

- Running the example:
  1. Navigating terminal to `eibanam/libraries/example`
  2. Running the counter test:
     - Android:
       1. `make build-android`
       2. `make android-test`
     - iOS:
       1. `make build-ios`
       2. `make ios-test`
     - Web:
       1. `make run-web`
       2. `make web-test`
