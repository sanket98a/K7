"use client";

import type React from "react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  FolderGit2,
  MessageCircle,
  ChevronDown,
  Menu,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import k7 from "@/assets/k7logo2.png";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

type NavItem = {
  name: string;
  icon: React.ElementType;
  subItems?: { name: string; href: string }[];
};

const getNavItems = (t: any): NavItem[] => [
  { name: t("navigation.home"), icon: Home },
  {
    name: t("navigation.repositories"),
    icon: FolderGit2,
    subItems: [
      {
        name: t("navigation.documentRepo"),
        href: "/dashboard/repository/documentrepo",
      },
      {
        name: t("navigation.tabularRepo"),
        href: "/dashboard/repository/tabularrepo",
      },
      {
        name: t("navigation.databaseRepo"),
        href: "/dashboard/repository/databaserepo",
      },
      { name: t("navigation.webRepo"), href: "/dashboard/repository/webrepo" },
      {
        name: t("navigation.visualRepo"),
        href: "/dashboard/repository/visualrepo",
      },
    ],
  },
  {
    name: t("navigation.insights"),
    icon: MessageCircle,
    subItems: [
      {
        name: t("navigation.documentInsights"),
        href: "/dashboard/chat/documentchat",
      },
      { name: t("navigation.mathInsights"), href: "/dashboard/chat/mathchat" },
      {
        name: t("navigation.tabularInsights"),
        href: "/dashboard/chat/tabularchat",
      },
      {
        name: t("navigation.databaseInsights"),
        href: "/dashboard/chat/databasechat",
      },
      { name: t("navigation.webInsights"), href: "/dashboard/chat/webchat" },
      {
        name: t("navigation.visualInsights"),
        href: "/dashboard/chat/visualchat",
      },
    ],
  },
];

// Navigation component that can be reused in both sidebar and sheet
const Navigation = ({ isCollapsed = false, onLinkClick = () => {} }) => {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const navItems = getNavItems(t);

  return (
    <ul className="px-2 py-4" dir={isRTL ? "rtl" : "ltr"}>
      {navItems.map((item) => (
        <li key={item.name} className="mb-2">
          {item.subItems ? (
            <Collapsible className="group/collapsible">
              <CollapsibleTrigger className="w-full">
                <div
                  className={`flex items-center justify-center px-4 py-2 text-sm rounded-md hover:bg-gray-200 hover:text-blue-600 hover:border-${
                    isRTL ? "r" : "l"
                  }-4 border-blue-500 transition-all ease-in ${isRTL ? 'text-xl font-notoNaskhArabic' : 'font-poppins'}`}
                >
                  <item.icon className={`h-6 w-6 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {!isCollapsed && (
                    <>
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`${
                          isRTL ? "mr-auto" : "ml-auto"
                        } h-4 w-4 group-data-[state=open]/collapsible:rotate-180`}
                      />
                    </>
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {!isCollapsed && (
                  <ul className={`${isRTL ? "mr-5" : "ml-5"} px-1 py-2 mt-2`}>
                    {item.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.href}
                          className={`block px-4 py-2 text-sm hover:bg-gray-200 hover:text-blue-600 hover:border-${
                            isRTL ? "r" : "l"
                          }-4 border-blue-500 ${
                            pathname.replace(`/${locale}`, "") === subItem.href
                              ? `bg-gray-200 text-blue-600 border-${
                                  isRTL ? "r" : "l"
                                }-4 border-blue-500 font-semibold`
                              : ""
                          } ${isRTL ? 'text-xl font-notoNaskhArabic' : 'font-poppins'}`}
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
              className={`flex items-center px-4 py-2 rounded-md text-sm ${
                isCollapsed ? "justify-center" : "justify-start"
              } hover:bg-gray-200 hover:text-blue-600 hover:border-${
                isRTL ? "r" : "l"
              }-4 border-blue-500 ${
                pathname === "/dashboard"
                  ? `bg-gray-200 text-blue-600 border-${
                      isRTL ? "r" : "l"
                    }-4 border-blue-500 font-semibold`
                  : ""
              } ${isRTL ? 'text-xl font-notoNaskhArabic' : 'font-poppins'}`}
              onClick={onLinkClick}
            >
              <item.icon className={`h-6 w-6 ${isRTL ? "ml-2" : "mr-2"}`} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export function MobileDashboardSidebar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const closeSheet = () => setIsSheetOpen(false);
  return (
    <div className="md:hidden flex items-center justify-between gap-2 p-2 bg-transparent">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <button className="p-2 rounded-full bg-transparent hover:bg-white hover:bg-opacity-10">
            <span>
              <Menu className="h-8 w-8 text-gray-600" />
            </span>
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-[280px] bg-gradient-to-b from-slate-500 to-gray-800 text-white border-r-0"
        >
          <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
          <div className="w-full flex gap-1 p-1 py-2 justify-center border-b border-slate-400">
            <Image src={k7} alt="k7" width={80} height={80} className="w-20" />
          </div>
          <nav className="flex-grow overflow-y-auto hideScrollBar">
            <Navigation onLinkClick={closeSheet} />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center">
        <Image src={k7} alt="k7" width={40} height={40} className="w-10" />
      </div>
    </div>
  );
}

export function CustomSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const closeSheet = () => setIsSheetOpen(false);

  return (
    <>
      {/* Mobile Header - Only visible on small screens */}

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
          className={`p-2 ${
            isCollapsed ? "justify-center" : "justify-end"
          } bg-gray-700 flex transition-all ease-in duration-300`}
        >
          {isCollapsed ? (
            <ChevronRight className="h-6 w-6" />
          ) : (
            <ChevronLeft className="h-6 w-6" />
          )}
        </button>
      </div>
    </>
  );
}
