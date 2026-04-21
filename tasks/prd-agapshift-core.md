# PRD: AgapShift Core Platform

## 1. Introduction/Overview
AgapShift is a dual-platform mobile application designed to connect Business Owners (Employers) and Job Seekers (Workers) for short-term, flexible shift-based work in the Philippines. This PRD outlines the core platform mechanics, including role-based routing, automated KYC verification, real-time location-based gig matching, end-to-end job execution tracking via QR codes, and a secure escrow payment system. The goal is to provide a seamless, secure, and rapid hiring experience where a business can post a job and hire a verified worker in under 60 minutes.

## 2. Goals
- Enable real-time, location-based workforce matching (under 60 minutes).
- Build a trusted ecosystem through fully automated, third-party KYC verification.
- Streamline the end-to-end flexible hiring process (post → hire → work → pay → rate).
- Guarantee secure and transparent financial transactions through an escrow system supporting local e-wallets, cards, and bank transfers.
- Reduce fraudulent activities (no-shows, fake attendance) using geo-fenced QR code verification.

## 3. User Stories
- **As a Job Seeker**, I want to view nearby job opportunities on an interactive map so I can quickly find flexible work close to me.
- **As a Job Seeker**, I want to verify my identity easily using my mobile phone and a valid government ID so I can start accepting jobs safely.
- **As a Business Owner**, I want to filter available workers by skills, distance, and rating so I can headhunt the most suitable candidates directly.
- **As a Business Owner**, I want to scan a worker's QR code when they arrive so I can officially verify their attendance and begin the shift timer.
- **As a Job Seeker with no internet**, I want to display a static, offline QR code to the business so I can still clock in and out successfully without connectivity.
- **As a user of either role**, I want funds to be held in escrow before the shift begins and released transparently so I am protected against non-payment or incomplete work.
- **As a Business Owner**, I want the final say in releasing escrow funds to ensure work was completed satisfactorily, while allowing the worker an appeal process in case of disputes.

## 4. Functional Requirements
1. **Role-Based User System:** The system must dynamically load different dashboards, features, and permissions based on whether the user selects "I want to Hire" or "I want to Work" upon first launch.
2. **Authentication & KYC:** The system must perform fully automated identity verification via a third-party API (e.g., Onfido, Jumio) for both workers (OTP, Government ID, Liveness Check) and businesses (DTI/SEC, Business Permit, TIN).
3. **Location-Based Matching:** The system must utilize device GPS and mapping APIs (e.g., Google Maps) to display available jobs and available workers based on proximity.
4. **Job Posting & Request:** Business owners must be able to create job posts detailing role, date/time, map location, salary, and description.
5. **Dual Hiring Mechanism:** The system must support public job applications from workers and direct headhunting (private job offers) by businesses.
6. **Real-Time Job Execution:** The system must track job progress with a visible status indicator and clock-in/out timer for the duration of the shift.
7. **QR Code Verification:** Workers must be able to generate a QR code (including a static offline fallback) that the business scans to cryptographically verify presence for clock-in and clock-out.
8. **Payment Escrow System:** The system must require business deposits before the job starts, hold funds in escrow, and support GCash, Maya, credit/debit cards, and direct bank transfers. The business holds the final say on fund release, with an appeal mechanism for workers.
9. **Bilateral Rating System:** Users must be able to rate each other post-job (punctuality, skill, attitude for workers; environment, instructions, payment reliability for businesses).
10. **Earnings Management:** The system must provide transaction tracking, earning summaries, and digital wallet integration for both user types.

## 5. Non-Goals (Out of Scope)
- Long-term or permanent employment contracts.
- In-app messaging or chat functionality (unless required for the dispute appeals process).
- Payroll processing for full-time corporate staff outside of the gig economy.

## 6. Design Considerations
- The UI must feel highly engaging, responsive, and modern.
- The map interface must clearly distinguish between worker pins and job pins using custom branding.
- The QR generation and scanning UI should be large, clear, and accessible in low-light environments.

## 7. Technical Considerations
- **KYC:** Requires integration with a third-party KYC provider for automated identity verification.
- **Payments:** Requires payment gateway integration capable of escrow/holding mechanisms supporting Philippine payment methods (e.g., Xendit or PayMongo).
- **Offline QR Codes:** The static offline QR code must contain securely signed payload data (e.g., JWT or signed Hash) that the business's app can independently verify against the expected job assignment when scanning without relying on the worker's device connecting to the server.
- **Notifications:** Push notifications require robust real-time infrastructure (e.g., Firebase Cloud Messaging).

## 8. Success Metrics
- Average time from job posting to worker acceptance (target: < 60 minutes).
- Percentage of successful shifts completed without dispute.
- KYC verification success rate and time-to-verify.
- User retention rate after the first completed shift.

## 9. Open Questions
- Which specific third-party API should be used for the KYC verifications (Onfido, Jumio, or a local provider like VerifyOS)?
- What is the specific commission rate deducted from the gross pay?
- How is the appeals process technically handled in the dashboard when a business refuses to release funds?
