import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { verifyPayment } from "@/api/functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle, Crown, Sparkles, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function PaymentSuccess() {
  const [user, setUser] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    
    if (sessionId) {
      verifyPaymentAndUpdateUser(sessionId);
    } else {
      setError("No payment session found");
      setIsLoading(false);
    }
  }, []);

  const verifyPaymentAndUpdateUser = async (sessionId) => {
    try {
      // First verify the payment with Stripe
      const response = await verifyPayment({ session_id: sessionId });
      
      if (response.data.success) {
        setPaymentDetails(response.data);
        
        // Reload user data to get updated subscription
        const updatedUser = await User.me();
        setUser(updatedUser);
        
      } else {
        setError("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setError("Unable to verify payment. Please contact support if you were charged.");
    }
    setIsLoading(false);
  };

  const planNames = {
    basic: "Basic",
    standard: "Standard", 
    pro: "Pro",
    complete: "Complete"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/40 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-500 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Verifying Your Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your subscription</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/40 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2 text-red-700">Payment Issue</h2>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Link to={createPageUrl("Profile")}>
              <Button variant="outline">Go to Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <Card className="mb-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful! 🎉</h1>
            <p className="text-green-100 text-lg">
              Welcome to your enhanced mystical journey with DreamScape
            </p>
          </CardContent>
        </Card>

        {/* Payment Details */}
        {paymentDetails && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/40 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plan:</span>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                    {planNames[paymentDetails.plan] || paymentDetails.plan}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold">
                    ${(paymentDetails.amount_total / 100).toFixed(2)} {paymentDetails.currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-sm">{paymentDetails.customer_email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/40 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  What's Unlocked
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI Images:</span>
                      <span className="font-semibold">
                        {user.subscription_tier === 'complete' ? 'Unlimited' : 
                         user.subscription_tier === 'standard' || user.subscription_tier === 'pro' ? '30/month' :
                         user.subscription_tier === 'basic' ? '15/month' : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fortune Chats:</span>
                      <span className="font-semibold">
                        {user.subscription_tier === 'complete' ? 'Unlimited' :
                         user.subscription_tier === 'pro' ? '30/month' :
                         user.subscription_tier === 'standard' ? '15/month' : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Divination Readings:</span>
                      <span className="font-semibold">
                        {user.subscription_tier === 'complete' ? 'Unlimited' :
                         user.subscription_tier === 'pro' ? '30/month' :
                         user.subscription_tier === 'standard' ? '15/month' : '0'}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-semibold">All limits reset to 0 - Start fresh!</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Ready to Explore? 🔮</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to={createPageUrl("Dreams")} className="block">
                <Button variant="secondary" className="w-full text-purple-600 hover:text-purple-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Dream Journal
                </Button>
              </Link>
              <Link to={createPageUrl("DivinationHub")} className="block">
                <Button variant="secondary" className="w-full text-purple-600 hover:text-purple-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Divination Arts
                </Button>
              </Link>
              <Link to={createPageUrl("Dashboard")} className="block">
                <Button variant="secondary" className="w-full text-purple-600 hover:text-purple-700">
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-blue-800 mb-3">Need Help?</h3>
            <p className="text-sm text-blue-700 mb-4">
              If you have any questions about your subscription or need technical support, 
              we're here to help you on your mystical journey.
            </p>
            <div className="space-x-4">
              <Link to={createPageUrl("Profile")}>
                <Button variant="outline" size="sm">Manage Subscription</Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button variant="outline" size="sm">Contact Support</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}