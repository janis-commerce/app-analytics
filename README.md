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
npm install @janiscommerce/app-analytics
```
## Usage

## Functions

<dl>
<dt><a href="#customEvent">customEvent(eventName, dataEvent)</a> ⇒ <code>boolean</code></dt>
<dd><p>allows to register a custom event, receives the name of the event to be registered and the associated data</p>
</dd>
<dt><a href="#screenViewEvent">screenViewEvent(screenName, screenClass)</a> ⇒ <code>boolean</code></dt>
<dd><p>logs an event with information from the screen the user is viewing</p>
</dd>
<dt><a href="#userInfoEvent">userInfoEvent(params)</a> ⇒ <code>boolean</code></dt>
<dd><p>is responsible for registering an event that reports all data of user, device and app</p>
</dd>
</dl>

<a name="customEvent"></a>

## customEvent(eventName, dataEvent) ⇒ <code>boolean</code>
allows to register a custom event, receives the name of the event to be registered and the associated data

**Kind**: global function  
**Throws**:

- an error when some required params is not passed


| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of the event that we are going to register |
| dataEvent | <code>object</code> | event parameters, information that we are going to send |

**Example**  
```js
import {customEvent} from '@janiscommerce/app-analytics'

customEvent('event_init',{date:"2011-10-05T14:48:00.000Z"})
```
<a name="screenViewEvent"></a>

## screenViewEvent(screenName, screenClass) ⇒ <code>boolean</code>
logs an event with information from the screen the user is viewing

**Kind**: global function  
**Throws**:

- an error when some required params is not passed


| Param | Type | Description |
| --- | --- | --- |
| screenName | <code>string</code> | Screen name the user is currently viewing. |
| screenClass | <code>string</code> | Current class associated with the view the user is currently viewing. |

**Example**  
```js
import {screenViewEvent} from '@janiscommerce/app-analytics'

screenViewEvent('home','class_home')
```
<a name="userInfoEvent"></a>

## userInfoEvent(params) ⇒ <code>boolean</code>
is responsible for registering an event that reports all data of user, device and app

**Kind**: global function  
**Throws**:

- an error when not pass valid params


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | data set to send |
| params.appName | <code>string</code> | name of the app in use |
| params.appVersion | <code>string</code> | app version in use |
| params.device | <code>string</code> | device model |
| params.os | <code>string</code> | operative system |
| params.osVersion | <code>string</code> | version of the model |
| params.userEmail | <code>string</code> | janis registered user email |
| params.userId | <code>string</code> | registered user id |
| params.client | <code>string</code> | janis operating client |
| params.language | <code>string</code> | language used in the application |

**Example**  
```js
import {userInfoEvent} from '@janiscommerce/app-analytics

userInfoEvent({appName:'app_name',appVersion:'1.0.0',device:'samsung a10',os:'android',osVersion:'10',userEmail:'user_name@janis.im',userId:'012345678910', client: 'janis'})
```
