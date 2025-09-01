import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Reading } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Crown, Shuffle, Heart, Briefcase, Users, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { createPageUrl } from "@/utils";

const tarotCards = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", 
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", 
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", 
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"
];

const readingTypes = [
    { value: "custom", label: "Custom Question", icon: HelpCircle },
    { value: "love", label: "Love & Relationships", icon: Heart },
    { value: "career", label: "Career & Money", icon: Briefcase },
    { value: "family", label: "Family & Friends", icon: Users },
    { value: "general", label: "General Life Guidance", icon: Sparkles },
    { value: "spiritual", label: "Spiritual Growth", icon: Sparkles },
    { value: "health", label: "Health & Wellbeing", icon: Heart },
    { value: "decision", label: "Important Decision", icon: HelpCircle }
];

export default function Tarot() {
    const [user, setUser] = useState(null);
    const [readingType, setReadingType] = useState("custom");
    const [customQuestion, setCustomQuestion] = useState("");
    const [drawnCards, setDrawnCards] = useState([]);
    const [interpretation, setInterpretation] = useState("");
    const [isReading, setIsReading] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

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
    };
    
    const canGetReading = () => {
        if (!user) return false;
        
        // Free tier users get 3 uses ever per feature
        if (user.subscription_tier === 'free') {
            return (user.free_tarot_readings_used || 0) < 3;
        }
        
        // For paid tiers, check monthly limits
        const limits = {
            basic: 0, // Basic tier does not include tarot readings
            standard: 15,
            pro: 30,
            complete: Infinity
        };
        const limit = limits[user.subscription_tier] || 0;
        return (user.monthly_readings_used || 0) < limit;
    };

    const getRemainingUses = () => {
        if (!user) return 0;
        
        if (user.subscription_tier === 'free') {
            return Math.max(0, 3 - (user.free_tarot_readings_used || 0));
        }
        
        const limits = {
            basic: 0, // Basic tier correctly shows 0 remaining uses
            standard: 15,
            pro: 30,
            complete: Infinity
        };
        const limit = limits[user.subscription_tier] || 0;
        return limit === Infinity ? "∞" : Math.max(0, limit - (user.monthly_readings_used || 0));
    };

    const getReadingPrompt = (type, customQ, cards) => {
        const basePrompt = `Provide a mystical three-card tarot reading (Past, Present, Future) with the following cards:
        - Past: ${cards[0]}
        - Present: ${cards[1]}  
        - Future: ${cards[2]}`;

        const typePrompts = {
            custom: `${basePrompt} for the user's question: "${customQ}".`,
            love: `${basePrompt} focused on love and relationships. Explore romantic connections, self-love, and emotional fulfillment.`,
            career: `${basePrompt} focused on career and financial matters. Discuss professional growth, money flow, and work-life balance.`,
            family: `${basePrompt} focused on family relationships and friendships. Explore family dynamics, social connections, and support systems.`,
            general: `${basePrompt} for general life guidance. Provide overall insights about the person's current life path and opportunities.`,
            spiritual: `${basePrompt} focused on spiritual growth and inner wisdom. Explore the person's spiritual journey and higher purpose.`,
            health: `${basePrompt} focused on health and overall wellbeing. Discuss physical, mental, and emotional wellness.`,
            decision: `${basePrompt} to help with an important life decision. Provide clarity and guidance for making the right choice.`
        };

        return `${typePrompts[type]} 

        Interpret each card in its position and provide a cohesive story connecting all three. Your tone should be wise, insightful, and mystical. End with practical guidance the person can apply.
        
        Write in flowing, natural prose without any markdown formatting, asterisks, or special symbols. Use clear paragraph breaks and speak directly to the person with warmth and mystical wisdom.`;
    };

    const handleDrawCards = async () => {
        if (readingType === "custom" && !customQuestion.trim()) {
            alert("Please enter your question first");
            return;
        }
        
        if (!canGetReading()) return;

        setIsShuffling(true);
        setDrawnCards([]);
        setInterpretation("");

        setTimeout(async () => {
            // Shuffle and draw 3 cards
            const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
            const selectedCards = shuffled.slice(0, 3);
            setDrawnCards(selectedCards);
            setIsShuffling(false);
            setIsReading(true);

            try {
                const response = await InvokeLLM({
                    prompt: getReadingPrompt(readingType, customQuestion, selectedCards),
                    add_context_from_internet: false
                });

                setInterpretation(response);

                // Update usage count based on subscription tier
                if (user.subscription_tier === 'free') {
                    await User.updateMyUserData({ 
                        free_tarot_readings_used: (user.free_tarot_readings_used || 0) + 1 
                    });
                    setUser(prev => ({
                        ...prev,
                        free_tarot_readings_used: (prev.free_tarot_readings_used || 0) + 1
                    }));
                } else {
                    await User.updateMyUserData({ 
                        monthly_readings_used: (user.monthly_readings_used || 0) + 1 
                    });
                    setUser(prev => ({
                        ...prev,
                        monthly_readings_used: (prev.monthly_readings_used || 0) + 1
                    }));
                }
                
                const questionText = readingType === "custom" ? customQuestion : readingTypes.find(rt => rt.value === readingType)?.label;
                await Reading.create({
                    reading_type: "tarot",
                    question: questionText,
                    result: response,
                    cards_drawn: selectedCards
                });

            } catch (error) {
                console.error("Error getting tarot reading:", error);
                setInterpretation("The cosmic connection is faint... Please try again.");
            }
            setIsReading(false);
        }, 1500);
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
                                Please sign in to access the mystical tarot wisdom.
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
    const showBasicUpgradeMessage = user.subscription_tier === 'basic';
    
    if (showBasicUpgradeMessage) {
        return (
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-white/40 backdrop-blur-sm border-white/20">
                        <CardContent className="p-12 text-center">
                            <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                            <h2 className="text-2xl font-bold mb-4">Tarot Readings Require Standard Tier</h2>
                            <p className="text-gray-600 mb-6">
                                Unlock the wisdom of the Tarot with a Standard subscription or higher.
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

    const canProceed = readingType !== "custom" || (readingType === "custom" && customQuestion.trim());
    const selectedType = readingTypes.find(rt => rt.value === readingType);

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Tarot Reading
                    </h1>
                    <p className="text-gray-600">Unveil the secrets of your path with a three-card spread</p>
                </div>
                
                <Card className="bg-white/40 backdrop-blur-sm border-white/20">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Choose Your Reading Focus</CardTitle>
                        <Badge variant="outline">
                            {user.subscription_tier === 'free' ? `${remainingUses} free uses left` : `${remainingUses} readings left`}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {user.subscription_tier === 'free' && remainingUses > 0 && (
                                <Alert className="bg-green-50 border-green-200">
                                    <Sparkles className="h-4 w-4" />
                                    <AlertDescription className="text-green-800">
                                        <strong>🎁 Free Trial:</strong> You have {remainingUses} free tarot readings remaining. <a href={createPageUrl("Profile")} className="underline font-medium">Upgrade to Standard</a> for 15 monthly readings.
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div>
                                <Label htmlFor="reading-type">What area of life would you like guidance on?</Label>
                                <Select value={readingType} onValueChange={setReadingType}>
                                    <SelectTrigger className="w-full mt-2 bg-white/60">
                                        <SelectValue placeholder="Select reading type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {readingTypes.map((type) => {
                                            const IconComponent = type.icon;
                                            return (
                                                <SelectItem key={type.value} value={type.value}>
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent className="w-4 h-4" />
                                                        {type.label}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            {readingType === "custom" && (
                                <div>
                                    <Label htmlFor="custom-question">Your specific question</Label>
                                    <Input 
                                        id="custom-question"
                                        placeholder="Ask the cards anything..."
                                        value={customQuestion}
                                        onChange={(e) => setCustomQuestion(e.target.value)}
                                        className="bg-white/60 text-lg mt-2"
                                        disabled={isShuffling || isReading}
                                    />
                                </div>
                            )}

                            {readingType !== "custom" && selectedType && (
                                <Alert className="bg-purple-50 border-purple-200">
                                    <selectedType.icon className="h-4 w-4" />
                                    <AlertDescription className="text-purple-800">
                                        <strong>{selectedType.label} Reading:</strong> The cards will reveal insights about this specific area of your life.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {showUpgradeMessage ? (
                                <Alert>
                                    <AlertDescription>
                                        You have used all 3 free tarot readings. <a href={createPageUrl("Profile")} className="underline font-medium">Upgrade to Standard</a> for 15 monthly readings.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Button 
                                    onClick={handleDrawCards}
                                    disabled={!canProceed || isShuffling || isReading || !canGetReading()}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    size="lg"
                                >
                                    <Shuffle className="w-5 h-5 mr-2" />
                                    {isShuffling ? "Shuffling the Deck..." : "Draw Your Cards"}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <AnimatePresence>
                    {drawnCards.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8"
                        >
                            <Card className="bg-white/40 backdrop-blur-sm border-white/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        {selectedType && <selectedType.icon className="w-5 h-5" />}
                                        Your {selectedType?.label} Reading
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-3 gap-6 text-center mb-6">
                                        {['Past', 'Present', 'Future'].map((position, index) => (
                                            <motion.div 
                                                key={position}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.2 }}
                                            >
                                                <Card className="bg-white/60 p-4 h-full">
                                                    <h3 className="font-semibold text-purple-700">{position}</h3>
                                                    <div className="my-2 h-24 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                                                        <p className="font-bold text-lg">{drawnCards[index]}</p>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                    
                                    {isReading && (
                                        <div className="text-center">
                                            <p>The cards reveal their secrets...</p>
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mt-2"></div>
                                        </div>
                                    )}

                                    {interpretation && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <Card className="bg-purple-50 p-4 mt-4">
                                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                                    Card Interpretation
                                                </h4>
                                                <p className="whitespace-pre-line text-gray-700 leading-relaxed">{interpretation}</p>
                                            </Card>
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}