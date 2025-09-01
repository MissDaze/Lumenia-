import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Dream } from "@/api/entities";
import { Reading } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Crown, 
  BarChart3, 
  Settings, 
  Plus,
  Eye,
  UserPlus,
  Shield,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

const ADMIN_PASSWORD = "admin2024";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");  
  const [success, setSuccess] = useState("");
  const [isCreatingSandy, setIsCreatingSandy] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid admin password");
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const allUsers = await User.list('-created_date');
      setUsers(allUsers);

      const allDreams = await Dream.list();
      const allReadings = await Reading.list();

      const subscriptionBreakdown = allUsers.reduce((acc, user) => {
        const tier = user.subscription_tier || 'free';
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalUsers: allUsers.length,
        totalDreams: allDreams.length,
        totalReadings: allReadings.length,
        subscriptionBreakdown
      });
    } catch (error) {
      setError("Failed to load admin data");
    }
    setIsLoading(false);
  };

  const createSandy = async () => {
    setIsCreatingSandy(true);
    setError("");
    setSuccess("");
    
    try {
      const userData = {
        full_name: "Sandy Reeve",
        email: "sandy@gmail.com",
        username: "sandy",
        password: "Sandy",
        subscription_tier: "complete",
        login_method: "traditional",
        monthly_images_used: 0,
        monthly_chats_used: 0,
        monthly_readings_used: 0,
        is_email_verified: true
      };

      console.log("Creating Sandy:", userData);
      const result = await User.create(userData);
      console.log("Sandy created:", result);
      
      setSuccess(`✅ SUCCESS! Sandy created - Username: sandy, Password: Sandy, Subscription: COMPLETE`);
      
      setTimeout(() => {
        loadData();
      }, 1000);
      
    } catch (error) {
      console.error("Error creating Sandy:", error);
      setError(`❌ Failed to create Sandy: ${error.message}`);
    }
    
    setIsCreatingSandy(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password (admin2024)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">
                Login to Admin
              </Button>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline">Back to App</Button>
          </Link>
        </div>

        {/* BIG GREEN CREATE SANDY BUTTON - TOP OF PAGE */}
        <div className="mb-8">
          <Card className="border-4 border-green-500 bg-gradient-to-r from-green-100 to-green-200 shadow-2xl">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-green-800 mb-4">🚀 CREATE SANDY REEVE USER</h2>
              <div className="bg-white p-4 rounded-lg mb-6 max-w-md mx-auto">
                <p className="text-green-700 font-semibold">Username: sandy</p>
                <p className="text-green-700 font-semibold">Email: sandy@gmail.com</p>
                <p className="text-green-700 font-semibold">Password: Sandy</p>
                <p className="text-green-700 font-semibold">Subscription: COMPLETE (Unlimited)</p>
              </div>
              
              <Button 
                onClick={createSandy}
                disabled={isCreatingSandy}
                className="bg-green-600 hover:bg-green-700 text-white py-6 px-12 text-2xl font-bold shadow-lg transform hover:scale-105 transition-all"
                size="lg"
              >
                <UserPlus className="w-8 h-8 mr-3" />
                {isCreatingSandy ? "CREATING SANDY..." : "CREATE SANDY NOW!"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-lg font-semibold">{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-800 text-lg font-semibold">{success}</AlertDescription>
          </Alert>
        )}

        {/* Original Admin Dashboard with Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="user-management">User Management</TabsTrigger>
            <TabsTrigger value="all-pages">All Pages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{stats.totalUsers || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Paid Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {stats.subscriptionBreakdown?.complete || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Dreams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{stats.totalDreams || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Readings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-pink-600">{stats.totalReadings || 0}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="user-management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User List
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2">Loading users...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.slice(0, 10).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold">{user.username || user.full_name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge className={
                              user.subscription_tier === 'complete' ? 'bg-purple-500' :
                              user.subscription_tier === 'pro' ? 'bg-blue-500' :
                              user.subscription_tier === 'standard' ? 'bg-green-500' :
                              user.subscription_tier === 'basic' ? 'bg-yellow-500' : 
                              'bg-gray-500'
                            }>
                              {user.subscription_tier?.toUpperCase() || 'FREE'}
                            </Badge>
                            <Badge variant="outline">
                              {user.login_method || 'google'}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>Joined: {new Date(user.created_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all-pages">
            <Card>
              <CardContent className="p-6">
                <p>All Pages management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6">
                <p>Settings management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}