
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe2, LogIn, UserPlus, AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const { user, isLoading, isOnline, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isNetworkTesting, setIsNetworkTesting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const redirect = searchParams.get('redirect');
  const signupSuccess = searchParams.get('signup');
  
  // Set the initial tab based on the URL parameter
  const [activeTab, setActiveTab] = useState(() => {
    // Default to signin, but if we have signup=success, show signup tab
    return searchParams.get('signup') ? 'signup' : 'signin';
  });
  
  useEffect(() => {
    // Handle redirect parameters
    if (redirect === 'verification_success') {
      toast({
        title: "Email verification successful",
        description: "You can now sign in with your credentials",
      });
    }
    
    if (signupSuccess === 'success') {
      toast({
        title: "Account created",
        description: "Please check your email for a verification link before signing in",
      });
    }
  }, [redirect, signupSuccess, toast]);

  // Redirect if already logged in
  if (user && !isLoading) {
    return <Navigate to="/" />;
  }

  const testConnection = async () => {
    setIsNetworkTesting(true);
    try {
      const response = await fetch('https://www.google.com/favicon.ico', { 
        mode: 'no-cors',
        cache: 'no-store',
        method: 'HEAD'
      });
      // If we get here, we have internet but maybe Supabase is down
      toast({
        title: "Internet connection detected",
        description: "You have an internet connection, but the authentication service might be unavailable. Please try again later.",
      });
    } catch (error) {
      toast({
        title: "Network test failed",
        description: "No internet connection detected. Please check your network settings.",
        variant: "destructive"
      });
    } finally {
      setIsNetworkTesting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    
    try {
      await signIn(email, password);
      navigate('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (!navigator.onLine) {
        setAuthError("Network error: You're offline. Please check your internet connection.");
      } else if (error.message === "Failed to fetch") {
        setAuthError("Failed to connect to authentication service. Please check your connection or try again later.");
      } else if (error.message) {
        setAuthError(error.message);
      } else {
        setAuthError("Failed to connect to authentication service. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    
    try {
      await signUp(email, password, fullName);
      // Don't redirect - signUp function will handle navigation when appropriate
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (!navigator.onLine) {
        setAuthError("Network error: You're offline. Please check your internet connection.");
      } else if (error.message === "Failed to fetch") {
        setAuthError("Failed to connect to authentication service. Please check your connection or try again later.");
      } else if (error.message) {
        setAuthError(error.message);
      } else {
        setAuthError("Failed to connect to authentication service. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Globe2 size={42} className="text-primary" />
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-primary">Crisis</span>
                <span>Scope</span>
              </h1>
              <p className="text-sm text-muted-foreground">Crisis Management Dashboard</p>
            </div>
          </div>
        </div>
        
        {!isOnline && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <WifiOff className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">You're offline</AlertTitle>
            <AlertDescription className="text-amber-700 flex flex-col gap-3">
              <span>Please check your internet connection to sign in or sign up.</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testConnection}
                disabled={isNetworkTesting}
                className="w-full sm:w-auto"
              >
                {isNetworkTesting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing connection...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test connection
                  </>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {redirect === 'verification_success' && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">Verification successful!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your email has been verified. You can now sign in with your credentials.
            </AlertDescription>
          </Alert>
        )}
        
        {signupSuccess === 'success' && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">Account created!</AlertTitle>
            <AlertDescription className="text-green-700">
              Please check your email for a verification link before signing in.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="signin">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup">
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your email and password to access your dashboard.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="youremail@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {authError && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Authentication Error</AlertTitle>
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting || isLoading || !isOnline}>
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Enter your details to create a new account.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="youremail@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {authError && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Authentication Error</AlertTitle>
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="text-sm text-muted-foreground mt-2">
                    <p>After signing up, you'll need to verify your email address.</p>
                    <p>Please check your inbox (and spam folder) for the verification link.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting || isLoading || !isOnline}>
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
