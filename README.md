# Progress Habit Tracker (Expo + React Native)

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup iOS Simulator (macOS only)**
   - Install Xcode from the Mac App Store
   - Open Xcode → Settings → Platforms → Download iOS runtime
   - Verify installation:
     ```bash
     xcrun simctl list devices available | grep "iPhone"
     ```
   - You should see available devices like `iPhone 17 Pro`, `iPhone 16`, etc.
   - 📖 [Official iOS Simulator Guide](https://docs.expo.dev/workflow/ios-simulator/)

   **Setup Android Emulator (macOS/Windows/Linux)**
   - Install [Android Studio](https://developer.android.com/studio)
   - Open Android Studio → More Actions → Virtual Device Manager
   - Create a new device (e.g., Pixel 8) with latest Android version
   - Start the emulator before running `npm start`
   - 📖 [Official Android Emulator Guide](https://docs.expo.dev/workflow/android-studio-emulator/)

3. **Run Simulator**
   
   **For iOS (macOS only):**
   ```bash
      xcrun simctl boot UrSimulatorrID
   ```
   
   **For Android:**
   ```bash
   IDK yet
   ```

4. **Run the dev server**
   ```bash
   npm start
   ```
   - Press `i` to open iOS simulator
   - Press `a` to open Android emulator
   - Press `w` to open web browser
   
   **If you encounter connection issues:**
   ```bash
   # Kill any processes on port 8081 and restart with clean cache
   kill -9 $(lsof -ti:8081) 2>/dev/null || true
   rm -rf .expo node_modules/.cache
   npm start -- --clear
   ```

5. **Debugging Tools**
   
   **In Terminal (Metro Bundler):**
   - Press `j` → Open React DevTools in browser (inspect component tree, props, state)
   - Press `m` → Toggle dev menu
   - Press `r` → Reload app (Fast Refresh)
   
   **In Simulator/Emulator:**
   - **iOS**: `Cmd + D` to open Expo dev menu
   - **Android**: `Cmd + M` (Mac) or `Ctrl + M` (Windows/Linux)


## Project structure

```
src/
  components/      # Reusable cards and UI widgets
  constants/       # Habit presets and static data
  navigation/      # Tab navigator + theme setup
  screens/         # Dashboard, Timer, Goals, Settings placeholders
  store/           # Zustand store with timers, achievements, presets
  lib/             # Supabase helper (future cloud sync)
```

## Tech stack

| Concern | Choice | Notes |
| --- | --- | --- |
| Framework | Expo + React Native | Single codebase for iOS, Android, web |
| Styling | NativeWind (Tailwind) | `tailwind.config.js` already configured with a brand palette |
| State | Zustand + AsyncStorage | `src/store/useHabitsStore.ts` centralises timer + sessions + presets |
| Navigation | React Navigation (bottom tabs) | `AppNavigator` wires Dashboard, Timer, Goals, Settings |
| Charts & media | `expo-av`, `@expo/vector-icons` | Ready for music player / decorative effects |
| Cloud sync | Supabase client helper stub | Hooked through `src/lib/supabase.ts` |
