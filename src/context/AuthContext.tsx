
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isOnline: boolean; // New property to track online status
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Handle redirects on sign in
        if (event === 'SIGNED_IN' && currentSession) {
          const redirectPath = localStorage.getItem('redirectPath') || '/';
          localStorage.removeItem('redirectPath'); // Clear it after use
          
          // Use setTimeout to ensure state updates complete
          setTimeout(() => {
            navigate(redirectPath);
            
            toast({
              title: "Logged in successfully",
              description: `Welcome${currentSession.user?.user_metadata?.full_name ? ', ' + currentSession.user.user_metadata.full_name : ''}!`,
            });
          }, 0);
        }
      }
    );

    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    }).catch(error => {
      console.error("Error getting session:", error);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      // First check if we're online
      if (!navigator.onLine) {
        throw new Error("You appear to be offline. Please check your internet connection and try again.");
      }
      
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      let errorMessage = "";
      
      if (!navigator.onLine) {
        errorMessage = "You're offline. Please check your internet connection and try again.";
      } else if (error.message === "Failed to fetch") {
        errorMessage = "Connection to authentication service failed. This could be due to network issues or the service being temporarily unavailable.";
      } else {
        errorMessage = error.message || "Authentication failed. Please try again later.";
      }
      
      toast({
        title: "Error signing in",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // First check if we're online
      if (!navigator.onLine) {
        throw new Error("You appear to be offline. Please check your internet connection and try again.");
      }
      
      setIsLoading(true);
      
      // Check if user already exists before attempting to sign up
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking existing user:", checkError);
        // Proceed with sign up even if we can't check, Supabase will handle duplicates
      } else if (existingUsers) {
        throw new Error("A user with this email already exists. Please sign in instead.");
      }
      
      // Use the site URL as the redirect URL to ensure users return to the right place
      const siteUrl = window.location.origin;
      
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${siteUrl}/auth?redirect=verification_success`
        }
      });
      
      if (error) throw error;
      
      // Show different toasts based on whether email confirmation is required
      if (data.session) {
        // User is immediately signed in (email confirmation disabled)
        toast({
          title: "Account created successfully",
          description: "Welcome to CrisisScope!",
        });
      } else {
        // Email confirmation is required
        toast({
          title: "Verification email sent",
          description: "Please check your email (and spam folder) for a verification link.",
        });
        
        // Explicitly navigate to auth page with a message
        navigate('/auth?signup=success');
      }
    } catch (error: any) {
      let errorMessage = "";
      
      if (!navigator.onLine) {
        errorMessage = "You're offline. Please check your internet connection and try again.";
      } else if (error.message === "Failed to fetch") {
        errorMessage = "Connection to authentication service failed. This could be due to network issues or the service being temporarily unavailable.";
      } else {
        errorMessage = error.message || "Sign up failed. Please try again later.";
      }
      
      toast({
        title: "Error signing up",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (!navigator.onLine) {
        toast({
          title: "Error signing out",
          description: "You're offline. Some functionality may be limited until you reconnect.",
          variant: "destructive",
        });
        return;
      }
      
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Navigate to home page after sign out
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, isOnline, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
