import React, { useState } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Mail, Lock, User as UserIcon, Sparkles, Eye, EyeOff } from "lucide-react";

export default function UserRegistration() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Check if email already exists
      const existingUsers = await User.filter({ email: formData.email });
      if (existingUsers.length > 0) {
        throw new Error("An account with this email already exists");
      }

      // Create new user
      await User.create({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        username: formData.email, // Use email as username
        login_method: "traditional",
        subscription_tier: "free",
        monthly_images_used: 0,
        monthly_chats_used: 0,
        monthly_readings_used: 0,
        is_email_verified: false
      });

      setSuccess("Account created successfully! You can now use the regular login with Google, or contact admin for traditional login access.");
      setFormData({ full_name: "", email: "", password: "", confirmPassword: "" });
      
    } catch (error) {
      setError(error.message || "Account creation failed. Please try again.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white/40 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Create DreamScape Account</CardTitle>
          <p className="text-gray-600">Register for traditional login access</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Enter your full name"
                  className="pl-10 bg-white/60"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter your email"
                  className="pl-10 bg-white/60"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Create a password"
                  className="pl-10 pr-10 bg-white/60"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="Confirm your password"
                  className="pl-10 bg-white/60"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center">
            <Link to={createPageUrl("Home")} className="text-purple-600 hover:underline text-sm">
              Back to Home
            </Link>
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              Note: This creates an account for admin management. For regular app access, use the Google login on the main site.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
