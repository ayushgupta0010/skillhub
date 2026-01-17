"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, UserPen, LogOut, LogIn, CircleUser} from "lucide-react"
import { cn } from "../lib/utils.js"
import { NavbarDropdown } from "./dropdown.jsx"

const userMenu = [
  { href: "/profile", label: "My Profile", icon: UserPen },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { separator: true },
  {
    label: "Sign Out",
    icon: LogOut,
    className: "block text-sm text-zinc-300 hover:bg-zinc-800/60 hover:text-red",
    onClick: () => console.log("sign out"),
  },
]

let isSignedIn = true

const navLinks = [
  
]

const profileLinks = {
  "signedIn": { href: "", label: "Hello [Name]", icon: CircleUser },
  "notSignedIn":  { href: "/login", label: "Log In", icon: LogIn },
}  

export function Navbar() {

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            <span className="hidden sm:inline">SkillHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              return getHTMLFromLinkData(link)
              })
            }
          </div>
  

          {/* User Stuff */}
          {
            // if we're signed in, make it a dropdown. if we're not signed in, just the normal not signed in thingy
            isSignedIn ?
            <NavbarDropdown
              trigger={
                getHTMLFromLinkData(profileLinks["signedIn"])
              }
              items={userMenu}
            />
            :
            getHTMLFromLinkData(profileLinks["notSignedIn"])
          }
        </div>
      </div>
    </nav>
    </>
  )
}


function getHTMLFromLinkData(link){
  const pathname = usePathname()
  const isActive = pathname === link.href

  return (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
          isActive ? "text-white bg-zinc-800" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
        )}
      >
        <link.icon className="w-4 h-4" />
        <span className="hidden sm:inline">{link.label}</span>
        {isActive && (
          <span className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-zinc-400 to-transparent" />
        )}
      </Link>
    ) 
}