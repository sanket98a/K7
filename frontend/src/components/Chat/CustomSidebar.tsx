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
import { span } from "framer-motion/client"

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
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <div
      className={`flex flex-col h-screen bg-gradient-to-b  from-blue-600 to-blue-800 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
     {/* Collapse toggle */}
     <button onClick={toggleSidebar} className={`p-2 ${isCollapsed?'justify-center':'justify-end'} bg-blue-700 flex transition-all ease-in duration-300`}>
        {isCollapsed ?  <ChevronRight className="h-6 w-6" />  :  <ChevronLeft className="h-6 w-6" />}
      </button>

      {/* Navigation items */}
      <nav className="flex-grow overflow-y-auto">
        <ul className="py-4">
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              {item.subItems ? (
                <Collapsible className="group/collapsible">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center px-4 py-2 text-sm  hover:bg-white hover:text-blue-500">
                      <item.icon className="h-5 w-5 mr-2" />
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
                      <ul className="ml-5 px-1 mt-2">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className={`block px-4 py-2 text-sm rounded-xl hover:bg-white hover:text-blue-500 ${
                                pathname === subItem.href ? "bg-white text-blue-500 font-semibold" : ""
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
                  className={`flex items-center px-4 py-2 text-sm  hover:bg-white hover:text-blue-500 ${
                    pathname === "/dashboard" ? "bg-white text-blue-500 font-semibold" : ""
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer items */}
      <div className={`border-t border-white/10 ${isCollapsed?'p-1':'p-4'} mb-10 `}>
        <Link href="/dashboard/help" className="flex items-center mb-2 text-sm hover:bg-white hover:text-blue-500 px-2 py-1 rounded">
          <HelpCircle className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Help & Support</span>}
        </Link>
        <Link href="/dashboard/settings" className="flex items-center text-sm hover:bg-white hover:text-blue-500 px-2 py-1 rounded">
          <Settings className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>

      
    </div>
  )
}

