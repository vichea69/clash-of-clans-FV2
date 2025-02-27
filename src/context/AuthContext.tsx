import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, User } from "@/api/authApi";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage if token is valid
    if (authApi.isAuthenticated()) {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authApi.isAuthenticated()) {
          // Use stored user data if token is valid
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } else {
          // Clear stored data if token is invalid/expired
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authApi.signIn({ email, password });
      console.log("Sign in response:", response);

      if (!response.token) {
        throw new Error("No token received");
      }

      // Set user data from the sign in response
      if (response.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      } else {
        throw new Error("No user data received");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    const response = await authApi.signUp({ name, email, password });
    if (response.user) {
      setUser(response.user);
    }
  };

  const signOut = async () => {
    try {
      await authApi.signOut();
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
