# Gradle Wrapper Shim

Some CI environments call `./gradlew` from the project root.
This Expo-managed project does not include a native Android project by default,
so we provide a shim script at the root that delegates to `android/gradlew` if present.

- For real native builds, generate the native projects first:
  - `npx expo prebuild --platform android`
- After prebuild, the full native Android project and real Gradle wrapper will be available.

If your CI doesn't need native builds, prefer running `npm run web` or `npm start` (Expo dev server).
