# Android Placeholder

This folder contains a minimal placeholder `gradlew` so CI environments that automatically call `./gradlew` do not fail.

Expo-managed projects do not include native projects by default.
If you need to build the native Android app, generate the native project first:

- npx expo prebuild --platform android

After running the above, the full `android/` directory and real `gradlew` will be created, and you can use standard Gradle commands.
