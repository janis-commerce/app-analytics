# @janiscommerce/app-analytics

![janis-logo](brand-logo.png)

Library of methods to send information to firebase.



## Firebase setting

Before getting started, you should have set up a [new firebase project](https://console.firebase.google.com/).

If you already have it set up, the next step to do would be to add the google-services.json file to the root directory of your module (/android/app).

### Add the firebase sdk

For the Firebase SDKs to be able to access the google-services.json configuration values, you need the Google Services Gradle plugin.

Add the plugin as a dependency to your project-level build.gradle file: (android/build.gradle)

```javascript
dependencies {
        // ...
        classpath 'com.google.gms:google-services:4.3.15'
    } 
```

Additionally, should add google services plugins in **android/app/build.gradle** and any Firebase SDKs you want to use in your app:

```javascript
plugins {
  // ...

  // Add the Google services Gradle plugin
  id("com.google.gms.google-services")
}

dependencies {
  // Import the Firebase BoM
  implementation platform('com.google.firebase:firebase-bom:32.2.2')


  // TODO: Add the dependencies for Firebase products you want to use
  // When using the BoM, don't specify versions in Firebase dependencies
  implementation 'com.google.firebase:firebase-analytics'


  // Add the dependencies for any other desired Firebase products
  // https://firebase.google.com/docs/android/setup#available-libraries
}

```

### Clean the project

```sh
cd android && ./gradlew clean && cd ..
```


## PeerDependencies Installation

For the methods of this library to work, the following dependencies must be installed:

```sh
npm install @react-native-firebase/app
```
The @react-native-firebase/app module must be installed before using any other Firebase service.

Additionally, you need to install the dependency of the firebase service you want to use. 
For example this:

```sh
npm install @react-native-firebase/analytics
```
This dependency will allow that, when executing the methods of the package, these can be registered as events in firebase

## Installation

```sh
npm install @janis-commerce/app-analytics
```


## Usage


To use the methods associated with, for example, analytics you must import them as follows:

```javascript
import {logOutEvent} from '@janiscommerce/app-analytics'

//...

<Button onPress={logOutEvent}>

```