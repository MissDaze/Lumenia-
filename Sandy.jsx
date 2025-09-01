import React, { useState } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown, CheckCircle, AlertCircle } from "lucide-react";

export default function Sandy() {
  const [isCreating, setIsCreating] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const createSandy = async () => {
    setIsCreating(true);
    setError("");
    setSuccess("");
    
    try {
      console.log("Creating Sandy account...");
      
      const sandyData = {
        full_name: "Sandy Reeve",
        email: "sandy@gmail.com",
        subscription_tier: "complete",
        monthly_images_used: 0,
        monthly_chats_used: 0,
        monthly_readings_used: 0
      };

      const result = await User.create(sandyData);
      
      setSuccess(`🎉 SUCCESS! Sandy account created! She can now sign in with Google using sandy@gmail.com. Complete subscription activated!`);
      console.log("Sandy created:", result);
      
    } catch (error) {  
      console.error("Sandy creation error:", error);
      setError(`Failed to create Sandy account: ${error.message || error.toString()}`);
    }
    
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
            <CardTitle className="text-center text-3xl flex items-center justify-center gap-3">
              <Crown className="w-8 h-8" />
              Create Sandy's VIP Account
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-800 mb-3 text-xl">🌟 Sandy Reeve - Complete Tier</h3>
              <ul className="text-green-700 space-y-2">
                <li><strong>Email:</strong> sandy@gmail.com</li>
                <li><strong>Subscription:</strong> Complete (Unlimited Everything)</li>
                <li><strong>Login Method:</strong> Google Sign-In</li>
                <li><strong>Cost:</strong> FREE</li>
              </ul>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={createSandy} 
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-6 text-2xl font-bold shadow-lg"
              size="lg"
            >
              <Crown className="w-8 h-8 mr-3" />
              {isCreating ? "Creating Sandy's Account..." : "CREATE SANDY ACCOUNT"}
            </Button>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>After creation:</strong> Sandy visits the site and signs in with Google using sandy@gmail.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}