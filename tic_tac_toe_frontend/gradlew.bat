@ECHO OFF
REM Root-level gradle wrapper shim to support CI systems that call .\gradlew from project root.
IF EXIST ".\\android\\gradlew.bat" (
  CALL .\\android\\gradlew.bat %*
) ELSE (
  ECHO [gradlew shim] android\\gradlew.bat not found. This is an Expo-managed project.
  ECHO Generate native projects first: npx expo prebuild --platform android
  EXIT /B 0
)
