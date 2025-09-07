import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Soundscape } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Music, Wind, Play, Share2, X, Headphones, Wand2, ExternalLink, CheckCircle, AlertCircle, Crown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function SonicAlchemy() {
    const [user, setUser] = useState(null);
    const [soundscape, setSoundscape] = useState(null);
    const [moodDescription, setMoodDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [currentSong, setCurrentSong] = useState(null);

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

    const canGenerateSoundscape = () => {
        if (!user) return false;
        if (user.subscription_tier === 'free') {
            return (user.free_soundscapes_used || 0) < 3;
        }
        return true;
    };

    const getRemainingUses = () => {
        if (!user) return 0;
        if (user.subscription_tier === 'free') {
            return Math.max(0, 3 - (user.free_soundscapes_used || 0));
        }
        return "∞";
    };

    const getYouTubeEmbedUrl = (url) => {
        try {
            const urlObj = new URL(url);
            let videoId;
            if (urlObj.hostname === "youtu.be") {
                videoId = urlObj.pathname.slice(1);
            } else if (urlObj.hostname.includes("youtube.com")) {
                videoId = urlObj.searchParams.get("v");
            }
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            }
        } catch (e) {
            console.error("Invalid YouTube URL", e);
        }
        return null;
    };

    const generateSoundscape = async () => {
        if (!moodDescription.trim()) {
            alert("Please describe how you're feeling first");
            return;
        }

        if (!canGenerateSoundscape()) {
            alert("You've used all 3 free soundscape generations. Please upgrade to continue creating personalized playlists.");
            return;
        }

        setIsGenerating(true);
        setError("");
        setSuccess("");
        setSoundscape(null);

        try {
            const emotionAnalysis = await InvokeLLM({
                prompt: `Analyze the following mood description and extract key emotional and sensory elements for music selection:

User's mood: "${moodDescription}"

Please identify:
1. Primary emotions (happy, sad, anxious, peaceful, energetic, etc.)
2. Energy level (low, medium, high)
3. Desired outcome (relaxation, motivation, focus, healing, etc.)
4. Musical preferences that might match this mood
5. Specific atmosphere or vibe they're seeking

Provide a concise analysis that will help select the perfect songs.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        primary_emotions: { type: "array", items: { type: "string" } },
                        energy_level: { type: "string" },
                        desired_outcome: { type: "string" },
                        musical_style_suggestions: { type: "array", items: { type: "string" } },
                        atmosphere: { type: "string" },
                        analysis_summary: { type: "string" }
                    }
                }
            });

            const playlistResponse = await InvokeLLM({
                prompt: `Based on this emotional analysis, create a perfect 8-song playlist:

Mood Analysis: ${JSON.stringify(emotionAnalysis)}
Original mood description: "${moodDescription}"

Create 8 songs that would perfectly match and enhance this person's current emotional state. Include a mix of different artists and styles that complement the mood. For each song, provide:
- Song title and artist
- Brief reason why this song fits their mood
- The specific emotional quality it brings

Focus on well-known, accessible songs that are likely available on major platforms. Ensure the playlist flows well and supports their emotional journey.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        playlist_title: { type: "string" },
                        playlist_description: { type: "string" },
                        songs: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    artist: { type: "string" },
                                    reason: { type: "string" },
                                    emotion_match: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            const songsWithUrls = [];
            for (const song of playlistResponse.songs) {
                try {
                    const searchResponse = await InvokeLLM({
                        prompt: `Find the official YouTube URL for "${song.title}" by ${song.artist}. Provide the most likely official or high-quality YouTube URL for this song.`,
                        add_context_from_internet: true,
                        response_json_schema: {
                            type: "object",
                            properties: {
                                youtube_url: { type: "string" },
                                confidence: { type: "string" }
                            }
                        }
                    });

                    songsWithUrls.push({
                        ...song,
                        youtube_url: searchResponse.youtube_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`
                    });
                } catch (err) {
                    songsWithUrls.push({
                        ...song,
                        youtube_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`
                    });
                }
            }

            const finalSoundscape = {
                ...playlistResponse,
                songs: songsWithUrls,
                emotion_analysis: emotionAnalysis
            };

            await Soundscape.create({
                mood_description: moodDescription,
                emotion_analysis: emotionAnalysis,
                songs: songsWithUrls
            });

            if (user.subscription_tier === 'free') {
                await User.updateMyUserData({
                    free_soundscapes_used: (user.free_soundscapes_used || 0) + 1
                });
                setUser(prev => ({
                    ...prev,
                    free_soundscapes_used: (prev.free_soundscapes_used || 0) + 1
                }));
            }

            setSoundscape(finalSoundscape);
            setSuccess("Your personalized soundscape has been created! 🎵");
            setMoodDescription("");

        } catch (err) {
            console.error("Error generating soundscape:", err);
            setError("Unable to generate your soundscape. Please try again with a different mood description.");
        }

        setIsGenerating(false);
    };

    const handleShare = (song) => {
        if (navigator.share) {
            navigator.share({
                title: `${song.title} by ${song.artist}`,
                text: `Check out this song I found on Lumenia!`,
                url: song.youtube_url,
            });
        } else {
            navigator.clipboard.writeText(song.youtube_url);
            alert("Link copied to clipboard!");
        }
    };

    const handlePlayExternal = (song) => {
        window.open(song.youtube_url, '_blank');
    };

    if (!user) {
        return (
            <div className="min-h-screen p-4 md:p-8" style={{background: '#191970'}}>
                <div className="max-w-4xl mx-auto">
                    <Card style={{background: '#191970', border: '2px solid #C0C0C0'}}>
                        <CardContent className="p-12 text-center">
                            <Music className="w-16 h-16 mx-auto mb-4" style={{color: '#8A2BE2'}} />
                            <h2 className="text-2xl font-bold mb-4" style={{color: '#8A2BE2'}}>Sign In Required</h2>
                            <p className="mb-6" style={{color: '#C0C0C0'}}>
                                Please sign in to create your personalized sonic sanctuary.
                            </p>
                            <Button
                                onClick={() => User.login()}
                                style={{background: '#8A2BE2', color: '#C0C0C0', border: 'none'}}
                            >
                                Sign In with Google
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const remainingSoundscapes = getRemainingUses();
    const showUpgradeMessage = user.subscription_tier === 'free' && remainingSoundscapes === 0;

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: '#191970'}}>
            <style jsx>{`
                .sanctuary-card {
                    background: #191970;
                    border: 2px solid #C0C0C0;
                }
                .sanctuary-btn {
                    background: #8A2BE2;
                    color: #C0C0C0;
                    border: none;
                    transition: all 0.3s ease;
                }
                .sanctuary-btn:hover {
                    box-shadow: 0 0 20px rgba(183, 110, 121, 0.6);
                    border: 2px solid #B76E79;
                }
                .song-card {
                    background: rgba(138, 43, 226, 0.1);
                    border: 1px solid #C0C0C0;
                }
            `}</style>
            
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-4" style={{color: '#8A2BE2'}}>
                        The Sanctuary - Sonic Alchemy
                    </h1>
                    <p style={{color: '#C0C0C0'}}>Transform your emotions into personalized soundscapes</p>
                </div>

                {user.subscription_tier === 'free' && (
                    <Alert className="mb-6" style={{background: 'rgba(138, 43, 226, 0.2)', border: '2px solid #8A2BE2'}}>
                        <Music className="h-4 w-4" />
                        <AlertDescription style={{color: '#8A2BE2'}}>
                            <strong>🎵 Free Trial:</strong> You have {remainingSoundscapes} free soundscape generations remaining. <a href={createPageUrl("Profile")} className="underline font-medium">Upgrade for unlimited access</a> to personalized mood playlists.
                        </AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive" className="mt-4 mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {success && (
                    <Alert className="mt-4 mb-4" style={{background: 'rgba(183, 110, 121, 0.2)', border: '2px solid #B76E79'}}>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription style={{color: '#B76E79'}}>{success}</AlertDescription>
                    </Alert>
                )}

                <Card className="sanctuary-card mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                                <Music className="w-5 h-5" />
                                <span style={{color: '#8A2BE2'}}>What Kind of Music Do You Want?</span>
                            </div>
                            {user.subscription_tier === 'free' && (
                                <Badge style={{background: 'rgba(192, 192, 192, 0.2)', color: '#C0C0C0', border: '1px solid #C0C0C0'}}>
                                    {remainingSoundscapes} free uses left
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="mood" style={{color: '#C0C0C0'}}>How are you feeling right now?</Label>
                            <Textarea
                                id="mood"
                                placeholder="Describe your current mood, emotions, or what kind of atmosphere you're seeking... (e.g., 'feeling anxious and need calming music' or 'energetic and ready to work out' or 'nostalgic and missing someone')"
                                value={moodDescription}
                                onChange={(e) => setMoodDescription(e.target.value)}
                                className="h-24 mt-2"
                                disabled={isGenerating}
                                style={{background: '#191970', borderColor: '#C0C0C0', color: '#C0C0C0'}}
                            />
                            <p className="text-xs mt-1" style={{color: '#C0C0C0'}}>
                                Be specific! The more descriptive you are, the better your playlist will be.
                            </p>
                        </div>

                        {showUpgradeMessage ? (
                            <Alert>
                                <AlertDescription>
                                    You've used all 3 free soundscape generations. <a href={createPageUrl("Profile")} className="underline font-medium">Upgrade to any paid plan</a> for unlimited personalized playlists.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Button
                                onClick={generateSoundscape}
                                disabled={isGenerating || !moodDescription.trim() || !canGenerateSoundscape()}
                                className="sanctuary-btn w-full"
                                size="lg"
                            >
                                {isGenerating ? (
                                    <>
                                        <Wind className="w-5 h-5 mr-2 animate-spin" />
                                        Creating Your Soundscape...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5 mr-2" />
                                        Generate My Personalized Soundscape
                                    </>
                                )}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <AnimatePresence>
                    {soundscape?.songs && soundscape.songs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="sanctuary-card">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2" style={{color: '#8A2BE2'}}>
                                        <CheckCircle className="w-5 h-5" style={{color: '#B76E79'}} />
                                        {soundscape.playlist_title || `Your Personalized Playlist (${soundscape.songs.length} songs)`}
                                    </CardTitle>
                                    <p className="text-sm" style={{color: '#C0C0C0'}}>{soundscape.playlist_description || `Songs for: "${moodDescription}"`}</p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {soundscape.songs.map((song, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="song-card p-4 rounded-lg flex items-start gap-4"
                                        >
                                            <div className="flex-1">
                                                <p className="font-bold text-lg" style={{color: '#8A2BE2'}}>{song.title}</p>
                                                <p style={{color: '#C0C0C0'}}>{song.artist}</p>
                                                <p className="text-sm italic mt-2" style={{color: '#C0C0C0'}}>"{song.reason}"</p>
                                                {song.emotion_match && <p className="text-xs mt-1" style={{color: '#C0C0C0'}}>Emotional quality: {song.emotion_match}</p>}
                                                <div className="flex items-center gap-1 mt-2">
                                                    <CheckCircle className="w-4 h-4" style={{color: '#B76E79'}} />
                                                    <span className="text-xs" style={{color: '#B76E79'}}>Generated & Ready to Play</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Button size="sm" onClick={() => setCurrentSong(song)} className="sanctuary-btn">
                                                    <Play className="w-4 h-4 mr-2" /> Play
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handlePlayExternal(song)}
                                                    style={{borderColor: '#C0C0C0', color: '#C0C0C0', background: 'transparent'}}>
                                                    <ExternalLink className="w-4 h-4 mr-2" /> YouTube
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleShare(song)}
                                                    style={{borderColor: '#C0C0C0', color: '#C0C0C0', background: 'transparent'}}>
                                                    <Share2 className="w-4 h-4 mr-2" /> Share
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Video Player Modal */}
                <Dialog open={!!currentSong} onOpenChange={() => setCurrentSong(null)}>
                    <DialogContent className="max-w-4xl p-0 border-none" style={{background: '#191970'}}>
                        <DialogHeader className="p-4" style={{color: '#C0C0C0'}}>
                            <DialogTitle className="flex items-center justify-between">
                                <span>{currentSong?.title} by {currentSong?.artist}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCurrentSong(null)}
                                    style={{color: '#C0C0C0'}}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </DialogTitle>
                        </DialogHeader>
                        {currentSong && getYouTubeEmbedUrl(currentSong.youtube_url) ? (
                            <div className="aspect-video">
                                <iframe
                                    src={getYouTubeEmbedUrl(currentSong.youtube_url)}
                                    title={currentSong.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="aspect-video flex items-center justify-center" style={{color: '#C0C0C0'}}>
                                <div className="text-center">
                                    <p className="mb-4">Unable to load video player</p>
                                    <Button onClick={() => handlePlayExternal(currentSong)} variant="outline">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Open in YouTube
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
