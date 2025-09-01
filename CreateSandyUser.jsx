import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";

export default function CreateSandyUser() {
  const [isCreating, setIsCreating] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  const createSandy = async () => {
    setIsCreating(true);
    setError("");
    setSuccess("");
    setDebugInfo("");
    
    try {
      setDebugInfo("Starting user creation process...");
      
      // First, let's see if we can fetch current user to test the connection
      try {
        const currentUser = await User.me();
        setDebugInfo(`Connected! Current user: ${currentUser?.email || 'none'}`);
      } catch (e) {
        setDebugInfo("No current user logged in (expected)");
      }
      
      // Now try to create Sandy
      setDebugInfo("Attempting to create Sandy...");
      
      const sandyData = {
        full_name: "Sandy Reeve",
        email: "sandy@gmail.com",
        username: "sandy",
        password: "Sandy",
        subscription_tier: "complete"
      };

      console.log("Creating Sandy with minimal data:", sandyData);
      
      const result = await User.create(sandyData);
      
      console.log("Sandy created successfully:", result);
      setSuccess(`✅ SUCCESS! Sandy created with ID: ${result.id}. Login: sandy / Sandy`);
      
    } catch (error) {  
      console.error("Full error object:", error);
      setError(`❌ FAILED: ${error.message || error.toString()}`);
      setDebugInfo(`Error details: ${JSON.stringify(error, null, 2)}`);
    }
    
    setIsCreating(false);
  };

  const testConnection = async () => {
    try {
      const users = await User.list('', 1);
      setDebugInfo(`✅ Connection OK - Found ${users.length} users in system`);
    } catch (error) {
      setDebugInfo(`❌ Connection failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Create Sandy Reeve - Complete Tier User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Target User Details:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>Name:</strong> Sandy Reeve</li>
                <li><strong>Email:</strong> sandy@gmail.com</li>
                <li><strong>Username:</strong> sandy</li>
                <li><strong>Password:</strong> Sandy</li>
                <li><strong>Tier:</strong> complete (unlimited access)</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={testConnection}
                variant="outline"
                className="flex-1"
              >
                Test Connection
              </Button>
              
              <Button 
                onClick={createSandy} 
                disabled={isCreating}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isCreating ? "Creating Sandy..." : "Create Sandy"}
              </Button>
            </div>

            {debugInfo && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-mono text-sm">{debugInfo}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Instructions:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Click "Test Connection" first to verify system access</li>
                <li>Click "Create Sandy" to create the user account</li>
                <li>If successful, Sandy can login with: sandy / Sandy</li>
                <li>Check admin panel to verify Sandy appears in user list</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}