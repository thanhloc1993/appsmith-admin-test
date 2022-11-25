# Appium device manager plugin

- This plugin manages the emulator lifecycle for creating, launching, shutting down, and deleting.
- This plugin must work with <https://github.com/AppiumTestDistribution/appium-device-farm>.

## How it works

- To create and launch emulators, the Device Manager needs to check the session and status device information on the Device Farm.
![getting_sessions_and_statuses](https://www.plantuml.com/plantuml/png/RP2n3i8m34HtVyM9dHzWG0nLcSh07mHgm5ARXDWfukyneg9B5m_dTwUp3sgXM1q7Ch61SMGpYNSegqgAYX1xE6FL5QI8XYUvCjfGHgBiNhbA3j6mcJTTYE7EPOEWQBfLv6l-xLkY8QMCMoeySQ6cmtRlykvV9EGiTLpwdFbPMOsQ5jilskrmgkE52z9jeIJ2iSgEQtQ1QIMw_xNvNxSIFHSUH0qliGSkLT-pOydcs1CTVFeVFm00 "getting_sessions_and_statuses")

- After getting information from Device Farm, Device manager will create then launch emulators.
![creating_launching_workflow](https://www.plantuml.com/plantuml/png/VP71ReCm38RlUGeVGNi3aDPEcxOTTjgbPmjCiHOIb3YWlVrC2grGg-KK-__yntQEKJ186gmH5alm6WY5tHdGjV25oJNz4iq-_7JMpyPatbGV91cB52Dx5pElcYJDW7VmHXCt1EyOXje46jMsWa-bx596aOTaKNpO76h37HGZkNRHNyQHqt1pVm9iX2Uw4vuteStlBUIzTpoK83qvA7ufbiQ0dkewgIeF-ybOfuC_ubUwlcYtHUt5gmNW6TdbSEvPzroSUXJWk2jO5wZTgb0uBs2pCRLbBjNbhDNxVFLDWv_-csMXMX9i-iteCjbHR_hvVm00 "creating_launching_workflow")

## How to install

- Prerequisite:
  - Install Appium 2.0: `npm install -g appium@next`

- Build: `npm install && npm run build`
- Installing plugin:
  - Uninstall old version: `appium plugin uninstall appium-device-manager || true`
  - Install new version: `appium plugin install --source=local $PWD`
