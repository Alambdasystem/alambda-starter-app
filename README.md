# Alambda Checklist

React Native / Expo starter owned by Alambda Systems, LLC. Public developer brand: ArchTek AI.

A local-only checklist with add, complete, delete, persistent storage, and explicit storage error handling. No account, backend, analytics, advertising, or external data transmission is implemented. Android backup is disabled. Uninstalling removes locally saved tasks.

## Development

Node 22 or newer. Run `npm ci`, then `npx expo start`. Type check with `npx tsc --noEmit`.

## Android upload build

Package: `com.alambda.checklist`. Initial version: 1.0.0 / versionCode 1. Increment versionCode in app.json for every subsequent Play upload. Package identity becomes fixed after the first Play upload.

Codemagic workflow `android-release` generates Android using Expo prebuild and produces a signed release APK and AAB on pushes to main once the Codemagic webhook is enabled. Configure the persistent upload keystore in Codemagic code signing with reference `alambda_checklist_upload`. Never commit signing keys or passwords. Keep the keystore backed up securely; do not generate a different key per build.

Download the AAB build artifact and upload to Google Play Console > Alambda Checklist > Testing > Internal testing. This starter deliberately does not automatically publish releases. Organization verification, Play app signing enrollment, and any Play Console declarations must be completed before rollout.

## iOS

The same React Native code targets iOS with bundle ID `com.alambda.checklist`. iOS signing and TestFlight are not configured in this initial Android submission workflow.
