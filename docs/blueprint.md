# **App Name**: YatraSetu

## Core Features:

- Authentication: Secure user authentication with Email/Password, Google Sign-In, and Phone OTP using Firebase Auth. Profile data stored in Firestore.
- Train Booking: Search and book train tickets, save passenger profiles, and manage Tatkal bookings. Passenger Details Form: Name, Age, Gender, ID proof, Seat Preference, Meal Preference. Mock train data initially from Firestore. Add waitlist prediction (AI can predict chances of confirmation based on past data). PNR Status Tracking & live train running status. Alerts for delays or platform changes.
- Hotel Booking: Search and book hotels, manage guest details, and process payments. Booking details stored in Firestore. Add filters (price range, rating, amenities). Allow wishlist/saved hotels for repeat users.
- Food Ordering: Order food on trains by entering PNR or train number. Choose from available catering partners and manage orders. Uses demo payment integration. Live order tracking: preparing → out for delivery → delivered. Add live train running status integration so the app shows only stations upcoming on the journey. Allow scheduled delivery at a chosen station.
- AI Journey Planner: Use AI to tool recommend optimal train, hotel, and meal choices for a user's journey, incorporating user preferences and real-time data. Suggest multi-modal travel (e.g., combine train + metro + hotel).
- Tatkal Automation: Automated Tatkal booking using a Firebase Cloud Function triggered at booking time. Users receive push notifications and email confirmations. Provide live booking status tracker in dashboard. Push notifications & email confirmations. Retry logic and queue management for high-demand tickets.
- Booking History: Centralized history page showing train bookings, hotel bookings, and food orders with status tracking and cancellation options. Add downloadable receipts/invoices (PDF). Integrate Loyalty/Rewards Points: accumulate points for every booking, redeemable for discounts.
- Multi-Language Support: Add multi-language support (Hindi, Tamil, Bengali, etc.) — crucial for pan-India adoption.
- Payments & Wallet: Integrated payment options: UPI, Cards, NetBanking, Wallets. Save multiple payment methods for quick checkout.
- Offline & Notifications: Offline mode: view tickets, booking history, and saved passenger profiles. Push notifications for: tatkal reminders, Booking confirmations & cancellations, Train delays or platform changes. Email notifications for all major actions.

## Style Guidelines:

- Primary color: Deep Purple (#673AB7) to evoke a sense of trust and modernity. The selection aims for an elegant but also attention-grabbing look.
- Background color: Light Grey (#F5F5F5), nearly white, providing a clean and spacious feel.
- Accent color: Red (#FF5722) to highlight key actions and information, contrasting against the purple and grey.
- Body and headline font: 'PT Sans' (sans-serif) offering a modern and accessible reading experience across the platform.
- Use minimalistic and consistent icons for navigation and features, aligning with the overall futuristic UI.
- Responsive layout adapting to different screen sizes, ensuring a seamless experience on all devices.
- Subtle animations and hover states to enhance user interaction and provide visual feedback, maintaining a smooth user experience.