# AgapShift (Nexora) - Development Setup

This guide provides instructions on how to set up this workspace on a new device.

## 1. Prerequisites
Before you begin, ensure you have the following installed on your new device:
*   **Git**: [Download Git](https://git-scm.com/downloads)
*   **Node.js (LTS)**: [Download Node.js](https://nodejs.org/)
*   **Java Development Kit (JDK)**: Required for Android development.
*   **Android Studio**: To manage Android SDKs and use the Emulator.

## 2. Cloning the Project
Open your terminal/command prompt and run:
```bash
git clone https://github.com/Siom4ii/Nexora.git
cd Nexora
```

## 3. Installing Dependencies
Navigate to the application folder and install the necessary packages:
```bash
cd agapshift-app
npm install
```

## 4. Running the Application
Once dependencies are installed, you can start the development server:

### Web Mode (Recommended for testing)
```bash
npx expo start --web
```

### Android Mode
Make sure your emulator is running or a device is connected via ADB:
```bash
npx expo start --android
```

## 5. Development Workflow
*   **Styling**: Use the theme constants in `constants/theme.ts`.
*   **Routing**: Uses `expo-router` file-based navigation.
*   **AI Agent**: If you are using Gemini CLI, it will automatically recognize the project structure using `GEMINI.md`.

## 6. Syncing Changes
To keep both devices in sync, remember to push your changes before leaving one device and pull them when starting on the other:

**On Device A (Save changes):**
```bash
git add .
git commit -m "Work progress summary"
git push origin main
```

**On Device B (Get changes):**
```bash
git pull origin main
```
