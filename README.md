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

## Modules

<dl>
<dt><a href="#module_initialize">initialize</a></dt>
<dd><p>This method is responsible for initializing the analytics class and obtaining the user information to build the instance;</p>
</dd>
<dt><a href="#module_sendUserInfo">sendUserInfo</a></dt>
<dd><p>send userInfo Event to analytics console with user, app and device data.</p>
</dd>
<dt><a href="#module_sendAction">sendAction</a></dt>
<dd><p>send an action log to analytics console</p>
</dd>
<dt><a href="#module_sendCustomEvent">sendCustomEvent</a></dt>
<dd><p>send a new customEvent to analytics console</p>
</dd>
<dt><a href="#module_sendScreenTracking">sendScreenTracking</a></dt>
<dd><p>send a screenViewEvent to analytics console to record the screens the user visits</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#Analytics">Analytics</a></dt>
<dd><p>This class is responsible for handling events to record user information, actions and custom events</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#actionEvent">actionEvent(params)</a> ⇒ <code>boolean</code></dt>
<dd><p>is responsible for registering an event that reports the execution of an action by the user. Not use the camelCase format, since the function transforms the strings to lowercase. Instead write with spaces, as they will later be replaced by underscores</p>
</dd>
<dt><a href="#customEvent">customEvent(eventName, params)</a> ⇒ <code>boolean</code></dt>
<dd><p>allows to register a custom event, receives the name of the event to be registered and the associated data</p>
</dd>
<dt><a href="#screenViewEvent">screenViewEvent(screenName, screenClass)</a> ⇒ <code>boolean</code></dt>
<dd><p>logs an event with information from the screen the user is viewing</p>
</dd>
<dt><a href="#userInfoEvent">userInfoEvent(params)</a> ⇒ <code>boolean</code></dt>
<dd><p>is responsible for registering an event that reports all data of user, device and app</p>
</dd>
</dl>

<a name="module_initialize"></a>

## initialize
This method is responsible for initializing the analytics class and obtaining the user information to build the instance;


| Param | Type | Description |
| --- | --- | --- |
| appVersion | <code>string</code> | a string that represents the version number of the app |

**Example**  
```js
const analyticsInstance = await Analytics.initialize('1.22.0.0')
```
<a name="module_sendUserInfo"></a>

## sendUserInfo
send userInfo Event to analytics console with user, app and device data.

<a name="module_sendAction"></a>

## sendAction
send an action log to analytics console


| Param | Type | Description |
| --- | --- | --- |
| actionName | <code>string</code> | is the name of the action the user completed |
| screenName | <code>string</code> | is the name of the screen where the action was called |
| params | <code>object</code> | An object with any additional information you would like to register for the event |

<a name="module_sendCustomEvent"></a>

## sendCustomEvent
send a new customEvent to analytics console


| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | is the name that will be received the event logged |
| params | <code>object</code> | An object with any additional information you would like to register for the event |

<a name="module_sendScreenTracking"></a>

## sendScreenTracking
send a screenViewEvent to analytics console to record the screens the user visits


| Param | Type | Description |
| --- | --- | --- |
| screenName | <code>string</code> | Screen name the user is currently viewing. |
| screenClass | <code>string</code> | Current class associated with the view the user is currently viewing. |

<a name="Analytics"></a>

## Analytics
This class is responsible for handling events to record user information, actions and custom events

**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | an object that contains all the information regarding the user that you want to add as initial information. This will then be used based on the need of each event. |

<a name="actionEvent"></a>

## actionEvent(params) ⇒ <code>boolean</code>
is responsible for registering an event that reports the execution of an action by the user. Not use the camelCase format, since the function transforms the strings to lowercase. Instead write with spaces, as they will later be replaced by underscores

**Kind**: global function  
**Throws**:

- an error when not pass valid params or any of the required parameters are missing


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | data set to send |
| params.actionName | <code>string</code> | name of the action that will be registered |
| params.client | <code>string</code> | janis operating client |
| params.userEmail | <code>string</code> | janis registered user email |
| params.userId | <code>string</code> | registered user id |
| params.appVersion | <code>string</code> | app version in use |
| params.screenName | <code>string</code> | screen where the action was called |
| params.anotherKey... | <code>string</code> | any extra data that you want to be sent will be cataloged as dataEvent |

**Example**  
```js
import {actionEvent} from '@janiscommerce/app-analytics'

actionEvent({actionName:'button press',client: 'client',userEmail: 'janis@janis.im',userId:'123456',appVersion:'1.20.0'})
```
<a name="customEvent"></a>

## customEvent(eventName, params) ⇒ <code>boolean</code>
allows to register a custom event, receives the name of the event to be registered and the associated data

**Kind**: global function  
**Throws**:

- an error when some required params is not passed


| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of the event that we are going to register |
| params | <code>object</code> | event parameters, information that we are going to send |
| params.client | <code>string</code> | janis operating client |
| params.userEmail | <code>string</code> | janis registered user email |
| params.userId | <code>string</code> | registered user id |
| params.appVersion | <code>string</code> | app version in use |
| params.anotherKey... | <code>string</code> | any extra data that you want to be sent will be cataloged as dataEvent |

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
