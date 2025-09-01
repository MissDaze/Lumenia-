import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";
import { 
  Moon, 
  Sun, 
  Stars, 
  Crown, 
  BookOpen,
  MessageCircle,
  Target,
  Layers,
  Music,
  Mail
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      const currentUser = await User.me();
      if (currentUser) {
        console.log("User is authenticated, redirecting to dashboard");
        window.location.href = createPageUrl("Dashboard");
        return;
      }
    } catch (error) {
      console.log("User not authenticated");
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setSuccess("Opening Google login...");
      await User.login();
    } catch (error) {
      console.error("Google login error:", error);
      setError("Login failed. Please try again.");
      setSuccess("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{background: '#191970'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#8A2BE2'}}></div>
          <p style={{color: '#C0C0C0'}}>Loading Lumenia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{background: '#191970'}}>
      <style jsx>{`
        .lumenia-hero-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 2rem;
        }
        .hero-crescent-container {
          width: 100px;
          height: 100px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-crescent-shape {
          width: 90px;
          height: 90px;
          background: #8A2BE2;
          position: relative;
          border-radius: 50%;
          overflow: hidden;
        }
        .hero-crescent-shape::before {
          content: '';
          position: absolute;
          top: 0;
          right: -20px;
          width: 90px;
          height: 90px;
          background: #191970;
          border-radius: 50%;
        }
        .hero-crescent-l {
          position: absolute;
          top: 50%;
          left: 42%;
          transform: translate(-50%, -50%);
          color: #191970;
          font-size: 50px;
          font-weight: 700;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          line-height: 1;
          z-index: 10;
        }
        .hero-wordmark {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 72px;
          font-weight: 600;
          color: #8A2BE2;
          letter-spacing: -0.02em;
        }
        .hero-dot {
          width: 16px;
          height: 16px;
          background: #8A2BE2;
          border-radius: 50%;
          margin-left: 12px;
          margin-top: 24px;
        }
        @media (max-width: 768px) {
          .hero-wordmark {
            font-size: 52px;
          }
          .hero-crescent-container {
            width: 70px;
            height: 70px;
          }
          .hero-crescent-shape {
            width: 60px;
            height: 60px;
          }
          .hero-crescent-shape::before {
            width: 60px;
            height: 60px;
            right: -14px;
          }
          .hero-crescent-l {
            font-size: 34px;
          }
          .hero-dot {
            width: 12px;
            height: 12px;
            margin-top: 18px;
          }
        }
        .login-card {
          background: #191970;
          border: 2px solid #C0C0C0;
        }
        .login-btn {
          background: #8A2BE2;
          color: #C0C0C0;
          border: none;
          transition: all 0.3s ease;
        }
        .login-btn:hover {
          box-shadow: 0 0 20px rgba(183, 110, 121, 0.6);
          border: 2px solid #B76E79;
        }
        .test-btn {
          background: transparent;
          border: 2px solid #C0C0C0;
          color: #C0C0C0;
          transition: all 0.3s ease;
        }
        .test-btn:hover {
          border-color: #B76E79;
          color: #B76E79;
          box-shadow: 0 0 15px rgba(183, 110, 121, 0.4);
        }
        .features-card {
          background: #8A2BE2;
          color: #C0C0C0;
          border: none;
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="lumenia-hero-logo">
            <div className="hero-crescent-container">
              <div className="hero-crescent-shape"></div>
              <span className="hero-crescent-l">L</span>
            </div>
            <div className="flex items-start">
              <h1 className="hero-wordmark">Lumenia</h1>
              <div className="hero-dot"></div>
            </div>
          </div>
          
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{color: '#C0C0C0'}}>
            Your mystical compass to unlock dreams, cosmic wisdom, and spiritual insights
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          
          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert style={{background: 'rgba(138, 43, 226, 0.2)', border: '2px solid #8A2BE2'}}>
              <AlertDescription style={{color: '#8A2BE2'}}>{success}</AlertDescription>
            </Alert>
          )}

          <Card className="login-card shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center" style={{color: '#8A2BE2'}}>Join Lumenia</CardTitle>
              <p className="text-center" style={{color: '#C0C0C0'}}>Start your mystical journey today</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                onClick={handleGoogleLogin}
                size="lg"
                className="login-btn w-full"
              >
                <Mail className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>

              <div className="p-4 rounded-lg" style={{background: 'rgba(138, 43, 226, 0.2)', border: '2px solid #8A2BE2'}}>
                <p className="text-sm text-center" style={{color: '#8A2BE2'}}>
                  <strong>🚀 One Click Access:</strong><br/>
                  Click above to sign in with Google and get instant access to all mystical features!
                </p>
              </div>

              {/* Test Link */}
              <div className="text-center">
                <p className="text-sm mb-2" style={{color: '#C0C0C0'}}>For testing purposes:</p>
                <Button 
                  onClick={() => window.location.href = createPageUrl("Dashboard")}
                  className="test-btn w-full"
                >
                  🔮 Go Directly to Dashboard (Test)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <Card className="features-card border-none text-center">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Mystical Features Await</h3>
              <div className="space-y-2 text-sm">
                <p>🌙 AI Dream Journal & Interpretation</p>
                <p>🔮 Fortune Teller Chat Oracle</p>
                <p>🃏 Personalized Tarot Readings</p>
                <p>🪨 Ancient Norse Rune Wisdom</p>
                <p>⭐ Horoscopes & Astrology Charts</p>
                <p>🎵 Mood-Based Soundscapes</p>
              </div>
              <p className="text-xs mt-4" style={{color: '#C0C0C0', opacity: 0.8}}>
                Start free forever • Premium from $4.95/month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}