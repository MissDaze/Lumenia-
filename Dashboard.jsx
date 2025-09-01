import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Dream } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BookOpen, 
  Stars, 
  Crown,
  Moon,
  Sun,
  Music,
  Gem
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [recentDreams, setRecentDreams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      console.log("Loading dashboard data...");
      
      let currentUser;
      try {
        currentUser = await User.me();
        console.log("User authenticated:", currentUser);
      } catch (authError) {
        console.log("No authenticated user, showing test dashboard");
        currentUser = {
          id: "test-user",
          email: "test@lumenia.com",
          full_name: "Test User",
          subscription_tier: "free",
          monthly_images_used: 0,
          monthly_chats_used: 0,
          monthly_readings_used: 0,
          free_dream_interpretations_used: 0,
          free_dream_images_used: 0,
          free_fortune_chats_used: 0,
          free_tarot_readings_used: 0,
          free_rune_readings_used: 0,
          free_astrology_charts_used: 0,
          free_soundscapes_used: 0
        };
      }

      setUser(currentUser);
      
      try {
        if (currentUser.email !== "test@lumenia.com") {
          const dreams = await Dream.filter({ created_by: currentUser.email }, '-created_date', 3);
          setRecentDreams(dreams);
        }
      } catch (dreamError) {
        console.log("Could not load dreams:", dreamError);
        setRecentDreams([]);
      }
      
    } catch (error) {
      console.error("Dashboard error:", error);
      setError("Unable to load dashboard. Please try refreshing the page.");
    }
    setIsLoading(false);
  };

  const mainSections = [
    {
      title: "Dream Journal",
      description: "Record, interpret, and visualize your dreams with AI-powered insights",
      icon: BookOpen,
      url: createPageUrl("Dreams"),
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      available: true,
      features: ["Dream Recording", "AI Interpretation", "Dream Images", "Symbol Analysis"]
    },
    {
      title: "Divination Arts",
      description: "Explore fortune telling, tarot cards, and ancient rune wisdom",
      icon: Gem,
      url: createPageUrl("DivinationHub"),
      gradient: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      available: true,
      features: ["Fortune Teller Chat", "Tarot Readings", "Norse Runes", "Mystical Guidance"]
    },
    {
      title: "Cosmic Wisdom",
      description: "Astrology, horoscopes, and cosmic guidance for your life path",
      icon: Stars,
      url: createPageUrl("AstrologyHub"),
      gradient: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      available: true,
      features: ["Daily Horoscopes", "Birth Charts", "Love Compatibility", "Career Guidance"]
    },
    {
      title: "The Sanctuary",
      description: "Personalized soundscapes and mood enhancement for inner peace",
      icon: Music,
      url: createPageUrl("SonicAlchemy"),
      gradient: "from-teal-500 to-blue-500",
      bgColor: "bg-teal-50",
      available: true,
      features: ["AI Soundscapes", "Mood Enhancement", "Personalized Playlists", "Meditation Sounds"]
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{background: '#191970'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#8A2BE2'}}></div>
          <p style={{color: '#C0C0C0'}}>Loading your mystical dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8" style={{background: '#191970'}}>
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center space-y-4">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = createPageUrl("Home")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen p-4 md:p-8" style={{background: '#191970'}}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4" style={{color: '#8A2BE2'}}>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: '#191970'}}>
      <style jsx>{`
        .dashboard-wordmark {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .status-card {
          background: #191970;
          border: 2px solid #C0C0C0;
        }
        .feature-card {
          background: #191970;
          border: 2px solid #C0C0C0;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: scale(1.02);
          border-color: #B76E79;
          box-shadow: 0 0 25px rgba(183, 110, 121, 0.4);
        }
        .feature-btn {
          background: #8A2BE2;
          color: #C0C0C0;
          border: none;
          transition: all 0.3s ease;
        }
        .feature-btn:hover {
          box-shadow: 0 0 20px rgba(183, 110, 121, 0.6);
          border: 2px solid #B76E79;
        }
        .upgrade-card {
          background: #8A2BE2;
          color: #C0C0C0;
          border: none;
        }
        .upgrade-btn {
          background: #C0C0C0;
          color: #8A2BE2;
          border: none;
          transition: all 0.3s ease;
        }
        .upgrade-btn:hover {
          box-shadow: 0 0 20px rgba(183, 110, 121, 0.6);
          border: 2px solid #B76E79;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Moon className="w-8 h-8" style={{color: '#8A2BE2'}} />
            <Sun className="w-8 h-8" style={{color: '#B76E79'}} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 dashboard-wordmark" style={{color: '#8A2BE2'}}>
            Welcome to Lumenia
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{color: '#C0C0C0'}}>
            Your mystical compass to unlock dreams, cosmic wisdom, and spiritual insights
          </p>
        </div>

        {/* Test User Alert */}
        {user?.email === "test@lumenia.com" && (
          <Alert className="mb-6" style={{background: 'rgba(138, 43, 226, 0.2)', border: '2px solid #8A2BE2'}}>
            <AlertDescription style={{color: '#8A2BE2'}}>
              <strong>🧪 Test Mode:</strong> You're viewing the dashboard in test mode. For full functionality, please sign in with Google.
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={() => window.location.href = createPageUrl("Home")}
                style={{borderColor: '#8A2BE2', color: '#8A2BE2', background: 'transparent'}}
              >
                Sign In with Google
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* User Status Card */}
        {user && (
          <Card className="status-card mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold" style={{color: '#8A2BE2'}}>Hello, {user.username || user.full_name || 'Mystic Explorer'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Crown className="w-4 h-4" style={{color: '#B76E79'}} />
                    <span className="capitalize font-medium" style={{color: '#C0C0C0'}}>{user.subscription_tier} Tier</span>
                    {user.subscription_tier === 'free' && (
                      <Link to={createPageUrl("Profile")}>
                        <Badge className="cursor-pointer transition-all" 
                              style={{background: '#8A2BE2', color: '#C0C0C0'}}
                              onMouseEnter={(e) => e.target.style.boxShadow = '0 0 10px #B76E79'}
                              onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
                          Upgrade
                        </Badge>
                      </Link>
                    )}
                  </div>
                </div>
                
                {user.subscription_tier === 'free' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                    <div>
                      <p style={{color: '#C0C0C0'}}>Dreams</p>
                      <p className="font-semibold" style={{color: '#8A2BE2'}}>{3 - (user.free_dream_interpretations_used || 0)} left</p>
                    </div>
                    <div>
                      <p style={{color: '#C0C0C0'}}>Fortune</p>
                      <p className="font-semibold" style={{color: '#8A2BE2'}}>{3 - (user.free_fortune_chats_used || 0)} left</p>
                    </div>
                    <div>
                      <p style={{color: '#C0C0C0'}}>Tarot</p>
                      <p className="font-semibold" style={{color: '#8A2BE2'}}>{3 - (user.free_tarot_readings_used || 0)} left</p>
                    </div>
                    <div>
                      <p style={{color: '#C0C0C0'}}>Charts</p>
                      <p className="font-semibold" style={{color: '#8A2BE2'}}>{3 - (user.free_astrology_charts_used || 0)} left</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm" style={{color: '#C0C0C0'}}>Images</p>
                      <p className="font-semibold" style={{color: '#8A2BE2'}}>
                        {user.monthly_images_used || 0}/{
                          user.subscription_tier === 'complete' ? '∞' : 
                          user.subscription_tier === 'standard' || user.subscription_tier === 'pro' ? '30' :
                          user.subscription_tier === 'basic' ? '15' : '0'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm" style={{color: '#C0C0C0'}}>Chats</p>
                      <p className="font-semibold" style={{color: '#8A2BE2'}}>
                        {user.monthly_chats_used || 0}/{
                          user.subscription_tier === 'complete' ? '∞' :
                          user.subscription_tier === 'pro' ? '30' :
                          user.subscription_tier === 'standard' ? '15' : '0'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm" style={{color: '#C0C0C0'}}>Readings</p>
                      <p className="font-semibold" style={{color: '#8A2BE2'}}>
                        {user.monthly_readings_used || 0}/{
                          user.subscription_tier === 'complete' ? '∞' :
                          user.subscription_tier === 'pro' ? '30' :
                          user.subscription_tier === 'standard' ? '15' : '0'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {mainSections.map((section, index) => (
            <Card key={section.title} className="feature-card overflow-hidden relative">
              <CardHeader className="relative pb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                     style={{background: '#8A2BE2'}}>
                  <section.icon className="w-8 h-8" style={{color: '#C0C0C0'}} />
                </div>
                <CardTitle className="text-2xl font-bold" style={{color: '#8A2BE2'}}>{section.title}</CardTitle>
                <p className="text-base leading-relaxed" style={{color: '#C0C0C0'}}>{section.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-4 rounded-lg mb-4" style={{background: 'rgba(138, 43, 226, 0.2)', border: '2px solid #8A2BE2'}}>
                  <h4 className="font-semibold mb-2" style={{color: '#8A2BE2'}}>Features Include:</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {section.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{background: '#B76E79'}}></div>
                        <span className="text-sm" style={{color: '#C0C0C0'}}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Link to={section.url}>
                  <Button className="feature-btn w-full font-semibold py-3">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action for Free Users */}
        {user?.subscription_tier === 'free' && (
          <Card className="upgrade-card mt-8 border-none">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4" style={{color: '#C0C0C0'}}>Unlock Your Full Mystical Potential</h3>
              <p className="mb-6" style={{color: '#C0C0C0'}}>Try each feature 3 times for free, then upgrade for unlimited access to all mystical tools and AI-generated insights</p>
              <Link to={createPageUrl("Profile")}>
                <Button size="lg" className="upgrade-btn">
                  <Crown className="w-5 h-5 mr-2" />
                  View Subscription Plans
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}