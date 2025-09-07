import React, { useState } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { UserPlus, CheckCircle, AlertCircle, Crown } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function UserCreator() {
  const [formData, setFormData] = useState({
    full_name: "Sandy Reeve",
    email: "sandy@gmail.com", 
    username: "sandy",
    password: "Sandy"
  });
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const createUser = async () => {
    setIsCreating(true);
    setResult("");
    setError("");

    try {
      console.log("Creating user:", formData);
      
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        username: formData.username, 
        password: formData.password,
        subscription_tier: "complete",
        login_method: "traditional",
        monthly_images_used: 0,
        monthly_chats_used: 0,
        monthly_readings_used: 0,
        is_email_verified: true
      };

      const newUser = await User.create(userData);
      
      setResult(`🎉 SUCCESS! User "${newUser.username}" created with COMPLETE subscription! You can now login with username: ${newUser.username} and password: ${formData.password}`);
      console.log("User created:", newUser);
      
    } catch (err) {
      console.error("Creation failed:", err);
      setError(`❌ FAILED: ${err.message || err.toString()}`);
    }
    
    setIsCreating(false);
  };

  const quickFillSandy = () => {
    setFormData({
      full_name: "Sandy Reeve",
      email: "sandy@gmail.com",
      username: "sandy",
      password: "Sandy"
    });
  };

  const quickFillTest = () => {
    const randomNum = Math.floor(Math.random() * 1000);
    setFormData({
      full_name: `Test User ${randomNum}`,
      email: `test${randomNum}@gmail.com`,
      username: `test${randomNum}`,
      password: "test123"
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">🚀 USER CREATOR</h1>
          <p className="text-gray-600">Create users with COMPLETE subscription (unlimited access)</p>
        </div>

        {/* Main Form */}
        <Card className="shadow-2xl border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100">
            <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              Create COMPLETE Tier User
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            
            {/* Quick Fill Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={quickFillSandy}
                variant="outline"
                className="flex-1 bg-green-50 hover:bg-green-100"
              >
                Fill Sandy Details
              </Button>
              <Button 
                onClick={quickFillTest}
                variant="outline"
                className="flex-1 bg-blue-50 hover:bg-blue-100"
              >
                Generate Test User
              </Button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold">Full Name</Label>
                <Input 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="text-lg p-3"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <Label className="text-lg font-semibold">Email</Label>
                <Input 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="text-lg p-3"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <Label className="text-lg font-semibold">Username</Label>
                <Input 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="text-lg p-3"
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <Label className="text-lg font-semibold">Password</Label>
                <Input 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="text-lg p-3"
                  placeholder="Enter password"
                />
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
                <p className="text-green-800 font-bold text-center">
                  🌟 Subscription: COMPLETE TIER (Unlimited Everything) 🌟
                </p>
              </div>
            </div>

            {/* Create Button */}
            <Button 
              onClick={createUser}
              disabled={isCreating || !formData.full_name || !formData.email || !formData.username || !formData.password}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 text-xl font-bold shadow-lg"
            >
              <UserPlus className="w-6 h-6 mr-3" />
              {isCreating ? "CREATING USER..." : "CREATE USER NOW!"}
            </Button>

            {/* Results */}
            {error && (
              <Alert variant="destructive" className="border-2 border-red-300">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-lg font-semibold">{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="bg-green-50 border-2 border-green-300">
                <CheckCircle className="h-5 w-5" />
                <AlertDescription className="text-green-800 text-lg font-semibold whitespace-pre-line">{result}</AlertDescription>
              </Alert>
            )}

            {/* Navigation */}
            <div className="flex justify-center pt-4">
              <Link to={createPageUrl("Dashboard")}>
                <Button variant="outline" size="lg">
                  Back to Dashboard
                </Button>
              </Link>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
