import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Reading } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers, Crown, Shuffle, Heart, Briefcase, Users, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { createPageUrl } from "@/utils";

const runeSymbols = [
    "ᚠ Fehu", "ᚢ Uruz", "ᚦ Thurisaz", "ᚨ Ansuz", "ᚱ Raidho", "ᚲ Kenaz",
    "ᚷ Gebo", "ᚹ Wunjo", "ᚺ Hagalaz", "ᚾ Nauthiz", "ᛁ Isa", "ᛃ Jera",
    "ᛇ Eihwaz", "ᛈ Perthro", "ᛉ Algiz", "ᛊ Sowilo", "ᛏ Tiwaz", "ᛒ Berkano",
    "ᛖ Ehwaz", "ᛗ Mannaz", "ᛚ Laguz", "ᛜ Ingwaz", "ᛞ Dagaz", "ᛟ Othala"
];

const readingTypes = [
    { value: "custom", label: "Custom Question", icon: HelpCircle },
    { value: "guidance", label: "Life Guidance", icon: Sparkles },
    { value: "love", label: "Love & Relationships", icon: Heart },
    { value: "career", label: "Career & Success", icon: Briefcase },
    { value: "family", label: "Family & Community", icon: Users },
    { value: "spiritual", label: "Spiritual Path", icon: Sparkles },
    { value: "protection", label: "Protection & Strength", icon: Layers },
    { value: "decision", label: "Important Decision", icon: HelpCircle }
];

export default function Runes() {
    const [user, setUser] = useState(null);
    const [readingType, setReadingType] = useState("custom");
    const [customQuestion, setCustomQuestion] = useState("");
    const [drawnRunes, setDrawnRunes] = useState([]);
    const [interpretation, setInterpretation] = useState("");
    const [isReading, setIsReading] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

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
            return (user.free_rune_readings_used || 0) < 3;
        }
        
        // For paid tiers, check monthly limits
        const limits = {
            basic: 0, // Basic tier does not include rune readings
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
            return Math.max(0, 3 - (user.free_rune_readings_used || 0));
        }
        
        const limits = {
            basic: 0,
            standard: 15,
            pro: 30,
            complete: Infinity
        };
        const limit = limits[user.subscription_tier] || 0;
        return limit === Infinity ? "∞" : Math.max(0, limit - (user.monthly_readings_used || 0));
    };

    const getReadingPrompt = (type, customQ, runes) => {
        const basePrompt = `Provide a mystical Norse rune reading with the following three runes:
        - First Rune (Situation): ${runes[0]}
        - Second Rune (Challenge/Action): ${runes[1]}  
        - Third Rune (Outcome): ${runes[2]}`;

        const typePrompts = {
            custom: `${basePrompt} for the user's question: "${customQ}".`,
            guidance: `${basePrompt} for general life guidance and wisdom.`,
            love: `${basePrompt} focused on love, relationships, and emotional connections.`,
            career: `${basePrompt} focused on career success, work challenges, and professional growth.`,
            family: `${basePrompt} focused on family relationships, community bonds, and social harmony.`,
            spiritual: `${basePrompt} focused on spiritual growth, inner wisdom, and connection to the divine.`,
            protection: `${basePrompt} focused on protection, strength, and overcoming obstacles.`,
            decision: `${basePrompt} to help with an important life decision requiring wisdom.`
        };

        return `${typePrompts[type]} 

        Channel the ancient wisdom of the Norse tradition. Interpret each rune's meaning in its position and weave them into a cohesive message. Draw upon Viking wisdom, Norse mythology, and the power of Odin's knowledge. Your tone should be strong, wise, and grounding like the ancient Nordic sages.
        
        Write in flowing, natural prose without any markdown formatting, asterisks, or special symbols. Use clear paragraph breaks and speak directly to the seeker with the strength and wisdom of the Norse tradition.`;
    };

    const handleDrawRunes = async () => {
        if (readingType === "custom" && !customQuestion.trim()) {
            alert("Please enter your question first");
            return;
        }
        
        if (!canGetReading()) return;

        setIsDrawing(true);
        setDrawnRunes([]);
        setInterpretation("");

        setTimeout(async () => {
            // Draw 3 runes
            const shuffled = [...runeSymbols].sort(() => 0.5 - Math.random());
            const selectedRunes = shuffled.slice(0, 3);
            setDrawnRunes(selectedRunes);
            setIsDrawing(false);
            setIsReading(true);

            try {
                const response = await InvokeLLM({
                    prompt: getReadingPrompt(readingType, customQuestion, selectedRunes),
                    add_context_from_internet: false
                });

                setInterpretation(response);

                // Update usage count based on subscription tier
                if (user.subscription_tier === 'free') {
                    await User.updateMyUserData({ 
                        free_rune_readings_used: (user.free_rune_readings_used || 0) + 1 
                    });
                    setUser(prev => ({
                        ...prev,
                        free_rune_readings_used: (prev.free_rune_readings_used || 0) + 1
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
                    reading_type: "runes",
                    question: questionText,
                    result: response,
                    cards_drawn: selectedRunes
                });

            } catch (error) {
                console.error("Error getting rune reading:", error);
                setInterpretation("The ancient wisdom is clouded... Please try again.");
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
                            <Layers className="w-16 h-16 mx-auto mb-4 text-amber-600" />
                            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
                            <p className="text-gray-600 mb-6">
                                Please sign in to access the ancient Norse rune wisdom.
                            </p>
                            <Button 
                                onClick={() => User.login()}
                                className="bg-gradient-to-r from-amber-600 to-orange-600"
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
                            <Layers className="w-16 h-16 mx-auto mb-4 text-amber-600" />
                            <h2 className="text-2xl font-bold mb-4">Rune Readings Require Standard Tier</h2>
                            <p className="text-gray-600 mb-6">
                                Channel the ancient Norse wisdom with a Standard subscription or higher.
                            </p>
                            <Button 
                                onClick={() => window.location.href = createPageUrl("Profile")}
                                className="bg-gradient-to-r from-amber-600 to-orange-600"
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
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                        Norse Rune Reading
                    </h1>
                    <p className="text-gray-600">Channel the ancient wisdom of the Vikings</p>
                </div>
                
                <Card className="bg-white/40 backdrop-blur-sm border-white/20">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Seek the Runes' Wisdom</CardTitle>
                        <Badge variant="outline">
                            {user.subscription_tier === 'free' ? `${remainingUses} free uses left` : `${remainingUses} readings left`}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {user.subscription_tier === 'free' && remainingUses > 0 && (
                                <Alert className="bg-amber-50 border-amber-200">
                                    <Layers className="h-4 w-4" />
                                    <AlertDescription className="text-amber-800">
                                        <strong>🎁 Free Trial:</strong> You have {remainingUses} free rune readings remaining. <a href={createPageUrl("Profile")} className="underline font-medium">Upgrade to Standard</a> for 15 monthly readings.
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div>
                                <Label htmlFor="reading-type">What guidance do you seek from the runes?</Label>
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
                                    <Label htmlFor="custom-question">Your question for the runes</Label>
                                    <Input 
                                        id="custom-question"
                                        placeholder="What wisdom do you seek?"
                                        value={customQuestion}
                                        onChange={(e) => setCustomQuestion(e.target.value)}
                                        className="bg-white/60 text-lg mt-2"
                                        disabled={isDrawing || isReading}
                                    />
                                </div>
                            )}

                            {readingType !== "custom" && selectedType && (
                                <Alert className="bg-amber-50 border-amber-200">
                                    <selectedType.icon className="h-4 w-4" />
                                    <AlertDescription className="text-amber-800">
                                        <strong>{selectedType.label} Reading:</strong> The Norse runes will reveal ancient wisdom about this aspect of your life.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {showUpgradeMessage ? (
                                <Alert>
                                    <AlertDescription>
                                        You have used all 3 free rune readings. <a href={createPageUrl("Profile")} className="underline font-medium">Upgrade to Standard</a> for 15 monthly readings.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Button 
                                    onClick={handleDrawRunes}
                                    disabled={!canProceed || isDrawing || isReading || !canGetReading()}
                                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600"
                                    size="lg"
                                >
                                    <Shuffle className="w-5 h-5 mr-2" />
                                    {isDrawing ? "Drawing the Runes..." : "Cast the Runes"}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <AnimatePresence>
                    {drawnRunes.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8"
                        >
                            <Card className="bg-white/40 backdrop-blur-sm border-white/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        {selectedType && <selectedType.icon className="w-5 h-5" />}
                                        Your {selectedType?.label} Rune Reading
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-3 gap-6 text-center mb-6">
                                        {['Situation', 'Challenge/Action', 'Outcome'].map((position, index) => (
                                            <motion.div 
                                                key={position}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.2 }}
                                            >
                                                <Card className="bg-white/60 p-4 h-full">
                                                    <h3 className="font-semibold text-amber-700 mb-2">{position}</h3>
                                                    <div className="my-4 h-20 flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                                                        <p className="font-bold text-2xl text-amber-800">{drawnRunes[index]}</p>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                    
                                    {isReading && (
                                        <div className="text-center">
                                            <p>The ancient runes speak their wisdom...</p>
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mx-auto mt-2"></div>
                                        </div>
                                    )}

                                    {interpretation && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <Card className="bg-amber-50 p-4 mt-4">
                                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                    <Layers className="w-4 h-4 text-amber-600" />
                                                    Rune Wisdom
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
