import React, { useEffect, useState } from 'react';
import {
  Text,
  Button,
} from 'react-native';

const App: () => React$Node = () => {

  const onPressToNotify = () => {
    PushNotification.localNotification({

      title: "My Notification Title", // (optional)
      message: "My Notification Message", // (required)

    });
  }
  const onPressToNotify2 = () => {
    PushNotification.localNotificationSchedule({
      message: "My Notification Message", 
      date: new Date(Date.now() + 4 * 1000), // in 6 sec
      allowWhileIdle: true, 
      repeatType: "day"
    });
  }

  useEffect(() => {
    PushNotificationIOS.addEventListener('notification', onRemoteNotification);

  });

  const onRemoteNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
      // Navigate user to another screen
    } else {
      // Do something else with push notification
    }
  };
  return (
    <>
      <Text style={{ marginTop: 100 }}>Chose You would like to </Text>
      <Button title="Notify me !" onPress={() => onPressToNotify()}></Button>
      <Button title="Notify me after 3 sec !" onPress={() => onPressToNotify2()}></Button>
    </>
  );
};


import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

export default App;
