"use client";

import { createContext, useContext } from "react";
import { SessionProvider } from "next-auth/react";

// Create context
const AuthContext = createContext({ isLoggedIn: false, accessToken: null, userData: {} });

// Custom hook for convenience
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component
export default function AuthProvider({ children, isLoggedIn, accessToken, userData, session }) {
  return (
    <SessionProvider session={session}>
      <AuthContext.Provider value={{ isLoggedIn, accessToken, userData }}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  );
}
