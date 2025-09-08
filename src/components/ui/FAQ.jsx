import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HelpCircle, ChevronDown, ChevronRight } from "lucide-react";

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create a DreamScape account?",
          answer: "Simply click 'Sign In with Google' on any page. We use secure Google authentication to create your account instantly."
        },
        {
          question: "Is DreamScape free to use?",
          answer: "Yes! DreamScape offers a free tier with basic horoscopes and limited features. Premium subscriptions unlock advanced features like AI dream interpretation, tarot readings, and unlimited content generation."
        },
        {
          question: "What makes DreamScape different from other mystical apps?",
          answer: "DreamScape combines ancient wisdom with cutting-edge AI technology. Our interpretations are deeply personalized and go beyond generic readings to provide actionable life guidance."
        }
      ]
    },
    {
      category: "Features & Services",
      questions: [
        {
          question: "How accurate are the AI interpretations?",
          answer: "Our AI is trained on extensive mystical knowledge and provides insights based on traditional interpretation methods. While highly sophisticated, remember that all readings are for entertainment and personal reflection."
        },
        {
          question: "Can I save my readings and dreams?",
          answer: "Yes! All your dreams, readings, and astrology charts are saved to your personal account. You can access them anytime and track patterns over time."
        },
        {
          question: "How does the dream interpretation work?",
          answer: "Describe your dream in detail, and our AI analyzes the symbols, emotions, and themes using psychological and mystical frameworks to provide personalized insights."
        },
        {
          question: "What birth information do I need for my astrology chart?",
          answer: "You'll need your exact birth date, time (hour and minute), and location (city/country). The more precise your birth time, the more accurate your chart will be."
        }
      ]
    },
    {
      category: "Subscriptions & Billing",
      questions: [
        {
          question: "What's included in each subscription tier?",
          answer: "Free: Basic horoscopes. Basic ($4.95/mo): Dream journal + 15 AI images. Standard ($11.95/mo): All Basic features + Fortune teller + Tarot/Runes + 30 images + 15 readings. Pro ($29.95/mo): 30 of each service + priority support. Complete ($300/year): Unlimited everything."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes, you can cancel anytime from your profile page. Your premium features will continue until the end of your billing period."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 7-day money-back guarantee for new subscribers. Please see our Refund Policy for complete details."
        },
        {
          question: "How do monthly limits reset?",
          answer: "Your monthly usage limits (images, chats, readings) reset on the same date each month that you subscribed."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          question: "Is my personal information secure?",
          answer: "Absolutely. We use industry-standard encryption and never share your personal data with third parties. Your dreams, readings, and personal information are completely private."
        },
        {
          question: "Can other users see my dreams or readings?",
          answer: "No, all your content is completely private. Only you can access your dreams, readings, and personal insights."
        },
        {
          question: "How can I delete my account and data?",
          answer: "You can delete your account from your profile page. All your data will be permanently removed within 30 days."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "The app isn't loading properly. What should I do?",
          answer: "Try refreshing your browser, clearing your cache, or using an incognito/private window. If issues persist, contact our support team."
        },
        {
          question: "Can I use DreamScape on mobile?",
          answer: "Yes! DreamScape works on all devices through your web browser. For the best experience, add it to your home screen on mobile."
        },
        {
          question: "Why isn't my AI-generated content appearing?",
          answer: "AI generation can take a few moments. If it's been more than 30 seconds, try refreshing the page or check if you've reached your monthly limits."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600">Find answers to common questions about DreamScape</p>
        </div>

        <div className="space-y-6">
          {faqs.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-purple-700">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const itemKey = `${categoryIndex}-${questionIndex}`;
                    return (
                      <Collapsible 
                        key={questionIndex}
                        open={openItems[itemKey]}
                        onOpenChange={() => toggleItem(itemKey)}
                      >
                        <CollapsibleTrigger className="flex justify-between items-start w-full p-4 bg-white/60 rounded-lg hover:bg-white/80 transition-colors text-left">
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          {openItems[itemKey] ? (
                            <ChevronDown className="w-5 h-5 text-purple-600 flex-shrink-0 ml-2" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-purple-600 flex-shrink-0 ml-2" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-4">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-purple-800 mb-2">Still have questions?</h3>
            <p className="text-purple-700 mb-4">
              Our support team is here to help you on your mystical journey
            </p>
            <a 
              href={`/Contact`} 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Contact Support
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
