# PTag Admin

React frontend for PTag, including the Super Admin panel. Production API: `https://anpr-api.gconnectt.com`.

## Android APK build (no Android Studio required on your computer)

This repository includes a GitHub Actions workflow at `.github/workflows/android-apk.yml`. It builds the React app, creates/synchronizes the Capacitor Android project, and produces a debug APK.

1. Commit/push the project to your GitHub repository on `main` or `master`.
2. Open the repository's **Actions** tab and select **Build PTag Admin Android APK**.
3. Select **Run workflow** (or push a commit to the branch).
4. Open the completed workflow run and download the `PTag-Admin-APK` artifact.
5. Extract the downloaded ZIP; the APK is named `app-debug.apk`. Install it on an Android device and allow installation from that source if Android asks.

For a named GitHub Release, create and push a version tag such as `v1.0.0`; the workflow uploads the APK to that Release.

## Android behavior

- Android opens directly at the Super Admin login screen.
- Android uses hash-based routing so internal routes work reliably in the WebView.
- The normal web app continues to use browser routes and opens at `/login`.
- The app calls the HTTPS production API; no backend secrets should be stored in the frontend.

## Local web development

Run `npm install --legacy-peer-deps` and `npm start`.
