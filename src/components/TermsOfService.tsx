import { motion } from 'motion/react';
import { FileText, CheckCircle, XCircle, Mail, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface TermsOfServiceProps {
  onClose?: () => void;
  onBack?: () => void;
}

export function TermsOfService({ onClose, onBack }: TermsOfServiceProps) {
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
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-gray-600">CAN|EDU Games</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: December 8, 2024</p>
        </div>

        <div className="space-y-8 text-gray-700">
          {/* Introduction */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <FileText className="w-6 h-6" />
              Agreement to Terms
            </h2>
            <p>
              Welcome to CAN|EDU Games! These Terms of Service ("Terms") govern your access to and use of
              www.canedugames.com (the "Service"), operated by CAN|EDU Games ("we," "us," or "our").
            </p>
            <p className="mt-4">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with
              any part of these Terms, you may not access the Service.
            </p>
            <p className="mt-4 font-semibold text-purple-600">
              For users under 13: A parent or guardian must review and agree to these Terms on your behalf.
            </p>
          </section>

          {/* Service Description */}
          <section className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
            <h2 className="flex items-center gap-2 mb-4 text-purple-800">
              <CheckCircle className="w-6 h-6" />
              What We Offer
            </h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>CAN|EDU Games provides:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>FREE Access:</strong> All 17 educational games are completely free to play</li>
                <li><strong>Canadian Curriculum:</strong> Games aligned with Canadian educational standards</li>
                <li><strong>Progress Tracking:</strong> Monitor literacy and numeracy development</li>
                <li><strong>10-Level Progression:</strong> Adaptive learning system that grows with students</li>
                <li><strong>Premium Subscription:</strong> Optional $14.99/year for ad-free experience and analytics</li>
              </ul>
            </div>
          </section>

          {/* Account Requirements */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <FileText className="w-6 h-6" />
              Account Registration
            </h2>
            
            <h3 className="font-semibold mt-4 mb-2">Creating an Account</h3>
            <p>To use CAN|EDU Games, you must:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Age Requirements</h3>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li><strong>Users under 13:</strong> Must have parental consent and supervision</li>
              <li><strong>Parents/Guardians:</strong> Responsible for monitoring children's use of the Service</li>
              <li><strong>Account Management:</strong> Parents should create accounts for children under 13</li>
            </ul>
          </section>

          {/* Free vs Premium */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <CheckCircle className="w-6 h-6" />
              Free Service & Premium Subscription
            </h2>
            
            <h3 className="font-semibold mt-4 mb-2">FREE Service Includes:</h3>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>✅ All 17 educational games</li>
              <li>✅ Progress tracking and scoring</li>
              <li>✅ 10-level progression system</li>
              <li>⚠️ Family-friendly advertisements (Google AdSense)</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">PREMIUM Subscription ($14.99/year):</h3>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>✅ All FREE features</li>
              <li>✅ <strong>Ad-free experience</strong> - No advertisements</li>
              <li>✅ <strong>Advanced analytics</strong> - Detailed performance reports</li>
              <li>✅ <strong>Premium support</strong> - Priority assistance</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Subscription Terms:</h3>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li><strong>Billing:</strong> Charged annually ($14.99/year)</li>
              <li><strong>Auto-renewal:</strong> Automatically renews unless cancelled</li>
              <li><strong>Cancellation:</strong> Cancel anytime through your account settings</li>
              <li><strong>Refunds:</strong> Prorated refunds available within 30 days (see Refund Policy below)</li>
              <li><strong>Payment Processing:</strong> Securely handled by Stripe</li>
            </ul>
          </section>

          {/* Refund Policy */}
          <section className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h2 className="flex items-center gap-2 mb-4 text-green-800">
              <CheckCircle className="w-6 h-6" />
              Refund Policy
            </h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>30-Day Money-Back Guarantee:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Request a full refund within 30 days of purchase</li>
                <li>No questions asked - we want happy learners!</li>
                <li>Contact us at support@canedugames.com</li>
                <li>Refunds processed within 5-7 business days</li>
              </ul>
              <p className="mt-4">
                <strong>After 30 days:</strong> Prorated refunds available for unused months at our discretion.
              </p>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <CheckCircle className="w-6 h-6" />
              Acceptable Use
            </h2>
            <p>You agree to use CAN|EDU Games for lawful educational purposes only. You may NOT:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li><XCircle className="inline w-4 h-4 text-red-500 mr-2" />Share your account credentials with others</li>
              <li><XCircle className="inline w-4 h-4 text-red-500 mr-2" />Attempt to hack, disrupt, or damage the Service</li>
              <li><XCircle className="inline w-4 h-4 text-red-500 mr-2" />Use automated tools (bots) to access the Service</li>
              <li><XCircle className="inline w-4 h-4 text-red-500 mr-2" />Copy, reproduce, or distribute our content without permission</li>
              <li><XCircle className="inline w-4 h-4 text-red-500 mr-2" />Use the Service for any illegal or unauthorized purpose</li>
              <li><XCircle className="inline w-4 h-4 text-red-500 mr-2" />Violate any laws in your jurisdiction</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <FileText className="w-6 h-6" />
              Intellectual Property
            </h2>
            <p>
              All content on CAN|EDU Games, including games, graphics, logos, text, and software, is the
              property of CAN|EDU Games and is protected by Canadian and international copyright laws.
            </p>
            <p className="mt-4"><strong>You may:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>✅ Play our games for personal educational use</li>
              <li>✅ Print progress reports for educational purposes</li>
            </ul>
            <p className="mt-4"><strong>You may NOT:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>❌ Redistribute, sell, or commercialize our content</li>
              <li>❌ Reverse engineer or copy our games</li>
              <li>❌ Remove copyright or proprietary notices</li>
            </ul>
          </section>

          {/* User Data & Privacy */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <FileText className="w-6 h-6" />
              Your Data & Privacy
            </h2>
            <p>
              Your privacy is important to us. Our collection and use of personal information is governed by
              our <button onClick={() => {}} className="text-purple-600 underline">Privacy Policy</button>.
            </p>
            <p className="mt-4"><strong>Key points:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>We collect only necessary information to provide the Service</li>
              <li>Educational data is used to track progress and improve learning</li>
              <li>We comply with COPPA (Children's Online Privacy Protection Act)</li>
              <li>We comply with Canadian PIPEDA privacy regulations</li>
              <li>You can delete your account and data anytime</li>
            </ul>
          </section>

          {/* Disclaimers */}
          <section className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <h2 className="flex items-center gap-2 mb-4 text-yellow-800">
              <AlertTriangle className="w-6 h-6" />
              Disclaimers
            </h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>Educational Supplement:</strong></p>
              <p>
                CAN|EDU Games is designed to supplement, not replace, traditional education. We provide
                educational games to support learning but do not guarantee specific academic outcomes.
              </p>
              
              <p className="mt-4"><strong>"As Is" Service:</strong></p>
              <p>
                The Service is provided "as is" and "as available" without warranties of any kind, either
                express or implied. We do not guarantee uninterrupted or error-free service.
              </p>

              <p className="mt-4"><strong>Third-Party Links:</strong></p>
              <p>
                Our Service may contain links to third-party websites (e.g., Google AdSense ads). We are
                not responsible for the content or practices of these external sites.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <AlertTriangle className="w-6 h-6" />
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, CAN|EDU Games shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
              whether incurred directly or indirectly, or any loss of data, use, goodwill, or other
              intangible losses resulting from:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>Your use or inability to use the Service</li>
              <li>Any unauthorized access to or use of our servers</li>
              <li>Any interruption or cessation of the Service</li>
              <li>Any errors or omissions in content</li>
            </ul>
            <p className="mt-4">
              <strong>Maximum Liability:</strong> Our total liability to you for all claims shall not exceed
              the amount you paid us in the 12 months before the claim (or $14.99 for Premium subscribers).
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <XCircle className="w-6 h-6" />
              Termination
            </h2>
            
            <h3 className="font-semibold mt-4 mb-2">Your Rights:</h3>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>You may terminate your account at any time through account settings</li>
              <li>Upon termination, your right to use the Service ceases immediately</li>
              <li>Premium subscriptions can be cancelled to stop future billing</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Our Rights:</h3>
            <p>We may suspend or terminate your account if you:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>Violate these Terms of Service</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Abuse or misuse the Service</li>
              <li>Fail to pay for Premium subscription</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <FileText className="w-6 h-6" />
              Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Canada and the
              province in which CAN|EDU Games operates, without regard to conflict of law provisions.
            </p>
            <p className="mt-4">
              Any disputes arising from these Terms or your use of the Service shall be resolved in the
              courts of Canada.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="flex items-center gap-2 mb-4 text-purple-600">
              <FileText className="w-6 h-6" />
              Changes to Terms
            </h2>
            <p>We reserve the right to modify these Terms at any time. We will notify you of changes by:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>Posting the updated Terms on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending email notification for significant changes</li>
            </ul>
            <p className="mt-4">
              Your continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
            <h2 className="flex items-center gap-2 mb-4 text-purple-800">
              <Mail className="w-6 h-6" />
              Contact Us
            </h2>
            <p className="text-gray-700">
              Questions about these Terms? We're here to help!
            </p>
            <div className="mt-4 space-y-2 text-gray-700">
              <p><strong>General Support:</strong> support@canedugames.com</p>
              <p><strong>Legal Inquiries:</strong> legal@canedugames.com</p>
              <p><strong>Billing Questions:</strong> billing@canedugames.com</p>
              <p><strong>Website:</strong> www.canedugames.com</p>
            </div>
          </section>

          {/* Summary */}
          <section className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h2 className="text-green-800 mb-4">Terms Summary 🍁</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✅ All games are 100% FREE to use</li>
              <li>✅ Optional Premium: $14.99/year (ad-free + analytics)</li>
              <li>✅ 30-day money-back guarantee</li>
              <li>✅ Cancel Premium subscription anytime</li>
              <li>✅ Safe for children - COPPA compliant</li>
              <li>✅ Parents control accounts for kids under 13</li>
              <li>✅ Canadian curriculum educational games</li>
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