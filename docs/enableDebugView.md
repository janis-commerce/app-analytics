# Enable Firebase debugView Events in React native

## What is debugView?

DebugView allows you to view raw event data logged by your app on development devices in near real time.
To use DebugView, you must enable debugging mode.

## How to enable it?

To enable it, you must execute this command in the console:

```sh
adb shell setprop debug.firebase.analytics.app <package_name>
```
You must replace package_name with the name of the app you want to debug. This should be listed in your google-services.json file

## where can you see it?

1. Go to your google firebase console
2. Open the analytics tab
3. Go to debugView