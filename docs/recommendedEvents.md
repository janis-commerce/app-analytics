# Recommended Events by google Analytics

An event allows to measure an interaction in the context of the application.

Analytics has a group of predefined methods that are used to log events with a specific name and data.

### For example...

Events that are not tied to a specific type of business or product:

| Event        | Trigger when a user...|
| ------------- |:------------------:| 
| tutorial_begin    | begins a tutorial during an on-boarding process |
| tutorial_complete  | completes a tutorial during an on-boarding process    |
| sign_up | signs up for an account on your website or app   |



To register any of these events, the way to do it with the package is as follows

```javascript
import {recommendedEvents} from '@janiscommerce/app-analytics'

// ...

const finishTutorial () => {
    recommendedEvents().logTutorialComplete()
    navigate('HomePage')
}

<Button onPress={finishTutorial} />

```

Additionally, analytics provides a group of methods for more specific events and associated with particular cases that could be useful depending on the case.

On this page you can see a [list of all the recommended events](https://support.google.com/analytics/answer/9267735?sjid=16729563816445339920-SA) that Google Analytics has