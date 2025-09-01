
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Dream } from "@/api/entities";
import { InvokeLLM, GenerateImage } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Moon, Sparkles, Download, Eye, Brain, AlertCircle, Save, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Helper function for creating page URLs (assuming this is part of the broader application utilities)
// This is a placeholder; in a real app, this would likely come from a routing utility.
const createPageUrl = (pageName) => {
  switch (pageName) {
    case "Profile":
      return "/profile";
    // Add other cases as needed
    default:
      return "/";
  }
};

export default function Dreams() {
  const [user, setUser] = useState(null);
  const [dreams, setDreams] = useState([]);
  const [showNewDream, setShowNewDream] = useState(false);
  const [selectedDream, setSelectedDream] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingInterpretation, setIsGeneratingInterpretation] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newDream, setNewDream] = useState({
    title: "",
    description: "",
    emotions: [],
    symbols: [],
    dream_date: new Date().toISOString().split('T')[0],
    lucid_dream: false,
    recurring: false,
    ai_interpretation: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      console.log("User loaded:", currentUser);
      
      const userDreams = await Dream.filter({ created_by: currentUser.email }, '-created_date');
      setDreams(userDreams);
      console.log("Dreams loaded:", userDreams);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Please sign in to access your dream journal");
    }
    setIsLoading(false);
  };

  const canGenerateInterpretation = () => {
    if (!user) return false;
    if (user.subscription_tier === 'free') {
      return (user.free_dream_interpretations_used || 0) < 3;
    }
    return true; // All paid tiers can generate interpretations
  };

  const canGenerateImage = () => {
    if (!user) {
      console.log("No user, cannot generate image");
      return false;
    }
    
    if (user.subscription_tier === 'free') {
      return (user.free_dream_images_used || 0) < 3;
    }
    
    const limits = {
      basic: 15,
      standard: 30,
      pro: 30,
      complete: Infinity
    };
    const limit = limits[user.subscription_tier] || 0;
    const used = user.monthly_images_used || 0;
    console.log(`Image generation check - Tier: ${user.subscription_tier}, Limit: ${limit}, Used: ${used}`);
    return used < limit;
  };

  const generatePersonalizedInterpretation = async () => {
    if (!newDream.title.trim()) {
      setError("Please provide a title for your dream");
      return;
    }
    if (!newDream.description.trim()) {
      setError("Please describe your dream first");
      return;
    }

    if (!canGenerateInterpretation()) {
      setError("You've used all 3 free AI interpretations. Please upgrade to continue getting interpretations.");
      return;
    }

    setIsGeneratingInterpretation(true);
    setError("");
    try {
      const interpretation = await InvokeLLM({
        prompt: `You are a wise and compassionate dream analyst with a deep understanding of psychology, symbolism, and human emotion. Your goal is to provide a comprehensive, insightful, and helpful interpretation of the user's dream.

Structure your response with clear sections but use clean, readable text without markdown symbols or citations:

CORE EMOTIONAL LANDSCAPE
Briefly analyze the emotional tone of the dream based on the user's description.

KEY SYMBOL ANALYSIS
Break down the most important symbols from the dream. Discuss their common psychological and archetypal meanings (e.g., water representing emotions, flying representing freedom).

IN-DEPTH PSYCHOLOGICAL INTERPRETATION
Synthesize the symbols and events to explore the deeper meaning. What might this dream be revealing about the user's subconscious thoughts, hidden fears, deepest desires, or current life challenges? Connect it to common life themes like work, relationships, or personal growth.

ACTIONABLE STEPS FOR WELL-BEING
Based on this interpretation, provide 2-3 gentle, sensible, and actionable suggestions or reflection questions. These should empower the user to use the dream's message for personal growth and general happiness.

User's Dream Details:
- Title: "${newDream.title || 'Untitled Dream'}"
- Description: "${newDream.description}"
- Emotions Felt: ${newDream.emotions.length > 0 ? newDream.emotions.join(', ') : 'Not specified'}
- Key Symbols: ${newDream.symbols.length > 0 ? newDream.symbols.join(', ') : 'Not specified'}
- Lucid Dream: ${newDream.lucid_dream ? 'Yes' : 'No'}
- Recurring Dream: ${newDream.recurring ? 'Yes' : 'No'}

Provide your interpretation in clean, flowing prose with clear paragraph breaks. Do not use markdown formatting, asterisks, or any special symbols. Write in a warm, supportive tone.`,
        add_context_from_internet: false
      });

      // Update interpretation usage for free users
      if (user.subscription_tier === 'free') {
        await User.updateMyUserData({ 
          free_dream_interpretations_used: (user.free_dream_interpretations_used || 0) + 1 
        });
        setUser(prev => ({ 
          ...prev, 
          free_dream_interpretations_used: (prev.free_dream_interpretations_used || 0) + 1 
        }));
      }

      // Automatically save the dream after generating interpretation
      await saveDreamWithInterpretation(interpretation);

    } catch (error) {
      console.error("Error generating interpretation:", error);
      setError("Unable to generate interpretation. Please try again.");
    }
    setIsGeneratingInterpretation(false);
  };

  const saveDreamWithInterpretation = async (interpretation) => {
    if (!user) {
      setError("You must be signed in to save dreams");
      return;
    }
    
    setIsProcessing(true);
    try {
      console.log("Saving dream to journal with interpretation");
      
      const dreamData = {
        title: newDream.title.trim(),
        description: newDream.description.trim(),
        emotions: newDream.emotions,
        symbols: newDream.symbols,
        dream_date: newDream.dream_date,
        lucid_dream: newDream.lucid_dream,
        recurring: newDream.recurring,
        ai_interpretation: interpretation
      };

      const savedDream = await Dream.create(dreamData);
      console.log("Dream saved to journal:", savedDream);
      
      // Reset form
      setNewDream({
        title: "",
        description: "",
        emotions: [],
        symbols: [],
        dream_date: new Date().toISOString().split('T')[0],
        lucid_dream: false,
        recurring: false,
        ai_interpretation: ""
      });
      
      setShowNewDream(false);
      setSuccess("Dream saved to your journal! You can now generate a beautiful image for it.");
      await loadData();
      
    } catch (error) {
      console.error("Error saving dream to journal:", error);
      setError(`Error saving dream: ${error.message || "Please try again"}`);
    }
    setIsProcessing(false);
  };

  const handleManualSave = async () => {
    setError("");
    setSuccess("");

    if (!newDream.title.trim()) {
      setError("Please provide a title for your dream");
      return;
    }
    if (!newDream.description.trim()) {
      setError("Please provide a description for your dream");
      return;
    }
    if (!user) {
      setError("You must be signed in to save dreams");
      return;
    }
    
    // Allow saving without interpretation for manual saves
    setIsProcessing(true);
    try {
      const dreamData = {
        title: newDream.title.trim(),
        description: newDream.description.trim(),
        emotions: newDream.emotions,
        symbols: newDream.symbols,
        dream_date: newDream.dream_date,
        lucid_dream: newDream.lucid_dream,
        recurring: newDream.recurring,
        ai_interpretation: newDream.ai_interpretation || ""
      };

      const savedDream = await Dream.create(dreamData);
      console.log("Dream saved manually:", savedDream);
      
      // Reset form
      setNewDream({
        title: "",
        description: "",
        emotions: [],
        symbols: [],
        dream_date: new Date().toISOString().split('T')[0],
        lucid_dream: false,
        recurring: false,
        ai_interpretation: ""
      });
      
      setShowNewDream(false);
      setSuccess("Dream saved to your journal!");
      await loadData();
      
    } catch (error) {
      console.error("Error saving dream manually:", error);
      setError(`Error saving dream: ${error.message || "Please try again"}`);
    }
    setIsProcessing(false);
  };

  const generateDreamImage = async (dream) => {
    console.log("Starting image generation for dream:", dream.title);
    console.log("User subscription:", user?.subscription_tier);
    
    if (!canGenerateImage()) {
      const message = user.subscription_tier === 'free' 
        ? "You've used all 3 free AI image generations. Please upgrade to continue generating images."
        : "Image generation not available with your current subscription. Please upgrade to generate images.";
      setError(message);
      return;
    }
    
    setIsGeneratingImage(true);
    setError("");
    try {
      console.log("Generating artistic surreal dream image for:", dream.title);
      
      // Shortened prompt to avoid API limits
      const imagePrompt = `Artistic surreal dream illustration: "${dream.title}". 

${dream.description.substring(0, 300)}...

Style: Vintage storybook art meets Tim Burton whimsy. Surreal dreamlike composition with magical elements, rich cosmic colors (blues, purples, teals, gold), whimsical fairy tale characters, gothic aesthetic, fine illustration details. Like Alice in Wonderland meets Salvador Dalí. Enchanting yet mysterious mood.`;
      
      console.log("Using shortened prompt:", imagePrompt.substring(0, 100) + "...");
      const result = await GenerateImage({ prompt: imagePrompt });
      console.log("GenerateImage result:", result);
      
      if (result && result.url) {
        console.log("Image generated successfully, updating dream record");
        await Dream.update(dream.id, { 
          generated_image_url: result.url 
        });
        
        // Update user usage count based on subscription tier
        if (user.subscription_tier === 'free') {
          const newUsage = (user.free_dream_images_used || 0) + 1;
          await User.updateMyUserData({ 
            free_dream_images_used: newUsage
          });
          setUser(prev => ({ ...prev, free_dream_images_used: newUsage }));
        } else {
          const newUsage = (user.monthly_images_used || 0) + 1;
          await User.updateMyUserData({ 
            monthly_images_used: newUsage
          });
          setUser(prev => ({ ...prev, monthly_images_used: newUsage }));
        }
        
        setSuccess("Artistic dream image generated successfully! You can view and download it.");
        await loadData();
      } else {
        console.error("No image URL in result:", result);
        throw new Error("No image URL received from generation service");
      }
      
    } catch (error) {
      console.error("Error generating dream image:", error);
      setError(`Image generation failed. The prompt may be too long. Please try again with a shorter dream description.`);
    }
    setIsGeneratingImage(false);
  };

  const handleArrayInput = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setNewDream({...newDream, [field]: items});
  };

  if (!user && !isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8" style={{background: '#191970'}}>
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg" style={{background: '#191970', border: '2px solid #C0C0C0'}}>
            <CardContent className="p-12 text-center">
              <Moon className="w-16 h-16 mx-auto mb-4" style={{color: '#8A2BE2'}} />
              <h2 className="text-2xl font-bold mb-4" style={{color: '#8A2BE2'}}>Sign In Required</h2>
              <p className="mb-6" style={{color: '#C0C0C0'}}>
                Please sign in to access your personal dream journal and AI interpretations.
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{background: '#191970'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: '#8A2BE2'}}></div>
      </div>
    );
  }

  const getRemainingInterpretations = () => {
    if (!user || user.subscription_tier !== 'free') return null;
    return Math.max(0, 3 - (user.free_dream_interpretations_used || 0));
  };

  const getRemainingImages = () => {
    if (!user) return 0;
    if (user.subscription_tier === 'free') {
      return Math.max(0, 3 - (user.free_dream_images_used || 0));
    }
    const limits = {
      basic: 15,
      standard: 30,
      pro: 30,
      complete: Infinity
    };
    const limit = limits[user.subscription_tier] || 0;
    return limit === Infinity ? "∞" : Math.max(0, limit - (user.monthly_images_used || 0));
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: '#191970'}}>
      <style jsx>{`
        .dream-card {
          background: #191970;
          border: 2px solid #C0C0C0;
          transition: all 0.3s ease;
        }
        .dream-card:hover {
          transform: scale(1.05);
          border-color: #B76E79;
          box-shadow: 0 0 25px rgba(183, 110, 121, 0.4);
        }
        .dream-btn {
          background: #8A2BE2;
          color: #C0C0C0;
          border: none;
          transition: all 0.3s ease;
        }
        .dream-btn:hover {
          box-shadow: 0 0 15px rgba(183, 110, 121, 0.7);
          border: 2px solid #B76E79;
        }
        .status-card {
          background: #191970;
          border: 2px solid #C0C0C0;
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6" style={{background: 'rgba(138, 43, 226, 0.2)', border: '2px solid #8A2BE2'}}>
            <AlertDescription style={{color: '#8A2BE2'}}>{success}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif" style={{color: '#8A2BE2'}}>
              Personal Dream Journal
            </h1>
            <p className="mt-1" style={{color: '#C0C0C0'}}>Record your unique dreams and receive AI-powered personalized interpretations</p>
          </div>
          <Button 
            onClick={() => {
              setError("");
              setSuccess("");
              setShowNewDream(true);
            }}
            className="dream-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            Record New Dream
          </Button>
        </div>

        {user && (
          <Card className="status-card mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm" style={{color: '#C0C0C0'}}>Subscription</p>
                  <Badge style={{background: '#8A2BE2', color: '#C0C0C0'}}>
                    {user.subscription_tier?.toUpperCase() || 'FREE'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm" style={{color: '#C0C0C0'}}>Total Dreams</p>
                  <p className="font-semibold" style={{color: '#8A2BE2'}}>{dreams.length}</p>
                </div>
                <div>
                  <p className="text-sm" style={{color: '#C0C0C0'}}>AI Interpretations</p>
                  <p className="font-semibold" style={{color: '#8A2BE2'}}>
                    {user.subscription_tier === 'free' ? `${getRemainingInterpretations()} free left` : 'Unlimited'}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{color: '#C0C0C0'}}>Images Generated</p>
                  <p className="font-semibold" style={{color: '#8A2BE2'}}>
                    {user.subscription_tier === 'free' ? 
                      `${getRemainingImages()} free left` : 
                      `${getRemainingImages()} this month`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dreams.map((dream) => (
            <Card key={dream.id} className="dream-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg" style={{color: '#8A2BE2'}}>{dream.title}</CardTitle>
                  <div className="flex gap-1">
                    {dream.lucid_dream && <Badge style={{background: '#B76E79', color: '#C0C0C0'}}>Lucid</Badge>}
                    {dream.recurring && <Badge style={{background: '#8A2BE2', color: '#C0C0C0'}}>Recurring</Badge>}
                  </div>
                </div>
                <p className="text-sm" style={{color: '#C0C0C0'}}>
                  {new Date(dream.dream_date || dream.created_date).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 line-clamp-3" style={{color: '#C0C0C0'}}>{dream.description}</p>
                
                {dream.ai_interpretation && (
                  <div className="mb-3">
                    <Badge style={{background: 'rgba(138, 43, 226, 0.3)', color: '#8A2BE2', border: '1px solid #8A2BE2'}}>
                      <Brain className="w-3 h-3 mr-1" />
                      Interpreted
                    </Badge>
                  </div>
                )}
                
                {dream.generated_image_url && (
                  <div className="mb-4">
                    <img 
                      src={dream.generated_image_url} 
                      alt={dream.title}
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                    />
                    <Badge className="mt-1" style={{background: 'rgba(183, 110, 121, 0.3)', color: '#B76E79', border: '1px solid #B76E79'}}>
                      <Image className="w-3 h-3 mr-1" />
                      Image Generated
                    </Badge>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedDream(dream)}
                    className="flex-1"
                    style={{borderColor: '#C0C0C0', color: '#C0C0C0', background: 'transparent'}}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Full
                  </Button>
                  {!dream.generated_image_url && canGenerateImage() && (
                    <Button 
                      size="sm" 
                      onClick={() => generateDreamImage(dream)}
                      disabled={isGeneratingImage}
                      className="dream-btn flex-1 disabled:opacity-50"
                      title="Generate artistic dream image"
                    >
                      {isGeneratingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Image className="w-4 h-4 mr-1" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  )}
                  {!canGenerateImage() && !dream.generated_image_url && (
                    <Button 
                      size="sm" 
                      disabled
                      className="flex-1"
                      title="Upgrade subscription to generate images"
                      style={{background: '#696969', color: '#A9A9A9', border: 'none'}}
                    >
                      <Image className="w-4 h-4 mr-1" />
                      Upgrade Needed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {dreams.length === 0 && (
          <Card style={{background: '#191970', border: '2px solid #C0C0C0'}}>
            <CardContent className="p-12 text-center">
              <Moon className="w-16 h-16 mx-auto mb-4" style={{color: '#8A2BE2'}} />
              <h3 className="text-xl font-semibold mb-2" style={{color: '#8A2BE2'}}>Ready to Explore Your Dreams?</h3>
              <p className="mb-4" style={{color: '#C0C0C0'}}>Start by describing your own unique dream experience and receive a personalized AI interpretation</p>
              <Button 
                onClick={() => setShowNewDream(true)} 
                className="dream-btn"
              >
                Describe My Dream
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={showNewDream} onOpenChange={setShowNewDream}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" style={{background: '#191970', border: '2px solid #C0C0C0', color: '#C0C0C0'}}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2" style={{color: '#8A2BE2'}}>
                <Moon className="w-5 h-5" />
                Record Your Dream Experience
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {user?.subscription_tier === 'free' && (
                <Alert style={{background: 'rgba(138, 43, 226, 0.2)', border: '2px solid #8A2BE2'}}>
                  <AlertDescription style={{color: '#8A2BE2'}}>
                    <strong>🎁 Free Trial:</strong> You have {getRemainingInterpretations()} free AI interpretations and {getRemainingImages()} free image generations remaining. <a href={createPageUrl("Profile")} className="underline font-medium">Upgrade to Basic</a> for unlimited interpretations.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="title" style={{color: '#C0C0C0'}}>Dream Title *</Label>
                <Input
                  id="title"
                  value={newDream.title}
                  onChange={(e) => setNewDream({...newDream, title: e.target.value})}
                  placeholder="e.g., 'Flying Through My Childhood Home' or 'The Talking Cat Dream'"
                  className="mt-1"
                  required
                  style={{background: '#191970', borderColor: '#C0C0C0', color: '#C0C0C0'}}
                />
              </div>
              
              <div>
                <Label htmlFor="description" style={{color: '#C0C0C0'}}>Describe Your Dream *</Label>
                <Textarea
                  id="description"
                  value={newDream.description}
                  onChange={(e) => setNewDream({...newDream, description: e.target.value})}
                  placeholder="Tell me everything you remember about your dream... Who was there? What happened? Where were you? What did you see, hear, or feel? The more detail you provide, the more personalized your interpretation will be."
                  className="h-40 mt-1"
                  required
                  style={{background: '#191970', borderColor: '#C0C0C0', color: '#C0C0C0'}}
                />
                <p className="text-xs mt-1" style={{color: '#C0C0C0'}}>
                  {newDream.description.length} characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emotions" style={{color: '#C0C0C0'}}>Emotions You Felt</Label>
                  <Input
                    id="emotions"
                    onChange={(e) => handleArrayInput('emotions', e.target.value)}
                    placeholder="scared, excited, peaceful, confused..."
                    className="mt-1"
                    style={{background: '#191970', borderColor: '#C0C0C0', color: '#C0C0C0'}}
                  />
                  <p className="text-xs mt-1" style={{color: '#C0C0C0'}}>Separate with commas</p>
                </div>
                <div>
                  <Label htmlFor="symbols" style={{color: '#C0C0C0'}}>Key Elements/Symbols</Label>
                  <Input
                    id="symbols" 
                    onChange={(e) => handleArrayInput('symbols', e.target.value)}
                    placeholder="mother, red door, ocean, cat..."
                    className="mt-1"
                    style={{background: '#191970', borderColor: '#C0C0C0', color: '#C0C0C0'}}
                  />
                  <p className="text-xs mt-1" style={{color: '#C0C0C0'}}>Separate with commas</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="dream_date" style={{color: '#C0C0C0'}}>When Did This Dream Occur?</Label>
                <Input
                  id="dream_date"
                  type="date"
                  value={newDream.dream_date}
                  onChange={(e) => setNewDream({...newDream, dream_date: e.target.value})}
                  className="mt-1"
                  style={{background: '#191970', borderColor: '#C0C0C0', color: '#C0C0C0'}}
                />
              </div>
              
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lucid"
                    checked={newDream.lucid_dream}
                    onCheckedChange={(checked) => setNewDream({...newDream, lucid_dream: checked})}
                    className="data-[state=checked]:bg-[#8A2BE2] data-[state=checked]:text-[#C0C0C0] border-[#C0C0C0]"
                  />
                  <Label htmlFor="lucid" className="text-sm" style={{color: '#C0C0C0'}}>Lucid dream (I was aware I was dreaming)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recurring"
                    checked={newDream.recurring}
                    onCheckedChange={(checked) => setNewDream({...newDream, recurring: checked})}
                    className="data-[state=checked]:bg-[#8A2BE2] data-[state=checked]:text-[#C0C0C0] border-[#C0C0C0]"
                  />
                  <Label htmlFor="recurring" className="text-sm" style={{color: '#C0C0C0'}}>Recurring dream</Label>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4" style={{borderTop: '2px solid #C0C0C0'}}>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewDream(false)}
                  className="flex-1"
                  disabled={isProcessing || isGeneratingInterpretation}
                  style={{borderColor: '#C0C0C0', color: '#C0C0C0', background: 'transparent'}}
                >
                  Cancel
                </Button>
                
                <Button 
                  onClick={handleManualSave}
                  disabled={isProcessing || !newDream.title.trim() || !newDream.description.trim()}
                  className="flex-1"
                  style={{background: '#B76E79', color: '#C0C0C0', border: 'none'}}
                >
                  {isProcessing ? "Saving..." : "Save Dream"}
                </Button>
                
                <Button 
                  onClick={generatePersonalizedInterpretation}
                  disabled={isGeneratingInterpretation || !newDream.title.trim() || !newDream.description.trim() || !canGenerateInterpretation()}
                  className="dream-btn flex-1"
                >
                  {isGeneratingInterpretation ? "Generating..." : 
                   !canGenerateInterpretation() ? "Upgrade for AI Interpretation" :
                   "Save + Get AI Interpretation"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {selectedDream && (
          <Dialog open={!!selectedDream} onOpenChange={() => setSelectedDream(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{background: '#191970', border: '2px solid #C0C0C0', color: '#C0C0C0'}}>
              <DialogHeader>
                <DialogTitle style={{color: '#8A2BE2'}}>{selectedDream.title}</DialogTitle>
                <p className="text-sm" style={{color: '#C0C0C0'}}>
                  Dream from {new Date(selectedDream.dream_date || selectedDream.created_date).toLocaleDateString()}
                </p>
              </DialogHeader>
              <div className="space-y-6">
                {selectedDream.generated_image_url && (
                  <div className="text-center">
                    <img 
                      src={selectedDream.generated_image_url}
                      alt={selectedDream.title}
                      className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = selectedDream.generated_image_url;
                        link.download = `${selectedDream.title}-dream.jpg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      style={{borderColor: '#C0C0C0', color: '#C0C0C0', background: 'transparent'}}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download Your Dream Image
                    </Button>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2" style={{color: '#8A2BE2'}}>Your Dream Experience</h4>
                  <div className="p-4 rounded-lg" style={{background: 'rgba(192, 192, 192, 0.1)'}}>
                    <p className="leading-relaxed" style={{color: '#C0C0C0'}}>{selectedDream.description}</p>
                  </div>
                </div>
                
                {selectedDream.ai_interpretation && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2" style={{color: '#8A2BE2'}}>
                      <Brain className="w-4 h-4" style={{color: '#8A2BE2'}} />
                      Your Personal Dream Interpretation
                    </h4>
                    <div className="p-4 rounded-lg border" style={{background: 'rgba(138, 43, 226, 0.1)', border: '1px solid #8A2BE2'}}>
                      <p className="whitespace-pre-line leading-relaxed" style={{color: '#C0C0C0'}}>{selectedDream.ai_interpretation}</p>
                    </div>
                  </div>
                )}
                
                {(selectedDream.emotions?.length > 0 || selectedDream.symbols?.length > 0) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedDream.emotions?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2" style={{color: '#8A2BE2'}}>Emotions You Felt</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedDream.emotions.map((emotion, index) => (
                            <Badge key={index} variant="outline" style={{background: 'rgba(183, 110, 121, 0.3)', color: '#B76E79', border: '1px solid #B76E79'}}>{emotion}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedDream.symbols?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2" style={{color: '#8A2BE2'}}>Key Elements</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedDream.symbols.map((symbol, index) => (
                            <Badge key={index} variant="outline" style={{background: 'rgba(138, 43, 226, 0.3)', color: '#8A2BE2', border: '1px solid #8A2BE2'}}>{symbol}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
