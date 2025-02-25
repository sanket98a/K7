"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  FolderGit2,
  MessageCircle,
  HelpCircle,
  Settings,
  ChevronDown,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import k7logo from '@/assets/k7logo2.png'
import Image from "next/image"

type NavItem = {
  name: string
  icon: React.ElementType
  subItems?: { name: string; href: string }[]
}

const navItems: NavItem[] = [
  { name: "Home", icon: Home },
  {
    name: "Repositories",
    icon: FolderGit2,
    subItems: [
      { name: "Document Repo", href: "/dashboard/repository/documentrepo" },
      { name: "Tabular Assets Repo", href: "/dashboard/repository/tabularrepo" },
      { name: "Database System Repo", href: "/dashboard/repository/databaserepo" },
      { name: "Website Repo", href: "/dashboard/repository/webrepo" },
      { name: "Data Visualizations Repo", href: "/dashboard/repository/visualrepo" },
    ],
  },
  {
    name: "My Insights",
    icon: MessageCircle,
    subItems: [
      { name: "Document Insights", href: "/dashboard/chat/documentchat" },
      { name: "Maths Insights", href: "/dashboard/chat/mathchat" },
      { name: "Tabular Insights", href: "/dashboard/chat/tabularchat" },
      { name: "Database Systems Insights", href: "/dashboard/chat/databasechat" },
      { name: "Website Insights", href: "/dashboard/chat/webchat" },
      { name: "Data Visualizations Insights", href: "/dashboard/chat/visualchat" },
    ],
  },
]

export function CustomSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const pathname = usePathname()

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <div
      className={`flex flex-col h-screen  bg-gradient-to-b from-slate-500 to-gray-800 text-white transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
     {/* Collapse toggle */}
     <div className="w-full flex gap-1 p-1 py-2 justify-center border-b border-slate-400"><Image className={`${isCollapsed?"w-16":"w-20"}`} src={k7logo} alt="k7"  /></div>

      {/* Navigation items */}
      <nav className="flex-grow overflow-y-auto">
        <ul className={` px-2 py-4`}>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              {item.subItems ? (
                <Collapsible className="group/collapsible">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-center px-4 py-2 text-sm rounded-md hover:bg-gray-200 hover:text-blue-600 hover:border-l-4 border-blue-500  transition-all ease-in">
                      <item.icon className="h-6 w-6 mr-2" />
                      {!isCollapsed && (
                        <>
                          <span>{item.name}</span>
                          <ChevronDown className="ml-auto h-4 w-4 group-data-[state=open]/collapsible:rotate-180" />
                        </>
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {!isCollapsed && (
                      <ul className="ml-5 px-1 py-2 mt-2">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className={`block px-4 py-2 text-sm  hover:bg-gray-200 hover:text-blue-600 hover:border-l-4 border-blue-500 ${
                                pathname === subItem.href ? "bg-gray-200 text-blue-600 border-l-4 border-blue-500 font-semibold" : ""
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
               href={'/dashboard'}
                  className={`flex items-center px-4 py-2 rounded-md text-sm ${isCollapsed?'justify-center':'justify-start'}  hover:bg-gray-200 hover:text-blue-600 hover:border-l-4 border-blue-500 ${
                    pathname === "/dashboard" ? "bg-gray-200 text-blue-600 border-l-4 border-blue-500 font-semibold" : ""
                  }`}
                >
                  <item.icon className="h-6 w-6 mr-2" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer items */}
      <div className={`border-t border-white/10 ${isCollapsed?'p-1':'p-4'} mb-10 `}>
        <Link href="/dashboard/help" className={`flex items-center ${isCollapsed?'justify-center':'justify-start'}  mb-2 text-sm hover:bg-gray-200 hover:text-blue-600 hover:border-l-4 border-blue-500 px-2 py-1 rounded`}>
          <HelpCircle className="h-6 w-6 mr-2" />
          {!isCollapsed && <span>Help & Support</span>}
        </Link>
        <Link href="/dashboard/settings" className={`flex items-center ${isCollapsed?'justify-center':'justify-start'}  text-sm hover:bg-gray-200 hover:text-blue-600 hover:border-l-4 border-blue-500 px-2 py-1 rounded-md`}>
          <Settings className="h-6 w-6 mr-2" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
       
      </div>

      <button onClick={toggleSidebar} className={`p-2 ${isCollapsed?'justify-center':'justify-end'}  bg-gray-700 flex transition-all ease-in duration-300`}>
        {isCollapsed ?  <ChevronRight className="h-6 w-6" />  : <ChevronLeft className="h-6 w-6" />}
      </button>
    </div>
  )
}

