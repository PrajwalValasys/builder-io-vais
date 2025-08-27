import React from "react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { logout } from "../store/slices/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User, CheckCircle } from "lucide-react";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-valasys-gray-50 via-white to-valasys-orange/5 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-valasys-gray-900">
              Dashboard
            </h1>
            <p className="text-valasys-gray-600">
              Welcome back, {user?.email || "User"}!
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-valasys-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="border-valasys-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-valasys-orange" />
              <span>User Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-valasys-gray-600">
                  Email
                </label>
                <p className="text-valasys-gray-900">{user?.email || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-valasys-gray-600">
                  Username
                </label>
                <p className="text-valasys-gray-900">
                  {user?.username || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-valasys-gray-600">
                  User ID
                </label>
                <p className="text-valasys-gray-900">{user?.id || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-valasys-gray-600">
                  Account Status
                </label>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">
                    {user?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">
                  Login Successful!
                </h3>
                <p className="text-green-700">
                  You have successfully logged in to the VAIS dashboard. The
                  Redux Toolkit authentication system is working correctly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info (for development) */}
        {import.meta.env.DEV && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-blue-800 bg-blue-100 p-4 rounded overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
