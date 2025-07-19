# FlickFlash - Movie Show Alert App

## Project Summary

FlickFlash2 is a cross-platform mobile app built with Expo (React Native) and TypeScript for iOS and Android. It allows users to:
- Select a location (e.g., Mumbai, Delhi, Kochi)
- View and search now showing and upcoming movies for that location
- Select theaters and show dates
- Register for notifications about movie show availability
- Receive push notifications via Firebase Cloud Messaging (FCM) when shows are available or if none are found by the request expiry date

The app integrates with a FastAPI backend, which scrapes BookMyShow using FireCrawl, stores data in PostgreSQL, and uses Celery for periodic scraping and cleanup tasks. All state (location, movie, etc.) is managed globally with React Context, and the UI is built with React Native Paper.

---

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Added Dependencies

- **react-native-paper**: UI component library for React Native, used for consistent and beautiful UI.
- **axios**: Promise-based HTTP client for making REST API calls to the backend.
- **expo-notifications**: Handles push notifications (FCM integration) in Expo apps.

## Location Selection and State Management

- The Home Screen now includes a dropdown to select a location (Mumbai, Delhi, Kochi).
- The selected location is managed globally using React Context (`components/LocationContext.tsx`).
- All screens can access the current location using the `useLocation` hook.
- This enables location-aware API calls and filtering throughout the app.

### Usage Example

```
import { useLocation } from '../components/LocationContext';

const { location, setLocation } = useLocation();
```

- The `location` value reflects the user's current selection.
- Use `setLocation(newLocation)` to update the location from any screen.
