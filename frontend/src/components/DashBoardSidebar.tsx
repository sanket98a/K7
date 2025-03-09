"use client"

import type * as React from "react"
import { BotMessageSquare, ChevronDown, FolderOpen, HelpCircle, LayoutDashboard, Settings } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from "next/link"

const repositories = [
  { name: "Document Repo", icon: "📄" },
  { name: "Database System Repo", icon: "🗄️" },
  { name: "Website Repo", icon: "🌐" },
  { name: "Tabular Assets Repo", icon: "📊" },
  { name: "Data Visualizations Repo", icon: "📈" },
]

const insights = [
  { name: "Document Insights", icon: "📄",path:'dashboard/documentchat' },
  { name: "Database Systems Insights", icon: "🗄️",path:'dashboard/databaseinsights' },
  { name: "Website Insights", icon: "🌐",path:'dashboard/webinsights' },
  { name: "Tabular Insights", icon: "📊" ,path:'dashboard/tabularinsights'},
  { name: "Maths Insights", icon: "➗" ,path:'dashboard/mathinsights'},
  { name: "Data Visualizations Insights", icon: "📈",path:'dashboard/datavisualization' },
]

export function DashBoardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} collapsible="icon" className=" ">
      <SidebarHeader className="p-4  border-b border-white/10">
       
      </SidebarHeader>
      <SidebarSeparator/>
      <SidebarContent className="px-2 mt-10 ">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={'lg'} >
              <div className="flex gap-4 items-center">
            <LayoutDashboard className="h-6 w-6 font-bold" />
              <span className="text-base md:text-md lg:text-lg font-semibold">Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible className="group/collapsible">
            <SidebarMenuItem  >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton size={'lg'}>
                  <div className="flex items-center gap-4">
                <FolderOpen className="h-6 w-6" />
                  <span className="text-base md:text-md lg:text-lg font-semibold">Repositories</span>
                  </div>
                  
                  <ChevronDown className=" h-4 w-4 font-bold ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
              {repositories.map((repo) => (
                <SidebarMenuItem key={repo.name}>
                  <SidebarMenuButton className="pl-8">
                    <span role="img" aria-label={repo.name}>
                      {repo.icon}
                    </span>
                    <span>{repo.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="" size={'lg'}>
                <div className="flex items-center gap-4">
                 
                <BotMessageSquare className='h-8 w-8' />
                  <span className="text-base md:text-md lg:text-lg font-semibold">My Insights</span>
                  </div>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
              {insights.map((insight) => (
                <SidebarMenuItem key={insight.name}>
                  <SidebarMenuButton className="pl-8">
                  <Link href={insight.path}>
                    <span role="img" aria-label={insight.name}>
                      {insight.icon}
                    </span>
                    <span>{insight.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
            <div className="flex items-center gap-4">
              <HelpCircle className="mr-2 h-6 w-6" />
              <span className="text-base md:text-md lg:text-lg font-semibold">Help & Support</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="mb-8">
            <div className="flex items-center gap-4">
              <Settings className="mr-2 h-6 w-6" />
              <span className="text-base md:text-md lg:text-lg font-semibold">Settings</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

