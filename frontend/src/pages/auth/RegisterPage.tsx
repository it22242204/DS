import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState<"customer" | "restaurant" | "delivery">("customer");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword || !location || !city) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5600/api/auth/register", {
        name,
        email,
        password,
        role,
        location: {
          location,
          city
        }
      });

      setIsLoading(false);
      showNotification("Registration successful! Your account is awaiting admin approval.", "success");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Join our platform to enjoy our services</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={setRole}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
            </TabsList>

            {["customer", "restaurant", "delivery"].map((tabRole) => (
              <TabsContent value={tabRole} key={tabRole}>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {error && (
                      <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor={`${tabRole}-name`}>Name</Label>
                      <Input
                        id={`${tabRole}-name`}
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${tabRole}-email`}>Email</Label>
                      <Input
                        id={`${tabRole}-email`}
                        type="email"
                        placeholder={`${tabRole}@example.com`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${tabRole}-password`}>Password</Label>
                      <Input
                        id={`${tabRole}-password`}
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${tabRole}-confirm-password`}>Confirm Password</Label>
                      <Input
                        id={`${tabRole}-confirm-password`}
                        type="password"
                        placeholder="********"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${tabRole}-location`}>City</Label>
                      <Input
                        id={`${tabRole}-location`}
                        type="text"
                        placeholder="e.g., Malabe"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${tabRole}-city`}>District</Label>
                      <Input
                        id={`${tabRole}-city`}
                        type="text"
                        placeholder="e.g., Colombo"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading
                        ? "Creating account..."
                        : `Sign up as ${tabRole.charAt(0).toUpperCase() + tabRole.slice(1)}`}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to={`/login${role ? `?role=${role}` : ""}`}
              className="text-primary underline-offset-4 hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
