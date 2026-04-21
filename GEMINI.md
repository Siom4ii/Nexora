# AgapShift Project Guidelines

AgapShift is a dual-platform mobile application built with React Native and Expo (SDK 54), designed to connect Business Owners and Job Seekers for short-term shifts in the Philippines.

**See [AGENTS.md](./AGENTS.md) for specialized expert personas (Mobile Architect, Security Expert, etc.) to adopt when working on this project.**

## 1. Project Overview & Strategy
- **Core Goal**: Facilitate secure, rapid hiring (under 60 minutes) through a verified ecosystem.
- **Role-Based Routing**: The app bifurcates into `(worker)` and `(business)` flows immediately after KYC.
- **Primary Paradigms**: Functional components, React Hooks, and Service-Oriented architecture for 3rd party integrations.

## 2. Architecture & Patterns
- **Routing**: `expo-router` file-based navigation.
- **State Management**: `context/AuthContext.tsx` is the source of truth for user roles and verification status.
- **Business Logic**: Encapsulate all SDK and external API logic (Onfido, Location, Payments, QR) within the `services/` directory.
- **Styling**: Always use the theme from `constants/theme.ts`.
    - `Colors.light.worker` (#0062FF) for worker-facing UI.
    - `Colors.light.business` (#00C853) for business-facing UI.
- **Animations**: Use `react-native-reanimated` for fluid transitions.

## 3. Coding Style & Standards
- **Component Structure**: Prefer functional components with TypeScript interfaces for props.
- **Naming**: Use camelCase for variables/functions and PascalCase for components.
- **Role Awareness**: Always use the `useAuth` hook to determine the current role and adapt the UI accordingly.
- **Icons**: Standardize on `@expo/vector-icons` (Ionicons).
- **Async Operations**: Use `async/await` and provide clear loading states (e.g., `ModernButton`'s `loading` prop).

## 4. Negative Constraints (What NOT to do)
- **NO Hardcoded Colors**: Never use literal hex codes for primary UI elements; use `Colors[scheme].worker/business`.
- **NO Direct SDK Calls**: Do not import Onfido, Map SDKs, or Payment gateways directly into UI screens; use the corresponding `services/` wrapper.
- **NO Bypassing Role Checks**: Never render worker-specific features to a business user (or vice versa) without verifying the role via `AuthContext`.
- **NO Inline Heavy Logic**: Keep screen files focused on UI and interaction; delegate complex calculations or data fetching to services.

## 5. Building & Validation
- **Install**: `npm install` (within `agapshift-app`)
- **Run (Web)**: `npx expo start --web`
- **Run (Android)**: `npx expo start --android`
- **Linting**: `npm run lint`
- **Validation**: Every new feature or bug fix MUST be verified in web mode at a minimum.

## 6. Testing Strategy
- **Current State**: Initial infrastructure (no active tests).
- **Standard**: New components should include a basic unit test file alongside them (`.test.tsx`) as the project matures.
