import React, { useState } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";

export default function SimpleUserCreator() {
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
        subscription_tier: "complete"
      };

      const newUser = await User.create(userData);
      
      setResult(`SUCCESS! User created: ${newUser.username} with email ${newUser.email} and COMPLETE subscription`);
      console.log("User created:", newUser);
      
    } catch (err) {
      console.error("Creation failed:", err);
      setError(`FAILED: ${err.message || err.toString()}`);
    }
    
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Create Sandy Reeve (Complete Tier)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Email</Label>
                <Input 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Username</Label>
                <Input 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Password</Label>
                <Input 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              
              <div className="bg-green-100 p-3 rounded">
                <p className="text-green-800 font-medium">Subscription: COMPLETE (Unlimited Everything)</p>
              </div>
            </div>

            <Button 
              onClick={createUser}
              disabled={isCreating}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {isCreating ? "Creating User..." : "Create User Now"}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-mono">{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800 font-medium">{result}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}