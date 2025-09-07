import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 mx-auto mb-4 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle>DreamScape Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6 text-gray-700">
              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">1. Information We Collect</h3>
                <p>We collect information you provide directly to us, such as:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (name, email, birth details for astrology)</li>
                  <li>Dream journal entries and personal reflections</li>
                  <li>Questions asked to our AI services</li>
                  <li>Usage data and preferences</li>
                  <li>Payment information (processed securely through third parties)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">2. How We Use Your Information</h3>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide personalized mystical guidance and readings</li>
                  <li>Generate AI-powered interpretations and recommendations</li>
                  <li>Improve our services and user experience</li>
                  <li>Send you important updates about your account</li>
                  <li>Respond to your support requests</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">3. Information Sharing</h3>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To trusted service providers who assist us in operating our service</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a merger or sale of our business</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">4. Data Security</h3>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">5. Data Retention</h3>
                <p>We retain your personal information for as long as your account is active or as needed to provide you services. You may delete your account at any time, and we will delete your data within 30 days.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">6. Cookies and Tracking</h3>
                <p>We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">7. Your Rights</h3>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Port your data to another service</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">8. Children's Privacy</h3>
                <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">9. International Users</h3>
                <p>If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">10. Changes to This Policy</h3>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">11. Contact Us</h3>
                <p>If you have any questions about this Privacy Policy, please contact us at privacy@dreamscape.app</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
