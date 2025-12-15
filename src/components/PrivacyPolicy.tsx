import { motion } from 'motion/react';
import { Shield, Lock, Cookie, Mail, FileText } from 'lucide-react';
import { Button } from './ui/button';

interface PrivacyPolicyProps {
  onClose?: () => void;
  onBack?: () => void;
}

export function PrivacyPolicy({ onClose, onBack }: PrivacyPolicyProps) {
  const handleClose = onClose || onBack || (() => {});
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-600">CAN|EDU Games</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: December 8, 2024</p>
        </div>

        <div className="space-y-8 text-gray-700">
          {/* Introduction */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <FileText className="w-6 h-6" />
              Introduction
            </h2>
            <p>
              Welcome to CAN|EDU Games ("we," "our," or "us"). We are committed to protecting your privacy
              and the privacy of children who use our educational platform. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you visit our website
              www.canedugames.com and use our educational games.
            </p>
            <p className="mt-4">
              By using CAN|EDU Games, you agree to the collection and use of information in accordance with
              this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <Lock className="w-6 h-6" />
              Information We Collect
            </h2>
            
            <h3 className="font-semibold mt-4 mb-2">Personal Information</h3>
            <p>When you create an account, we collect:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li><strong>Email address:</strong> Used for account creation and communication</li>
              <li><strong>Name:</strong> To personalize your experience</li>
              <li><strong>Password:</strong> Securely encrypted for account protection</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Educational Data</h3>
            <p>To provide personalized learning experiences, we collect:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li><strong>Game scores and performance:</strong> To track progress and skill development</li>
              <li><strong>Learning level:</strong> To provide appropriate difficulty challenges</li>
              <li><strong>Literacy and numeracy accuracy:</strong> To identify strengths and areas for improvement</li>
              <li><strong>Time spent on activities:</strong> To understand engagement patterns</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Payment Information</h3>
            <p>If you subscribe to our Premium service ($14.99/year):</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li><strong>Payment processing:</strong> Handled securely by Stripe (we do NOT store credit card numbers)</li>
              <li><strong>Billing information:</strong> Name and email for transaction records</li>
              <li><strong>Subscription status:</strong> To manage your Premium features</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Automatically Collected Information</h3>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li><strong>Device information:</strong> Browser type, operating system</li>
              <li><strong>Usage data:</strong> Pages visited, features used, time spent</li>
              <li><strong>Cookies:</strong> For authentication and preferences (see Cookie Policy below)</li>
            </ul>
          </section>

          {/* Children's Privacy (COPPA) */}
          <section className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <h2 className="flex items-center gap-2 mb-4 text-yellow-800">
              <Shield className="w-6 h-6" />
              Children&apos;s Privacy (COPPA Compliance)
            </h2>
            <p className="text-gray-700">
              CAN|EDU Games is designed for educational use by children of all ages. We comply with the
              Children's Online Privacy Protection Act (COPPA) and Canadian privacy laws:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2 text-gray-700">
              <li>We do NOT knowingly collect personal information from children under 13 without parental consent</li>
              <li>Parents/guardians should create and manage accounts for children</li>
              <li>We do NOT share children's information with third parties for marketing</li>
              <li>Educational data is used ONLY to improve learning experiences</li>
              <li>Parents can request to review, delete, or stop collection of their child's information</li>
            </ul>
            <p className="mt-4 text-gray-700">
              <strong>For parents:</strong> If you believe your child has provided personal information without consent,
              please contact us immediately at privacy@canedugames.com, and we will delete it promptly.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <FileText className="w-6 h-6" />
              How We Use Your Information
            </h2>
            <p>We use collected information to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>Provide and maintain our educational services</li>
              <li>Personalize learning experiences and track progress</li>
              <li>Process Premium subscriptions and payments</li>
              <li>Send important service updates and notifications</li>
              <li>Improve our games and develop new educational content</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Google AdSense & Advertising */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <Cookie className="w-6 h-6" />
              Advertising & Google AdSense
            </h2>
            <p>
              <strong>For FREE users only:</strong> We display family-friendly advertisements through
              Google AdSense to support our free educational games.
            </p>
            
            <h3 className="font-semibold mt-4 mb-2">Important Notes:</h3>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li><strong>Premium users ($14.99/year):</strong> Enjoy a completely ad-free experience</li>
              <li><strong>All ads are family-friendly:</strong> We use strict filters for educational content</li>
              <li><strong>Google AdSense cookies:</strong> May be used for personalized ads (see Cookie Policy)</li>
              <li><strong>No behavioral targeting of children:</strong> We comply with all child privacy regulations</li>
            </ul>

            <p className="mt-4">
              Google AdSense may use cookies and web beacons to serve ads based on your visit to our site
              and other sites on the Internet. You can opt out of personalized advertising by visiting
              Google's <a href="https://www.google.com/settings/ads" className="text-purple-600 underline" target="_blank" rel="noopener noreferrer">Ad Settings</a>.
            </p>
          </section>

          {/* Cookie Policy */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <Cookie className="w-6 h-6" />
              Cookie Policy
            </h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li><strong>Essential cookies:</strong> Keep you logged in and remember your preferences</li>
              <li><strong>Performance cookies:</strong> Understand how you use our site to improve it</li>
              <li><strong>Advertising cookies (free users only):</strong> Google AdSense for relevant ads</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. However, disabling cookies may limit
              your ability to use certain features of our service.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <Shield className="w-6 h-6" />
              Data Security
            </h2>
            <p>We implement industry-standard security measures to protect your information:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li><strong>Encryption:</strong> All data transmitted is encrypted using SSL/TLS</li>
              <li><strong>Secure hosting:</strong> Data stored on secure Supabase servers</li>
              <li><strong>Access controls:</strong> Limited employee access to personal data</li>
              <li><strong>Regular security audits:</strong> To identify and fix vulnerabilities</li>
              <li><strong>Payment security:</strong> Stripe handles all payment processing (PCI-compliant)</li>
            </ul>
            <p className="mt-4">
              While we strive to protect your information, no method of transmission over the Internet is 100% secure.
              We cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <FileText className="w-6 h-6" />
              Data Retention
            </h2>
            <p>We retain your information for as long as necessary to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>Provide our educational services</li>
              <li>Maintain your account and learning progress</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p className="mt-4">
              If you delete your account, we will delete or anonymize your personal information within 30 days,
              except where required by law to retain it longer.
            </p>
          </section>

          {/* Your Rights (PIPEDA - Canadian Privacy) */}
          <section className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
            <h2 className="flex items-center gap-2 mb-4 text-purple-800">
              <Lock className="w-6 h-6" />
              Your Privacy Rights (Canadian PIPEDA Compliance)
            </h2>
            <p className="text-gray-700">As a Canadian service, we comply with PIPEDA. You have the right to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2 text-gray-700">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Withdraw consent:</strong> Stop us from processing your data</li>
              <li><strong>Object to processing:</strong> Object to certain data uses</li>
              <li><strong>Complaint:</strong> Lodge a complaint with privacy authorities</li>
            </ul>
            <p className="mt-4 text-gray-700">
              To exercise these rights, contact us at privacy@canedugames.com
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <FileText className="w-6 h-6" />
              Third-Party Services
            </h2>
            <p>We use the following trusted third-party services:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li><strong>Supabase:</strong> Authentication and database hosting</li>
              <li><strong>Stripe:</strong> Secure payment processing</li>
              <li><strong>Google AdSense:</strong> Family-friendly advertising (free users only)</li>
            </ul>
            <p className="mt-4">
              These services have their own privacy policies. We recommend reviewing them:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li><a href="https://supabase.com/privacy" className="text-purple-600 underline" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a></li>
              <li><a href="https://stripe.com/privacy" className="text-purple-600 underline" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a></li>
              <li><a href="https://policies.google.com/privacy" className="text-purple-600 underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
            </ul>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <FileText className="w-6 h-6" />
              International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and maintained on servers located outside of Canada.
              We ensure appropriate safeguards are in place to protect your data in accordance with this
              Privacy Policy and applicable laws.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <FileText className="w-6 h-6" />
              Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last Updated" date at the top</li>
              <li>Sending you an email notification for significant changes</li>
            </ul>
            <p className="mt-4">
              We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
            <h2 className="flex items-center gap-2 mb-4 text-purple-800">
              <Mail className="w-6 h-6" />
              Contact Us
            </h2>
            <p className="text-gray-700">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="mt-4 space-y-2 text-gray-700">
              <p><strong>Email:</strong> privacy@canedugames.com</p>
              <p><strong>Website:</strong> www.canedugames.com</p>
              <p><strong>Privacy Officer:</strong> Available for Canadian privacy inquiries</p>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              For parents: If you have concerns about your child's privacy, please reach out immediately.
              We are committed to protecting children's data and will respond within 24 hours.
            </p>
          </section>

          {/* Summary Box */}
          <section className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h2 className="text-green-800 mb-4">Privacy Summary 🍁</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✅ We protect children's privacy and comply with COPPA</li>
              <li>✅ All games are FREE with optional Premium ($14.99/year)</li>
              <li>✅ Premium users get ad-free experience</li>
              <li>✅ We use your data ONLY to improve learning</li>
              <li>✅ You can delete your data anytime</li>
              <li>✅ We never sell personal information to third parties</li>
              <li>✅ Canadian PIPEDA compliant</li>
            </ul>
          </section>
        </div>

        {/* Close Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleClose}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl"
          >
            Back to Games
          </Button>
        </div>
      </motion.div>
    </div>
  );
}