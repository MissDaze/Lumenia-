
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stars, Target, Heart, Briefcase, Crown, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AstrologyHub() {
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
            console.log("Authentication error");
        }
        setIsLoading(false);
    };

    const astrologyServices = [
        {
            title: "Personal Birth Chart",
            description: "Discover your complete cosmic blueprint with a detailed astrological birth chart analysis revealing your personality, strengths, and life path.",
            icon: Target,
            path: "Astrology",
            freeUsesRemaining: user ? Math.max(0, 3 - (user.free_astrology_charts_used || 0)) : 3,
            available: true // Always available - has its own usage limits
        },
        {
            title: "Daily Horoscopes",
            description: "Get personalized daily horoscope readings for both Western and Chinese zodiac signs with cosmic insights for your day ahead.",
            icon: Calendar,
            path: "Horoscopes",
            available: true, // Always unlimited
            unlimited: true
        },
        {
            title: "Love Compatibility",
            description: "Explore romantic compatibility through astrological analysis, understanding how your signs interact in love and relationships.",
            icon: Heart,
            path: "Compatibility",
            available: true, // Always unlimited
            unlimited: true
        },
        {
            title: "Career Guidance",
            description: "Unlock your professional potential with astrological career guidance, revealing your ideal work environment and career paths.",
            icon: Briefcase,
            path: "CareerGuidance",
            available: true, // Always unlimited
            unlimited: true
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{background: '#191970'}}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen p-4 md:p-8" style={{background: '#191970'}}>
                <div className="max-w-4xl mx-auto">
                    <Card className="feature-card">
                        <CardContent className="p-12 text-center">
                            <Stars className="w-16 h-16 mx-auto mb-4" style={{color: '#C0C0C0'}} />
                            <h2 className="text-2xl font-bold mb-4" style={{color: '#8A2BE2'}}>Sign In Required</h2>
                            <p className="mb-6" style={{color: '#C0C0C0'}}>
                                Please sign in to access your cosmic wisdom and astrological insights.
                            </p>
                            <Button 
                                onClick={() => User.login()}
                                className="feature-btn"
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
        <div className="min-h-screen p-4 md:p-8" style={{background: '#191970'}}>
            <style jsx>{`
                .feature-card {
                    background: #191970;
                    border: 2px solid #C0C0C0;
                    transition: all 0.3s ease;
                }
                .feature-card:hover {
                    transform: scale(1.05);
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
            
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Stars className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#8A2BE2'}}>
                        Cosmic Wisdom
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto" style={{color: '#C0C0C0'}}>
                        Unlock the secrets of the stars with personalized astrology, horoscopes, and cosmic guidance
                    </p>
                </div>

                {user?.subscription_tier === 'free' && (
                    <Alert className="mb-8" style={{background: 'rgba(138, 43, 226, 0.2)', border: '2px solid #8A2BE2'}}>
                        <Stars className="h-4 w-4" />
                        <AlertDescription style={{color: '#8A2BE2'}}>
                            <strong>🌟 Free Access:</strong> Try birth chart generation 3 times for free! Horoscopes and compatibility readings are always unlimited. <a href={createPageUrl("Profile")} className="underline font-medium">Upgrade for unlimited birth charts</a>.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {astrologyServices.map((service, index) => (
                        <Card key={service.title} className="feature-card overflow-hidden">
                            <CardHeader className="text-center pb-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                                     style={{background: '#8A2BE2'}}>
                                    <service.icon className="w-8 h-8" style={{color: '#C0C0C0'}} />
                                </div>
                                <CardTitle className="text-xl font-bold" style={{color: '#8A2BE2'}}>{service.title}</CardTitle>
                                <div className="flex justify-center gap-2 mt-2">
                                    {service.unlimited ? (
                                        <Badge style={{background: 'rgba(183, 110, 121, 0.2)', color: '#B76E79', border: '1px solid #B76E79'}}>
                                            Always Free
                                        </Badge>
                                    ) : user?.subscription_tier === 'free' && (
                                        <Badge style={{background: 'rgba(192, 192, 192, 0.2)', color: '#C0C0C0', border: '1px solid #C0C0C0'}}>
                                            {service.freeUsesRemaining} free uses left
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 rounded-lg mb-4" style={{background: 'rgba(138, 43, 226, 0.2)', border: '1px solid #8A2BE2'}}>
                                    <p className="text-sm leading-relaxed" style={{color: '#C0C0C0'}}>{service.description}</p>
                                </div>
                                
                                <Link to={createPageUrl(service.path)}>
                                    <Button className="feature-btn w-full font-semibold py-3">
                                        Explore Cosmic Wisdom
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {user?.subscription_tier === 'free' && (
                    <Card className="upgrade-card mt-12 border-none">
                        <CardContent className="p-8 text-center">
                            <h3 className="text-2xl font-bold mb-4">Unlock Your Complete Cosmic Journey</h3>
                            <p className="mb-6">Upgrade to generate unlimited personalized birth charts and access premium astrological insights</p>
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
