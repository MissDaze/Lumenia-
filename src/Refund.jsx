import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Refund() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <RefreshCw className="w-16 h-16 mx-auto mb-4 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Refund Policy
          </h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            <strong>7-Day Money-Back Guarantee:</strong> We offer a full refund within 7 days of your initial subscription purchase.
          </AlertDescription>
        </Alert>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle>DreamScape Refund Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6 text-gray-700">
              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">1. 7-Day Money-Back Guarantee</h3>
                <p>We want you to be completely satisfied with DreamScape. If you're not happy with your subscription for any reason, you can request a full refund within 7 days of your initial purchase.</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Applies to first-time subscribers only</li>
                  <li>Must be requested within 7 days of initial subscription</li>
                  <li>Full refund of subscription fee</li>
                  <li>Processed within 5-7 business days</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">2. Subscription Cancellation</h3>
                <p>You can cancel your subscription at any time from your profile page. Upon cancellation:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You retain access to premium features until the end of your billing period</li>
                  <li>No refund for the remaining unused portion of your subscription</li>
                  <li>Your account reverts to the free tier after expiration</li>
                  <li>All your data remains saved and accessible</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">3. Exceptional Circumstances</h3>
                <p>We may consider refunds beyond the 7-day window in exceptional circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Technical issues preventing service use for extended periods</li>
                  <li>Billing errors or unauthorized charges</li>
                  <li>Medical or financial hardship (reviewed case-by-case)</li>
                  <li>Service changes that significantly impact functionality</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">4. Non-Refundable Items</h3>
                <p>The following are not eligible for refunds:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Free tier services (no payment required)</li>
                  <li>Gift subscriptions given to others</li>
                  <li>Renewal charges beyond the 7-day initial period</li>
                  <li>Partial months of unused service</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">5. How to Request a Refund</h3>
                <p>To request a refund, please:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Contact our support team at support@dreamscape.app</li>
                  <li>Include your account email and reason for refund</li>
                  <li>Provide your order/transaction ID if available</li>
                  <li>Allow 2-3 business days for review</li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">6. Refund Processing</h3>
                <p>Approved refunds will be processed as follows:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunded to the original payment method</li>
                  <li>Processing time: 5-7 business days</li>
                  <li>Bank processing may take additional 1-2 business days</li>
                  <li>You'll receive a confirmation email when processed</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">7. Chargeback Policy</h3>
                <p>If you initiate a chargeback through your bank or credit card company without first contacting us, we may:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Immediately suspend your account access</li>
                  <li>Provide evidence of service delivery to your bank</li>
                  <li>Charge additional fees if the chargeback is invalid</li>
                </ul>
                <p className="mt-3">Please contact us first – we're always happy to resolve issues directly.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">8. Annual Subscription Refunds</h3>
                <p>Annual subscriptions ($300/year Complete plan):</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>7-day full refund guarantee applies</li>
                  <li>After 7 days, no refunds for unused portions</li>
                  <li>Exceptional circumstances reviewed individually</li>
                  <li>Can downgrade to monthly at next renewal</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">9. Contact Us</h3>
                <p>For refund requests or questions about this policy:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: support@dreamscape.app</li>
                  <li>Subject line: "Refund Request"</li>
                  <li>Response time: Within 24 hours</li>
                  <li>Phone: 1-800-DREAMSCAPE (business hours)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-purple-700 mb-3">10. Policy Changes</h3>
                <p>We may update this refund policy from time to time. Changes will be posted on this page with an updated "Last modified" date. Continued use of the service constitutes acceptance of the updated policy.</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
