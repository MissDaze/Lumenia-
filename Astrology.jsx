import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Reading } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stars, Crown, MapPin, Clock, Calendar, User as UserIcon, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";

const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const chineseZodiac = [
    "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
    "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
];

export default function Astrology() {
    const [user, setUser] = useState(null);
    const [birthData, setBirthData] = useState({
        date: "",
        time: "",
        location: "",
        zodiac_sign: "",
        chinese_zodiac: ""
    });
    const [chart, setChart] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const currentUser = await User.me();
            setUser(currentUser);
            
            // Pre-fill with saved birth data if available
            setBirthData({
                date: currentUser.birth_date || "",
                time: currentUser.birth_time || "",
                location: currentUser.birth_location || "",
                zodiac_sign: currentUser.zodiac_sign || "",
                chinese_zodiac: currentUser.chinese_zodiac || ""
            });
        } catch (error) {
            console.log("Authentication error");
        }
    };

    const canGenerateChart = () => {
        if (!user) return false;
        
        // Free tier users get 3 uses ever per feature
        if (user.subscription_tier === 'free') {
            return (user.free_astrology_charts_used || 0) < 3;
        }
        
        return true; // All paid tiers can generate unlimited charts
    };

    const getRemainingUses = () => {
        if (!user) return 0;
        
        if (user.subscription_tier === 'free') {
            return Math.max(0, 3 - (user.free_astrology_charts_used || 0));
        }
        
        return "∞"; // Unlimited for paid tiers
    };

    const getChineseZodiacFromYear = (year) => {
        const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
        return animals[(year - 1900) % 12];
    };

    const getZodiacFromDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
        if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricorn";
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
        if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces";
        return "Unknown";
    };

    const handleDateChange = (date) => {
        setBirthData(prev => {
            const zodiac = getZodiacFromDate(date);
            const year = new Date(date).getFullYear();
            const chinese = getChineseZodiacFromYear(year);
            
            return {
                ...prev,
                date,
                zodiac_sign: zodiac,
                chinese_zodiac: chinese
            };
        });
    };

    const generateBirthChart = async () => {
        if (!birthData.date || !birthData.time || !birthData.location) {
            setError("Please fill in all required birth information");
            return;
        }

        if (!canGenerateChart()) {
            setError("You've used all 3 free birth chart generations. Please upgrade to continue creating personalized charts.");
            return;
        }

        setIsGenerating(true);
        setError("");
        setSuccess("");
        setChart(null);

        try {
            const response = await InvokeLLM({
                prompt: `Create a comprehensive astrological birth chart reading for someone born on:
                - Date: ${birthData.date}
                - Time: ${birthData.time}
                - Location: ${birthData.location}
                - Western Zodiac Sign: ${birthData.zodiac_sign}
                - Chinese Zodiac: ${birthData.chinese_zodiac}

                Provide a detailed, personalized birth chart analysis covering:

                1. CORE PERSONALITY TRAITS
                Analyze their sun sign characteristics and how it shapes their fundamental nature.

                2. EMOTIONAL LANDSCAPE  
                Explore their emotional patterns, inner needs, and intuitive nature.

                3. COMMUNICATION & THINKING STYLE
                Discuss how they process information, communicate, and express ideas.

                4. LOVE & RELATIONSHIPS
                Reveal their approach to romance, partnerships, and what they seek in relationships.

                5. CAREER & LIFE PURPOSE
                Uncover their professional strengths, ideal career paths, and life mission.

                6. CHALLENGES & GROWTH OPPORTUNITIES
                Identify potential obstacles and areas for personal development.

                7. CHINESE ZODIAC INFLUENCE
                Incorporate insights from their Chinese zodiac animal and how it complements their Western sign.

                Write in flowing, natural prose without any formatting symbols or special characters. Be insightful, encouraging, and provide practical guidance they can apply to their life. Keep the tone warm and empowering.`,
                add_context_from_internet: false
            });

            // Save birth data to user profile
            await User.updateMyUserData({
                birth_date: birthData.date,
                birth_time: birthData.time,
                birth_location: birthData.location,
                zodiac_sign: birthData.zodiac_sign,
                chinese_zodiac: birthData.chinese_zodiac
            });

            // Update usage count for free users
            if (user.subscription_tier === 'free') {
                await User.updateMyUserData({
                    free_astrology_charts_used: (user.free_astrology_charts_used || 0) + 1
                });
                setUser(prev => ({
                    ...prev,
                    free_astrology_charts_used: (prev.free_astrology_charts_used || 0) + 1
                }));
            }

            // Save the reading
            await Reading.create({
                reading_type: "astrology",
                question: `Birth Chart for ${birthData.date} at ${birthData.time} in ${birthData.location}`,
                result: response
            });

            setChart(response);
            setSuccess("Your personalized birth chart has been generated! ✨");

        } catch (err) {
            console.error("Error generating birth chart:", err);
            setError("Unable to generate your birth chart. Please try again.");
        }

        setIsGenerating(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-white/40 backdrop-blur-sm border-white/20">
                        <CardContent className="p-12 text-center">
                            <Stars className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
                            <p className="text-gray-600 mb-6">
                                Please sign in to access your personalized astrological birth chart.
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

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Personal Birth Chart
                    </h1>
                    <p className="text-gray-600">Discover your complete cosmic blueprint</p>
                </div>

                {user.subscription_tier === 'free' && remainingUses > 0 && (
                    <Alert className="mb-6 bg-indigo-50 border-indigo-200">
                        <Stars className="h-4 w-4" />
                        <AlertDescription className="text-indigo-800">
                            <strong>🌟 Free Trial:</strong> You have {remainingUses} free birth chart generations remaining. <a href={createPageUrl("Profile")} className="underline font-medium">Upgrade for unlimited access</a> to personalized astrological insights.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Error and Success Alerts */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {success && (
                    <Alert className="bg-green-50 border-green-200 text-green-800 mb-6">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                <Card className="bg-white/40 backdrop-blur-sm border-white/20 mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                                <UserIcon className="w-5 h-5" />
                                Your Birth Information
                            </div>
                            {user.subscription_tier === 'free' && (
                                <Badge variant="outline">
                                    {remainingUses} free uses left
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="birth-date">Birth Date *</Label>
                                <Input
                                    id="birth-date"
                                    type="date"
                                    value={birthData.date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className="mt-1 bg-white/60"
                                    disabled={isGenerating}
                                />
                            </div>
                            <div>
                                <Label htmlFor="birth-time">Birth Time *</Label>
                                <Input
                                    id="birth-time"
                                    type="time"
                                    value={birthData.time}
                                    onChange={(e) => setBirthData({...birthData, time: e.target.value})}
                                    className="mt-1 bg-white/60"
                                    disabled={isGenerating}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="birth-location">Birth Location *</Label>
                            <Input
                                id="birth-location"
                                placeholder="e.g., New York, NY, USA"
                                value={birthData.location}
                                onChange={(e) => setBirthData({...birthData, location: e.target.value})}
                                className="mt-1 bg-white/60"
                                disabled={isGenerating}
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter your city, state/province, and country</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label>Your Western Zodiac Sign</Label>
                                <div className="mt-1 p-3 bg-purple-50 rounded-lg">
                                    <p className="font-semibold text-purple-800">
                                        {birthData.zodiac_sign || "Select birth date"}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <Label>Your Chinese Zodiac</Label>
                                <div className="mt-1 p-3 bg-red-50 rounded-lg">
                                    <p className="font-semibold text-red-800">
                                        {birthData.chinese_zodiac || "Select birth date"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {showUpgradeMessage ? (
                            <Alert>
                                <AlertDescription>
                                    You've used all 3 free birth chart generations. <a href={createPageUrl("Profile")} className="underline font-medium">Upgrade to any paid plan</a> for unlimited personalized birth charts.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Button
                                onClick={generateBirthChart}
                                disabled={isGenerating || !birthData.date || !birthData.time || !birthData.location || !canGenerateChart()}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                size="lg"
                            >
                                {isGenerating ? (
                                    <>
                                        <Stars className="w-5 h-5 mr-2 animate-spin" />
                                        Mapping Your Cosmic Blueprint...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Generate My Birth Chart
                                    </>
                                )}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <AnimatePresence>
                    {chart && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="bg-white/30 backdrop-blur-sm border-white/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        Your Personal Birth Chart
                                    </CardTitle>
                                    <div className="flex gap-2 mt-2">
                                        <Badge className="bg-purple-100 text-purple-800">
                                            {birthData.zodiac_sign}
                                        </Badge>
                                        <Badge className="bg-red-100 text-red-800">
                                            {birthData.chinese_zodiac}
                                        </Badge>
                                        <Badge variant="outline">
                                            {birthData.date} • {birthData.time}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Card className="bg-indigo-50 p-6">
                                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                                            <Stars className="w-4 h-4 text-indigo-600" />
                                            Your Cosmic Blueprint
                                        </h4>
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {chart}
                                        </div>
                                    </Card>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}