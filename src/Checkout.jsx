import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { createStripeCheckout } from "@/api/functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown, Check, Star, Sparkles, AlertCircle, Loader2 } from "lucide-react";

export default function Checkout() {
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planFromUrl = params.get('plan');
    const cancelled = params.get('cancelled');
    
    if (planFromUrl) {
      setSelectedPlan(planFromUrl);
    }
    
    if (cancelled) {
      setError("Payment was cancelled. You can try again below.");
    }

    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("User not authenticated");
    }
  };

  const subscriptionPlans = [
    {
      name: "Basic",
      id: "basic",
      price: "$4.95",
      billing: "per month",
      features: [
        "Dream journal with AI interpretation",
        "15 AI image generations monthly",
        "Basic horoscopes",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Standard", 
      id: "standard",
      price: "$11.95",
      billing: "per month",
      features: [
        "Everything in Basic",
        "Fortune teller chat (15 chats)",
        "Tarot & Rune readings (15 monthly)",
        "30 AI image generations",
        "Love compatibility analysis"
      ],
      popular: true
    },
    {
      name: "Pro",
      id: "pro", 
      price: "$29.95",
      billing: "per month",
      features: [
        "All Standard features",
        "30 fortune teller chats",
        "30 divination readings",
        "30 AI image generations",
        "Personal birth chart analysis",
        "Priority support"
      ],
      popular: false
    },
    {
      name: "Complete",
      id: "complete",
      price: "$300",
      billing: "per year",
      features: [
        "UNLIMITED everything",
        "All premium features",
        "Unlimited AI generations",
        "Unlimited chats & readings",
        "VIP support",
        "Best value - Save $60/year!"
      ],
      popular: false
    }
  ];

  const handleSubscribe = async (planId) => {
    if (!user) {
      await User.login();
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await createStripeCheckout({ plan: planId });
      
      if (response.data.checkout_url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkout_url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError(`Payment setup failed: ${error.response?.data?.error || error.message}`);
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/40 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <Crown className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-6">
                Please sign in to upgrade your subscription.
              </p>
              <Button 
                onClick={() => User.login()}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Sign In with Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Choose Your Mystical Journey
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Unlock the full power of DreamScape with unlimited access to all mystical features
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {user?.subscription_tier !== 'free' && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              <strong>Current Plan:</strong> {user.subscription_tier?.toUpperCase()} - 
              Active until {user.subscription_expires ? new Date(user.subscription_expires).toLocaleDateString() : 'N/A'}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} 
                  className={`relative ${
                    plan.popular ? 'ring-2 ring-purple-500 bg-purple-50/50' : 'bg-white/60'
                  } backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-300`}>
              
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 text-sm ml-1">{plan.billing}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading || user?.subscription_tier === plan.id}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : user?.subscription_tier === plan.id ? (
                    "Current Plan"
                  ) : (
                    `Choose ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Secure Payment Processing
              </h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p>✅ <strong>Powered by Stripe:</strong> Industry-leading payment security</p>
                <p>✅ <strong>Instant Activation:</strong> Access unlocked immediately</p>
                <p>✅ <strong>Cancel Anytime:</strong> No long-term commitments</p>
                <p>✅ <strong>Money-Back Guarantee:</strong> 30-day satisfaction guarantee</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-green-800 mb-3">What Happens Next?</h3>
              <div className="text-sm text-green-700 space-y-2">
                <p><strong>1.</strong> Click your preferred plan above</p>
                <p><strong>2.</strong> Secure checkout via Stripe (2 minutes)</p>
                <p><strong>3.</strong> Instant account upgrade & access</p>
                <p><strong>4.</strong> Start your unlimited mystical journey!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
