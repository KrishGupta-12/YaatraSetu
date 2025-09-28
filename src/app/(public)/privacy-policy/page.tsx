
import { Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Lock className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground mt-4">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
        <p>
          Welcome to YatraSetu. We are committed to protecting your privacy and handling your data in an open and transparent manner. This privacy policy sets out how we collect, use, and protect any information that you give us when you use this application.
        </p>

        <h2>1. Data Collection</h2>
        <p>
          We may collect the following information to provide and improve our services:
        </p>
        <ul>
          <li><strong>Account Information:</strong> When you register, we collect your name, email address, and password. Your password is encrypted and we never see it.</li>
          <li><strong>Profile Information:</strong> You may voluntarily provide additional information such as a phone number and profile picture.</li>
          <li><strong>Booking Information:</strong> We store details of your train, hotel, and food bookings, including passenger names, journey dates, and transaction history.</li>
          <li><strong>Usage Data:</strong> We may collect information about how you interact with our application, such as features used and pages visited, to improve user experience.</li>
        </ul>

        <h2>2. How Data Is Used</h2>
        <p>
          We use the information we collect for the following purposes:
        </p>
        <ul>
          <li>To create and manage your account.</li>
          <li>To process your bookings and payments.</li>
          <li>To provide personalized services, such as Tatkal automation and AI journey planning.</li>
          <li>To communicate with you about your bookings, service updates, and promotional offers (if you opt-in).</li>
          <li>To improve our application and develop new features.</li>
          <li>To comply with legal obligations and prevent fraud.</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          We are committed to ensuring that your information is secure. We use Firebase Authentication and Firestore, which provide robust security measures, including encryption of data at rest and in transit. Access to your personal data is restricted to authorized personnel only.
        </p>
        
        <h2>4. User Rights</h2>
        <p>
          You have rights over your personal data. These include:
        </p>
        <ul>
          <li><strong>Access:</strong> You can access and view your personal and booking data at any time through your profile and history pages.</li>
          <li><strong>Correction:</strong> You can update your profile information, including your name and saved passengers.</li>
          <li><strong>Deletion:</strong> You have the right to delete your account and all associated data from our systems via the 'Settings' page. This action is irreversible.</li>
        </ul>

        <h2>5. Third-Party Services</h2>
        <p>
            YatraSetu does not sell or rent your personal data to third parties. We may share data with trusted partners only for the purpose of providing services you have requested (e.g., processing payments through a secure gateway). All our partners are compliant with standard data protection regulations.
        </p>

        <h2>6. Contact for Privacy Concerns</h2>
        <p>
          If you have any questions or concerns about this privacy policy or how we handle your data, please do not hesitate to contact us.
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:krishgupta200510@gmail.com">krishgupta200510@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
