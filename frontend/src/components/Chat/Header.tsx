
"use client"
import { HelpCircle, Settings, ChevronDown } from "lucide-react"
import k7logo from "@/assets/k7logo4.png"
import Image from "next/image"

interface CustomHeaderProps {
  userName?: string
}

export function ChatHeader({ userName = "Fahad Abbas" }: CustomHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between gap-4  px-6">
      {/* Help Icon */}
      <span className="flex gap-1 items-center">
    <Image className="drop-shadow-xl shadow-gray-500 w-8" src={k7logo} alt="K7 Knowledge Organizer" width={40} height={40} />
      <h1 className="text-xl md:text-3xl bg-gradient-to-b from-slate-500 to-gray-800 bg-clip-text text-transparent font-poppins font-semibold"> Info Harbor</h1>
      </span>
      <div className="profileButtons flex  items-center  gap-4  px-6">
      <button className="rounded-full p-2 hover:bg-gray-100" aria-label="Help">
        <HelpCircle className="h-6 w-6 font-semibold text-gray-700" />
      </button>

      {/* Settings Icon */}
      <button className="rounded-full p-2 hover:bg-gray-100" aria-label="Settings">
        <Settings className="h-6 w-6 font-semibold text-gray-700" />
      </button>

      {/* User Profile Dropdown */}
   <span className="flex gap-2 items-center">
            <span className="text-sm text-gray-600 font-medium">{userName}</span>
            <ChevronDown className="h-4 w-4 text-gray-700" />
       
            </span>
            </div>
    </header>
  )
}

