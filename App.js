import React, { useEffect, useState } from 'react';
import {
  Text,
  Button, Alert, TextInput
} from 'react-native';

import { TestIds, BannerAd, BannerAdSize } from '@react-native-firebase/admob';

import Clipboard from '@react-native-community/clipboard'

import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

const App: () => React$Node = () => {

  const [tokenIS, setTokenIS] = useState('a');

  function showNotification(notification) {
    PushNotification.localNotification({
      title: notification.title,
      message: notification.body
    });
  }

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

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

  useEffect(async () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('notification', onRemoteNotification);
    }
    firebase
      .messaging().getToken(firebase.app().options.messagingSenderId).then(x => {
        console.log(x)
        setTokenIS(x)
      })
      .catch(e => console.log(e));

    await firebase.messaging().registerDeviceForRemoteMessages();
    await firebase.messaging().requestPermission();

    firebase.messaging().onMessage(response => {
      console.log(JSON.stringify(response));
      if (Platform.OS === 'ios') {
        PushNotificationIOS.requestPermissions().then(
          showNotification(response.notification),
        );
      } else {
        showNotification(response.notification);
      }
    });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;

  }, []);

  const onRemoteNotification = (notification) => {
    console.log(notification)
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
      // Navigate user to another screen
    } else {
      // Do something else with push notification
    }
  };
  const clip = async (text) => {
    await Clipboard.setString(text)
    alert("Boom, Copied");
  }
  return (
    <>
      <Text style={{ marginTop: 100 }}>Chose You would like to </Text>
      {//tokenIS && <Text onPress={() => clip(tokenIS)} style={{ marginTop: 20 }}>{tokenIS}</Text>
      }
      {tokenIS && <TextInput></TextInput>}
      <Button title="Notify me !" onPress={() => onPressToNotify()}></Button>
      <Button title="Notify me after 3 secs !" onPress={() => onPressToNotify2()}></Button>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.SMART_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Advert loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.error('Advert failed to load: ', error);
        }}
      />
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
