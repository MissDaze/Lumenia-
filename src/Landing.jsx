
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BookOpen, 
  Sparkles, 
  Stars, 
  MessageCircle,
  Target,
  Layers,
  Crown,
  TrendingUp,
  Moon,
  Sun,
  ArrowRight,
  CheckCircle,
  Music,
  Mail,
  Facebook,
  Twitter,
  Instagram
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  const features = [
    {
      title: "Dream Journal & AI Interpretation",
      description: "Record your dreams and receive personalized AI analysis to unlock hidden meanings",
      icon: BookOpen,
      gradient: "from-purple-400 to-pink-400"
    },
    {
      title: "Mystical Fortune Teller",
      description: "Chat with Mystara, our AI oracle, for guidance on life's mysteries",
      icon: MessageCircle,
      gradient: "from-blue-400 to-purple-400"
    },
    {
      title: "Tarot & Rune Readings",
      description: "Discover your path through ancient divination methods powered by AI wisdom",
      icon: Sparkles,
      gradient: "from-pink-400 to-red-400"
    },
    {
      title: "Personal Astrology Charts",
      description: "Get your complete cosmic blueprint with detailed life guidance",
      icon: Target,
      gradient: "from-indigo-400 to-purple-400"
    },
    {
      title: "Daily Horoscopes",
      description: "Both Western and Chinese zodiac insights updated daily",
      icon: Stars,
      gradient: "from-yellow-400 to-orange-400"
    },
    {
      title: "Sonic Alchemy",
      description: "AI-curated playlists that transform your mood through music",
      icon: Music,
      gradient: "from-teal-400 to-blue-400"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      text: "DreamScape helped me understand recurring dreams I've had for years. The AI interpretations were incredibly insightful!",
      tier: "Pro Member"
    },
    {
      name: "Marcus T.",
      text: "The astrology chart was so detailed and accurate. It's like having a personal cosmic advisor.",
      tier: "Complete Member"
    },
    {
      name: "Luna K.",
      text: "I love the Sonic Alchemy feature! It always knows exactly what music I need to hear.",
      tier: "Standard Member"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      billing: "Forever",
      features: ["Basic horoscopes", "Limited access"],
      popular: false
    },
    {
      name: "Basic",
      price: "$4.95",
      billing: "per month",
      features: ["Dream journal", "15 AI images", "Full horoscopes"],
      popular: false
    },
    {
      name: "Standard",
      price: "$11.95",
      billing: "per month", 
      features: ["Everything in Basic", "Fortune teller", "Tarot & Runes", "30 images", "15 readings"],
      popular: true
    },
    {
      name: "Pro",
      price: "$29.95",
      billing: "per month",
      features: ["Everything in Standard", "30 readings & chats", "Priority support"],
      popular: false
    },
    {
      name: "Complete",
      price: "$300",
      billing: "per year",
      features: ["Unlimited everything", "All premium features", "Best value"],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Moon className="w-12 h-12 text-purple-300" />
            <Sun className="w-12 h-12 text-yellow-300" />
            <Stars className="w-12 h-12 text-blue-300" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Welcome to
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              DreamScape
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Unlock the mysteries of your subconscious, explore cosmic wisdom, and discover your true destiny with AI-powered mystical guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link to={createPageUrl("Home")}>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg">
                  Enter Your Sanctuary
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                onClick={() => User.login()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
              >
                Begin Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
              Explore Features
            </Button>
          </div>
          <div className="mt-8 text-gray-300">
            <p className="text-sm">✨ Join thousands discovering their cosmic truth</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Complete Mystical Toolkit
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combine ancient wisdom with modern AI to unlock insights about your past, present, and future
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">What Our Community Says</h2>
            <p className="text-xl text-gray-600">Real experiences from fellow seekers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Stars key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">&quot;{testimonial.text}&quot;</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">{testimonial.name}</span>
                    <Badge className="bg-purple-100 text-purple-800">{testimonial.tier}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-purple-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Choose Your Path</h2>
            <p className="text-xl text-gray-300">Unlock deeper mysteries with premium features</p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-gold-400 scale-105' : ''} bg-white/10 backdrop-blur-sm border-white/20 text-white`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-gold-500 text-gray-900">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-300 ml-2">{plan.billing}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-yellow-400 to-gold-500 text-gray-900 hover:from-yellow-500 hover:to-gold-600' : 'bg-white/20 hover:bg-white/30'}`}
                  >
                    {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold">DreamScape</span>
              </div>
              <p className="text-gray-400 mb-4">
                Unlock the mysteries of your subconscious and explore cosmic wisdom through AI-powered guidance.
              </p>
              <div className="flex gap-4">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-400 cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to={createPageUrl("Dreams")} className="hover:text-white transition-colors">Dream Journal</Link></li>
                <li><Link to={createPageUrl("Fortune")} className="hover:text-white transition-colors">Fortune Teller</Link></li>
                <li><Link to={createPageUrl("Tarot")} className="hover:text-white transition-colors">Tarot Reading</Link></li>
                <li><Link to={createPageUrl("Astrology")} className="hover:text-white transition-colors">Astrology Chart</Link></li>
                <li><Link to={createPageUrl("SonicAlchemy")} className="hover:text-white transition-colors">Sonic Alchemy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to={createPageUrl("Contact")} className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to={createPageUrl("FAQ")} className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to={createPageUrl("Refund")} className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to={createPageUrl("Terms")} className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to={createPageUrl("Privacy")} className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to={createPageUrl("Disclaimer")} className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 DreamScape. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Made with ✨ for seekers of cosmic wisdom
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
