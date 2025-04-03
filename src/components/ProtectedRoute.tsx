
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, session } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check for auth error or success in URL (from Supabase redirects)
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (error) {
      toast({
        title: "Authentication Error",
        description: errorDescription || "There was a problem with authentication",
        variant: "destructive"
      });
    }
    
    if (params.get('access_token')) {
      toast({
        title: "Authentication Successful",
        description: "You've been successfully authenticated"
      });
    }
  }, [location, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Store the current path so we can redirect back after login
    // We use localStorage because this loses state during the redirect
    const currentPath = location.pathname;
    if (currentPath !== '/auth') {
      localStorage.setItem('redirectPath', currentPath);
    }
    
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
