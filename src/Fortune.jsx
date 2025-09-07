import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Reading } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Sparkles, Crown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createPageUrl } from "@/utils";

export default function Fortune() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserData();
    initializeFortuneTeller();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("Authentication error");
    }
  };

  const initializeFortuneTeller = () => {
    setMessages([
      {
        role: "assistant",
        content: "🔮 Welcome, seeker of wisdom. I am Mystara, your mystical fortune teller. The cosmic energies swirl around us, ready to reveal the secrets of your destiny. What questions do you bring to the ethereal realm today?",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const canSendMessage = () => {
    if (!user) return false;
    
    if (user.subscription_tier === 'free') {
      return (user.free_fortune_chats_used || 0) < 3;
    }
    
    // For paid tiers, check monthly limits
    const limits = {
      basic: 0, // Basic doesn't include fortune chat
      standard: 15, 
      pro: 30,
      complete: Infinity
    };
    return (user.monthly_chats_used || 0) < limits[user.subscription_tier];
  };

  const getRemainingUses = () => {
    if (!user) return 0;
    
    if (user.subscription_tier === 'free') {
      return Math.max(0, 3 - (user.free_fortune_chats_used || 0));
    }
    
    const limits = {
      standard: 15,
      pro: 30,
      complete: Infinity
    };
    const limit = limits[user.subscription_tier] || 0;
    return limit === Infinity ? "∞" : Math.max(0, limit - (user.monthly_chats_used || 0));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !canSendMessage() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await InvokeLLM({
        prompt: `You are Mystara, a wise and mystical fortune teller with deep knowledge of the cosmos, divination, and spiritual guidance. You speak in an ethereal, mystical manner while providing meaningful insights.

        The user asks: "${inputMessage}"

        Respond as a mystical fortune teller would, incorporating elements of astrology, spirituality, and cosmic wisdom. Be encouraging yet realistic. Use mystical language but provide genuine insight and guidance. Keep responses between 100-200 words.

        Write in flowing, natural prose without any formatting symbols, asterisks, or special characters. Speak directly to the seeker with warmth and wisdom.`,
        add_context_from_internet: false
      });

      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update usage count based on subscription tier
      if (user.subscription_tier === 'free') {
        await User.updateMyUserData({ 
          free_fortune_chats_used: (user.free_fortune_chats_used || 0) + 1 
        });
        setUser(prev => ({
          ...prev,
          free_fortune_chats_used: (prev.free_fortune_chats_used || 0) + 1
        }));
      } else {
        await User.updateMyUserData({ 
          monthly_chats_used: (user.monthly_chats_used || 0) + 1 
        });
        setUser(prev => ({
          ...prev,
          monthly_chats_used: (prev.monthly_chats_used || 0) + 1
        }));
      }

      // Save reading
      await Reading.create({
        reading_type: "fortune_chat",
        question: inputMessage,
        result: response,
        chat_messages: [...messages, userMessage, assistantMessage]
      });

    } catch (error) {
      console.error("Error getting fortune:", error);
      const errorMessage = {
        role: "assistant",
        content: "The cosmic energies seem clouded at the moment. Please try again, dear seeker.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/40 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-6">
                Please sign in to commune with Mystara, the fortune teller.
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

  const remainingUses = getRemainingUses();
  const showUpgradeMessage = user.subscription_tier === 'free' && remainingUses === 0;
  const showBasicUpgradeMessage = user.subscription_tier === 'basic'; // Basic tier doesn't include fortune chat

  if (showBasicUpgradeMessage) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/40 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h2 className="text-2xl font-bold mb-4">Fortune Teller Requires Standard Tier</h2>
              <p className="text-gray-600 mb-6">
                To commune with Mystara and unlock your cosmic destiny, you'll need a Standard subscription or higher.
              </p>
              <Button 
                onClick={() => window.location.href = createPageUrl("Profile")}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Subscription
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mystara the Fortune Teller
            </h1>
            <p className="text-gray-600 mt-1">Commune with the cosmic oracle</p>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {user.subscription_tier === 'free' ? `${remainingUses} free uses left` : `${remainingUses} chats remaining`}
          </Badge>
        </div>

        {user.subscription_tier === 'free' && remainingUses > 0 && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Sparkles className="h-4 w-4" />
            <AlertDescription className="text-green-800">
              <strong>🎁 Free Trial:</strong> You have {remainingUses} free fortune telling sessions remaining. <a href={createPageUrl("Profile")} className="underline font-medium">Upgrade to Standard</a> for 15 monthly chats.
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-white/30 backdrop-blur-sm border-white/20 h-[70vh] flex flex-col">
          <CardHeader className="border-b border-white/20">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Mystical Consultation
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} 
                     className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-white/60 text-gray-800'
                  }`}>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">Mystara</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/60 px-4 py-3 rounded-lg max-w-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                      <span className="text-sm">Mystara is consulting the cosmos...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <div className="p-4 border-t border-white/20">
            {showUpgradeMessage ? (
              <Alert>
                <AlertDescription>
                  You've used all 3 free fortune telling sessions. <a href={createPageUrl("Profile")} className="underline font-medium">Upgrade to Standard</a> to continue consulting with Mystara.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask Mystara about your destiny..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading || !canSendMessage()}
                  className="bg-white/60"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim() || !canSendMessage()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
