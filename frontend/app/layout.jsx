import { Metadata } from "next";
import axiosClient  from "./axiosClient"
import { cookies } from "next/headers.js";
import { Geist, Geist_Mono } from "next/font/google"; 
import AuthProvider from "./components/AuthProvider";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SkillHub",
  description: "Learn Skills by People you Teach",
};

export default async function RootLayout({
  children,
}) {
  const isLoggedIn = (await cookies()).has("accessToken")
  if(isLoggedIn){
    let accessToken = (await cookies()).get("accessToken")
    var userData = (await axiosClient("api/users/me", {accessToken}, null, "GET"))
  }
  else{
    userData = {
      "discord_id": null,
      "email": "",
      "first_name": "Guest",
      "last_name": "User",
      "provider": "google",
      "id": -1
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider isLoggedIn={isLoggedIn} userData={userData}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
