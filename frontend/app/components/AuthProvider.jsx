"use client";

import { createContext, useContext } from "react";
import { SessionProvider } from "next-auth/react";

// Create context
const AuthContext = createContext({ isLoggedIn: false });

// Custom hook for convenience
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component
export default function AuthProvider({ children, isLoggedIn, userData, session }) {
  return (
    <SessionProvider session={session}>
      <AuthContext.Provider value={{ isLoggedIn, userData }}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  );
}
