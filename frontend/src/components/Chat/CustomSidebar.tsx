"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Home, FolderGit2, MessageCircle, ChevronDown, Menu } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import k7 from "@/assets/k7logo2.png"

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

// Navigation component that can be reused in both sidebar and sheet
const Navigation = ({ isCollapsed = false, onLinkClick = () => {} }) => {
  const pathname = usePathname()

  return (
    <ul className="px-2 py-4">
      {navItems.map((item) => (
        <li key={item.name} className="mb-2">
          {item.subItems ? (
            <Collapsible className="group/collapsible">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-center px-4 py-2 text-sm rounded-md hover:bg-gray-200 hover:text-blue-600 hover:border-l-4 border-blue-500 transition-all ease-in">
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
                          className={`block px-4 py-2 text-sm hover:bg-gray-200 hover:text-blue-600 hover:border-l-4 border-blue-500 ${
                            pathname === subItem.href
                              ? "bg-gray-200 text-blue-600 border-l-4 border-blue-500 font-semibold"
                              : ""
                          }`}
                          onClick={onLinkClick}
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
              href={"/dashboard"}
              className={`flex items-center px-4 py-2 rounded-md text-sm ${isCollapsed ? "justify-center" : "justify-start"} hover:bg-gray-200 hover:text-blue-600 hover:border-l-4 border-blue-500 ${
                pathname === "/dashboard" ? "bg-gray-200 text-blue-600 border-l-4 border-blue-500 font-semibold" : ""
              }`}
              onClick={onLinkClick}
            >
              <item.icon className="h-6 w-6 mr-2" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

export function CustomSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  const closeSheet = () => setIsSheetOpen(false)

  return (
    <>
      {/* Mobile Header - Only visible on small screens */}
      <div className="md:hidden flex items-start justify-between p-2 bg-transparent">
        <div className="flex items-center">
          <Image src={k7} alt="k7" width={40} height={40} className="w-10 h-10" />
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-md hover:bg-gray-700">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-[280px] bg-gradient-to-b from-slate-500 to-gray-800 text-white border-r-0"
          >
            <div className="w-full flex gap-1 p-1 py-2 justify-center border-b border-slate-400">
              <Image src={k7} alt="k7" width={80} height={80} className="w-20" />
            </div>
            <nav className="flex-grow overflow-y-auto hideScrollBar">
              <Navigation onLinkClick={closeSheet} />
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar - Hidden on small screens */}
      <div
        className={`hidden md:flex flex-col h-screen bg-gradient-to-b from-slate-500 to-gray-800 text-white transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="w-full flex gap-1 p-1 py-2 justify-center border-b border-slate-400">
          <Image
            src={k7}
            alt="k7"
            width={80}
            height={80}
            className={`${isCollapsed ? "w-16" : "w-20"}`}
          />
        </div>

        {/* Navigation items */}
        <nav className="flex-grow overflow-y-auto hideScrollBar">
          <Navigation isCollapsed={isCollapsed} />
        </nav>

        {/* Collapse toggle button */}
        <button
          onClick={toggleSidebar}
          className={`p-2 ${isCollapsed ? "justify-center" : "justify-end"} bg-gray-700 flex transition-all ease-in duration-300`}
        >
          {isCollapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
        </button>
      </div>
    </>
  )
}

