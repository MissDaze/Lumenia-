import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <ScrollText className="w-16 h-16 mx-auto mb-4 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Terms of Service
          </h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle>DreamScape Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6 text-gray-700">
              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">1. Acceptance of Terms</h3>
                <p>By accessing and using DreamScape ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">2. Description of Service</h3>
                <p>DreamScape provides AI-powered mystical and spiritual guidance services including dream interpretation, tarot readings, astrology charts, horoscopes, rune readings, and music recommendations. Our services are for entertainment and personal reflection purposes only.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">3. User Accounts</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must be at least 13 years old to create an account</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree to provide accurate and complete information</li>
                  <li>One account per person is allowed</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">4. Subscription and Payments</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Subscription fees are billed monthly or annually in advance</li>
                  <li>All fees are non-refundable except as required by law</li>
                  <li>You may cancel your subscription at any time</li>
                  <li>Price changes will be communicated 30 days in advance</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">5. Content and Intellectual Property</h3>
                <p>All content provided by DreamScape, including but not limited to text, graphics, images, and AI-generated content, is the property of DreamScape and is protected by copyright and other intellectual property laws.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">6. User Conduct</h3>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the service for any unlawful purpose</li>
                  <li>Share your account credentials with others</li>
                  <li>Attempt to reverse engineer or copy our services</li>
                  <li>Upload harmful or malicious content</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">7. Privacy and Data</h3>
                <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">8. Disclaimer of Warranties</h3>
                <p>DreamScape is provided "as is" without any representations or warranties. We make no warranties regarding the accuracy, completeness, or reliability of our mystical services. These services are for entertainment purposes only.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">9. Limitation of Liability</h3>
                <p>DreamScape shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">10. Termination</h3>
                <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">11. Contact Information</h3>
                <p>If you have any questions about these Terms, please contact us at support@dreamscape.app</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
