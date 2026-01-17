"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { cn } from "../lib/utils"

export function NavbarDropdown({
  trigger,
  items,
  align = "right",
  className,
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)} // just the opposite
        className={cn(
          "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium",
          "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
          className
        )}
      >
        {trigger}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute mt-2 min-w-[180px] rounded-xl border border-zinc-800",
            "bg-zinc-900 shadow-lg backdrop-blur-xl",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <ul className="py-1">
            {items.map((item, i) => {
              if (item.separator) {
                return (
                  <li
                    key={`sep-${i}`}
                    className="my-1 h-px bg-zinc-800"
                  />
                )
              }

              const Content = (
                <span className="flex items-center gap-2 px-4 py-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
              )

              return (
                <li key={item.label}>
                  {item.href ? ( // cuz like if you pass "" as an href it won't go anywhere, intended for bringing up the dropdown
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={item.className ? item.className : "block text-sm text-zinc-300 hover:bg-zinc-800/60 hover:text-white"}
                    >
                      {Content}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        item.onClick?.()
                        setOpen(false)
                      }}
                      className={item.className ? item.className : "block text-sm text-zinc-300 hover:bg-zinc-800/60 hover:text-white"}
                    >
                      {Content}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
