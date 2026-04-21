## Relevant Files

- `app/index.tsx` - Entry point, routes, and initial role selection logic (Expo Router).
- `context/AuthContext.tsx` - State management for user roles and authentication.
- `services/kycService.ts` - Integration with Onfido/Jumio APIs for identity verification.
- `app/(auth)/kyc-verification.tsx` - UI for uploading IDs and liveness checks.
- `app/(worker)/gig-map.tsx` - UI for the location-based matching and map display.
- `services/locationService.ts` - Google Maps API integration and GPS handling.
- `app/(business)/job-posting.tsx` - UI for businesses to create job posts.
- `app/(worker)/active-shift.tsx` - UI for clock-in/out and shift timer.
- `services/qrService.ts` - Generation and scanning of signed offline QR codes.
- `services/paymentService.ts` - Escrow handling, GCash/Maya/Bank integrations.
- `app/(shared)/earnings.tsx` - Earnings and payout management dashboard.
- `app/(shared)/rating.tsx` - Bilateral feedback UI.

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Use `npm test` or `jest` to run tests.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (`git checkout -b feature/agapshift-core`)
- [x] 1.0 Project Setup & Core State Management
  - [x] 1.1 Set up base React Native (Expo) project structure and dependencies if missing
  - [x] 1.2 Implement the Role Selection screen ("I want to Hire" vs "I want to Work")
  - [x] 1.3 Create the AuthContext to handle role-based state and routing
- [x] 2.0 Authentication & Automated KYC Integration
  - [x] 2.1 Integrate the 3rd party KYC provider SDK (e.g., Onfido)
  - [x] 2.2 Implement Worker Verification UI flow (OTP, Gov ID, Selfie)
  - [x] 2.3 Implement Business Verification UI flow (DTI/SEC, Permits, TIN)
- [x] 3.0 Location & Map Matching System
  - [x] 3.1 Integrate Google Maps SDK and device location permissions
  - [x] 3.2 Create the Gig Map screen to show job pins (for workers) and worker pins (for businesses)
  - [x] 3.3 Implement distance-based filtering logic
- [x] 4.0 Job Posting & Dual Hiring Flow
  - [x] 4.1 Build the Job Posting form for business users
  - [x] 4.2 Implement Public Hiring UI (open applications list)
  - [x] 4.3 Implement Direct Headhunting UI (private job offers from map)
- [x] 5.0 Shift Execution & QR Verification System
  - [x] 5.1 Implement the Active Shift Screen with clock-in/out timer
  - [x] 5.2 Build the QR generation logic (including signed offline fallback data)
  - [x] 5.3 Implement the QR scanner for businesses to verify attendance
- [x] 6.0 Escrow Payment System & E-Wallet Integration
  - [x] 6.1 Integrate payment gateway SDK (e.g., Xendit/PayMongo) for e-wallets and cards
  - [x] 6.2 Implement business deposit and escrow holding logic before shift start
  - [x] 6.3 Implement payout routing to workers post-shift with commission deduction
- [x] 7.0 Bilateral Rating & Earnings Management
  - [x] 7.1 Build the post-shift rating form for both parties
  - [x] 7.2 Implement the Earnings Dashboard for workers
  - [x] 7.3 Implement the Expenses and Reporting UI for businesses
