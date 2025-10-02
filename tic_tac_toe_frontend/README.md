# Tic Tac Toe - React Native (Expo)

This is a simple Tic Tac Toe game built with React Native using Expo, following the "Ocean Professional" style guide.

How to run (development):
- Install dependencies: npm install
- Start the app:
  - For Android emulator or device: npm run android
  - For iOS simulator (macOS): npm run ios
  - For web preview: npm run web
  - Or start the dev server only: npm start

Notes:
- This project uses an Expo-managed workflow. Native Gradle/Xcode projects are not committed by default.
- If you need native projects for CI or custom native modules, run:
  - Android: npm run prebuild:android (generates android/ with gradlew)
- The CI build step should use Expo or prebuild generation before calling native build tools.

Styling:
- Colors: primary #2563EB, secondary/success #F59E0B, error #EF4444, background #f9fafb, surface #ffffff, text #111827
- UI uses rounded corners, subtle shadows, and smooth transitions.

