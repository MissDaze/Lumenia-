import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, Phone, Mail, User as UserIcon, CreditCard, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.href = createPageUrl("Home");
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = createPageUrl("Home");
    }
  };

  const subscriptionPlans = [
    {
      name: "Free",
      id: "free",
      price: "$0.00",
      billing: "Forever",
      features: ["3 uses of each feature", "All mystical tools", "Perfect for trying out"],
      current: user?.subscription_tier === 'free'
    },
    {
      name: "Basic", 
      id: "basic",
      price: "$4.95",
      billing: "per month",
      features: ["Dream journal", "AI dream interpretation", "15 AI image generations", "Full horoscopes"],
      current: user?.subscription_tier === 'basic'
    },
    {
      name: "Standard", 
      id: "standard",
      price: "$11.95",
      billing: "per month",
      features: ["Everything in Basic", "Fortune teller chat", "Tarot & Rune readings", "30 images", "15 chats & readings"],
      current: user?.subscription_tier === 'standard'
    },
    {
      name: "Pro",
      id: "pro",
      price: "$29.95", 
      billing: "per month",
      features: ["All Standard features", "30 of each service", "Priority support", "Unlimited horoscopes"],
      current: user?.subscription_tier === 'pro'
    },
    {
      name: "Complete",
      id: "complete",
      price: "$300",
      billing: "per year",
      features: ["Unlimited everything", "All premium features", "VIP support", "Best value - save $60/year"],
      current: user?.subscription_tier === 'complete'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{background: '#191970'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: '#8A2BE2'}}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen p-4 md:p-8" style={{background: '#191970'}}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4" style={{color: '#8A2BE2'}}>Please Sign In</h1>
          <Button onClick={() => User.login()} style={{background: '#8A2BE2', color: '#C0C0C0'}}>Sign In with Google</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: '#191970'}}>
      <style jsx>{`
        .profile-card {
          background: #191970;
          border: 2px solid #C0C0C0;
        }
        .plan-card {
          background: #191970;
          border: 2px solid #C0C0C0;
          transition: all 0.3s ease;
        }
        .plan-card:hover {
          border-color: #B76E79;
          box-shadow: 0 0 15px rgba(183, 110, 121, 0.4);
        }
        .current-plan {
          border-color: #8A2BE2;
          box-shadow: 0 0 15px rgba(138, 43, 226, 0.4);
        }
        .upgrade-btn {
          background: #8A2BE2;
          color: #C0C0C0;
          border: none;
          transition: all 0.3s ease;
        }
        .upgrade-btn:hover {
          box-shadow: 0 0 15px rgba(183, 110, 121, 0.6);
          border: 2px solid #B76E79;
        }
        .current-btn {
          background: #C0C0C0;
          color: #8A2BE2;
          border: none;
        }
        .logout-btn {
          background: transparent;
          border: 2px solid #C0C0C0;
          color: #C0C0C0;
          transition: all 0.3s ease;
        }
        .logout-btn:hover {
          border-color: #B76E79;
          color: #B76E79;
          box-shadow: 0 0 10px rgba(183, 110, 121, 0.3);
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{color: '#8A2BE2'}}>
          Profile & Subscription
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <Card className="profile-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{color: '#8A2BE2'}}>
                  <UserIcon className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: '#8A2BE2'}}>
                    <span className="text-2xl font-bold" style={{color: '#C0C0C0'}}>
                      {(user.username || user.full_name || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg" style={{color: '#C0C0C0'}}>{user.username || user.full_name}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4" style={{color: '#C0C0C0'}} />
                    <span style={{color: '#C0C0C0'}}>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" style={{color: '#C0C0C0'}} />
                      <span style={{color: '#C0C0C0'}}>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" style={{color: '#C0C0C0'}} />
                    <span style={{color: '#C0C0C0'}}>Joined {new Date(user.created_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4" style={{borderTop: '2px solid #C0C0C0'}}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{color: '#C0C0C0'}}>Current Plan</span>
                    <Badge style={{background: '#8A2BE2', color: '#C0C0C0'}}>
                      <Crown className="w-3 h-3 mr-1" />
                      {user.subscription_tier?.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {user.subscription_tier === 'free' ? (
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded" style={{background: 'rgba(138, 43, 226, 0.2)'}}>
                      <p className="font-medium" style={{color: '#8A2BE2'}}>{3 - (user.free_dream_interpretations_used || 0)}</p>
                      <p style={{color: '#C0C0C0'}}>Dream Uses</p>
                    </div>
                    <div className="p-2 rounded" style={{background: 'rgba(138, 43, 226, 0.2)'}}>
                      <p className="font-medium" style={{color: '#8A2BE2'}}>{3 - (user.free_fortune_chats_used || 0)}</p>
                      <p style={{color: '#C0C0C0'}}>Chat Uses</p>
                    </div>
                    <div className="p-2 rounded" style={{background: 'rgba(138, 43, 226, 0.2)'}}>
                      <p className="font-medium" style={{color: '#8A2BE2'}}>{3 - (user.free_tarot_readings_used || 0)}</p>
                      <p style={{color: '#C0C0C0'}}>Tarot Uses</p>
                    </div>
                    <div className="p-2 rounded" style={{background: 'rgba(138, 43, 226, 0.2)'}}>
                      <p className="font-medium" style={{color: '#8A2BE2'}}>{3 - (user.free_soundscapes_used || 0)}</p>
                      <p style={{color: '#C0C0C0'}}>Playlist Uses</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded" style={{background: 'rgba(138, 43, 226, 0.2)'}}>
                      <p className="font-medium" style={{color: '#8A2BE2'}}>{user.monthly_images_used || 0}</p>
                      <p style={{color: '#C0C0C0'}}>Images</p>
                    </div>
                    <div className="p-2 rounded" style={{background: 'rgba(138, 43, 226, 0.2)'}}>
                      <p className="font-medium" style={{color: '#8A2BE2'}}>{user.monthly_chats_used || 0}</p>
                      <p style={{color: '#C0C0C0'}}>Chats</p>
                    </div>
                    <div className="p-2 rounded" style={{background: 'rgba(138, 43, 226, 0.2)'}}>
                      <p className="font-medium" style={{color: '#8A2BE2'}}>{user.monthly_readings_used || 0}</p>
                      <p style={{color: '#C0C0C0'}}>Readings</p>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleLogout}
                  className="logout-btn w-full mt-4 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Plans */}
          <div className="lg:col-span-2">
            <Card className="profile-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{color: '#8A2BE2'}}>
                  <CreditCard className="w-5 h-5" />
                  Subscription Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {subscriptionPlans.map((plan) => (
                    <Card key={plan.name} 
                          className={`plan-card relative ${plan.current ? 'current-plan' : ''}`}>
                      {plan.current && (
                        <Badge className="absolute -top-2 -right-2" style={{background: '#8A2BE2', color: '#C0C0C0'}}>
                          Current
                        </Badge>
                      )}
                      <CardHeader>
                        <CardTitle className="text-lg" style={{color: '#8A2BE2'}}>{plan.name}</CardTitle>
                        <div>
                          <span className="text-2xl font-bold" style={{color: '#C0C0C0'}}>{plan.price}</span>
                          <span className="text-sm ml-1" style={{color: '#C0C0C0'}}>{plan.billing}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-4">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full" style={{background: '#B76E79'}}></div>
                              <span style={{color: '#C0C0C0'}}>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          asChild
                          className={`w-full ${plan.current ? 'current-btn' : 'upgrade-btn'}`}
                          disabled={plan.current}
                        >
                          {plan.current ? 
                            <span>Current Plan</span> :
                            <Link to={createPageUrl(`Checkout?plan=${plan.id}`)}>
                              Upgrade to {plan.name}
                            </Link>
                          }
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 p-4 rounded-lg" style={{background: 'rgba(138, 43, 226, 0.2)', border: '2px solid #8A2BE2'}}>
                  <h3 className="font-semibold mb-2" style={{color: '#8A2BE2'}}>🚀 Automated Subscription System</h3>
                  <div className="text-sm space-y-1" style={{color: '#C0C0C0'}}>
                    <p><strong>✅ Secure Payment:</strong> Powered by Stripe & PayPal</p>
                    <p><strong>✅ Instant Activation:</strong> Subscription activates immediately after payment</p>
                    <p><strong>✅ Auto-Upgrade:</strong> Your account is automatically upgraded upon successful payment</p>
                    <p><strong>✅ Usage Reset:</strong> Monthly limits reset with each subscription</p>
                  </div>
                </div>

                {user?.subscription_tier !== 'free' && (
                  <div className="mt-4 p-4 rounded-lg" style={{background: 'rgba(183, 110, 121, 0.2)', border: '2px solid #B76E79'}}>
                    <h3 className="font-semibold mb-2" style={{color: '#B76E79'}}>Subscription Details</h3>
                    <div className="text-sm space-y-1" style={{color: '#C0C0C0'}}>
                      <p><strong>Current Plan:</strong> {user.subscription_tier?.toUpperCase()}</p>
                      <p><strong>Status:</strong> Active</p>
                      {user.subscription_expires && (
                        <p><strong>Next Renewal:</strong> {new Date(user.subscription_expires).toLocaleDateString()}</p>
                      )}
                      {user.last_payment_date && (
                        <p><strong>Last Payment:</strong> {new Date(user.last_payment_date).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
