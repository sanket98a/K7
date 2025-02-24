"use client";
import {
  HelpCircle,
  Settings,
  ChevronDown,
  MoreHorizontalIcon,
  Trash,
  LogOut,
} from "lucide-react";
import k7logo from "@/assets/k7logo4.png";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface CustomHeaderProps {
  userName?: string;
}

export function ChatHeader({ userName = "Fahad Abbas" }: CustomHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-end gap-4  max-w-7xl  mx-auto  ">
      {/* Help Icon */}
      {/* <span className="flex gap-1 items-center">
    <Image className="drop-shadow-xl shadow-gray-500 w-8" src={k7logo} alt="K7 Knowledge Organizer" width={40} height={40} />
      <h1 className="text-xl md:text-3xl bg-gradient-to-b from-slate-500 to-gray-800 bg-clip-text text-transparent font-poppins font-semibold"> Info Harbor</h1>
      </span> */}
      <div className="profileButtons flex  items-center  gap-4  px-6">
        <button
          className="rounded-full p-2 hover:bg-gray-100"
          aria-label="Help"
        >
          <HelpCircle className="h-6 w-6 font-semibold text-blue-600" />
        </button>

        {/* Settings Icon */}
        <button
          className="rounded-full p-2 hover:bg-gray-100"
          aria-label="Settings"
        >
          <Settings className="h-6 w-6 font-semibold text-blue-600" />
        </button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <div className="flex gap-2 items-center cursor-pointer">
          <Avatar className="h-8 w-8">
            {" "}
            <AvatarFallback className="bg-blue-500 text-white">
              FA
            </AvatarFallback>{" "}
          </Avatar>
          {/* <span className="p-2 rounded-[50px] bg-blue-500 text-white"></span> */}
          <span className=" text-blue-500 font-medium ">{userName}</span>
          <ChevronDown className="h-4 w-4 text-blue-500" />
        </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500"
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
       
      </div>
    </header>
  );
}
