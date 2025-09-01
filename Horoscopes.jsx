
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stars, Sun, Calendar } from "lucide-react";

export default function Horoscopes() {
  const [user, setUser] = useState(null);
  const [westernHoroscope, setWesternHoroscope] = useState("");
  const [chineseHoroscope, setChineseHoroscope] = useState("");
  const [isLoading, setIsLoading] = useState({ western: false, chinese: false });
  const [selectedZodiac, setSelectedZodiac] = useState("");
  const [selectedChineseZodiac, setSelectedChineseZodiac] = useState("");

  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const chineseZodiacSigns = [
    "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
    "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser.zodiac_sign) {
        setSelectedZodiac(currentUser.zodiac_sign);
      }
      if (currentUser.chinese_zodiac) {
        setSelectedChineseZodiac(currentUser.chinese_zodiac);
      }
    } catch (error) {
      console.log("Authentication error");
    }
  };

  const generateWesternHoroscope = async () => {
    if (!selectedZodiac) return;
    
    setIsLoading(prev => ({...prev, western: true}));
    try {
      const response = await InvokeLLM({
        prompt: `Generate a detailed daily horoscope for ${selectedZodiac} for today. Include insights about love and relationships, career and finances, health and wellness, lucky numbers and colors, and general guidance for the day.
        
        Make it mystical, encouraging, and specific to ${selectedZodiac} traits. Keep it around 200-250 words.
        
        Write in flowing, natural prose without any markdown formatting, asterisks, or special symbols. Use clear paragraph breaks and write in a warm, encouraging tone that speaks directly to the ${selectedZodiac} person.`,
        add_context_from_internet: true
      });
      
      setWesternHoroscope(response);
      
      // Save zodiac sign to user profile
      if (user && !user.zodiac_sign) {
        await User.updateMyUserData({ zodiac_sign: selectedZodiac });
      }
    } catch (error) {
      console.error("Error generating horoscope:", error);
    }
    setIsLoading(prev => ({...prev, western: false}));
  };

  const generateChineseHoroscope = async () => {
    if (!selectedChineseZodiac) return;
    
    setIsLoading(prev => ({...prev, chinese: true}));
    try {
      const response = await InvokeLLM({
        prompt: `Generate a detailed Chinese horoscope reading for the Year/Sign of the ${selectedChineseZodiac} for today. Include traditional Chinese astrology insights, element influences and energy flows, recommendations for the day, compatible activities and people, feng shui suggestions, and wisdom from ancient Chinese philosophy.
        
        Make it authentic to Chinese astrological traditions. Keep it around 200-250 words.
        
        Write in flowing, natural prose without any markdown formatting, asterisks, or special symbols. Use clear paragraph breaks and write in a wise, traditional tone that honors Chinese astrological wisdom.`,
        add_context_from_internet: true
      });
      
      setChineseHoroscope(response);
      
      // Save Chinese zodiac to user profile
      if (user && !user.chinese_zodiac) {
        await User.updateMyUserData({ chinese_zodiac: selectedChineseZodiac });
      }
    } catch (error) {
      console.error("Error generating Chinese horoscope:", error);
    }
    setIsLoading(prev => ({...prev, chinese: false}));
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Cosmic Horoscopes
          </h1>
          <p className="text-gray-600">Discover what the stars have in store for you today</p>
        </div>

        <Tabs defaultValue="western" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="western" className="flex items-center gap-2">
              <Stars className="w-4 h-4" />
              Western Zodiac
            </TabsTrigger>
            <TabsTrigger value="chinese" className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              Chinese Zodiac
            </TabsTrigger>
          </TabsList>

          <TabsContent value="western">
            <Card className="bg-white/30 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stars className="w-5 h-5" />
                  Western Horoscope
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Your Zodiac Sign</label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {zodiacSigns.map((sign) => (
                      <Button
                        key={sign}
                        variant={selectedZodiac === sign ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedZodiac(sign)}
                        className={selectedZodiac === sign ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
                      >
                        {sign}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedZodiac && (
                  <Button 
                    onClick={generateWesternHoroscope}
                    disabled={isLoading.western}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {isLoading.western ? "Reading the Stars..." : `Get Today's ${selectedZodiac} Horoscope`}
                  </Button>
                )}

                {westernHoroscope && (
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-700">
                        {selectedZodiac} - {new Date().toDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {westernHoroscope}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chinese">
            <Card className="bg-white/30 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  Chinese Horoscope
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Your Chinese Zodiac</label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {chineseZodiacSigns.map((sign) => (
                      <Button
                        key={sign}
                        variant={selectedChineseZodiac === sign ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedChineseZodiac(sign)}
                        className={selectedChineseZodiac === sign ? "bg-gradient-to-r from-orange-500 to-red-500" : ""}
                      >
                        {sign}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedChineseZodiac && (
                  <Button 
                    onClick={generateChineseHoroscope}
                    disabled={isLoading.chinese}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {isLoading.chinese ? "Consulting Ancient Wisdom..." : `Get Today's ${selectedChineseZodiac} Reading`}
                  </Button>
                )}

                {chineseHoroscope && (
                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-red-700">
                        Year of the {selectedChineseZodiac} - {new Date().toDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {chineseHoroscope}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
